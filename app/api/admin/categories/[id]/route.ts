import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { algoliasearch } from "algoliasearch";
import { PRODUCTS_INDEX } from "@/lib/algolia";

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const adminDb = getFirestore();

const BATCH_SIZE = 400;
const ALGOLIA_CONCURRENCY = 50;

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

// PATCH /api/admin/categories/[id]
// Body: { name?, order?, supportsBoxSet? }
// If name changes, cascades to all products + Algolia sync
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, order, supportsBoxSet } = body;

    const catRef = adminDb.collection("categories").doc(id);
    const catSnap = await catRef.get();
    if (!catSnap.exists) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const oldData = catSnap.data()!;
    const now = new Date();
    const updates: Record<string, unknown> = { updatedAt: now };

    if (typeof order === "number") updates.order = order;
    if (typeof supportsBoxSet === "boolean") updates.supportsBoxSet = supportsBoxSet;

    const nameChanged = typeof name === "string" && name.trim() !== oldData.name;

    if (nameChanged) {
      const newName = name.trim();

      // Check duplicate
      const dupe = await adminDb
        .collection("categories")
        .where("name", "==", newName)
        .limit(1)
        .get();
      if (!dupe.empty) {
        return NextResponse.json(
          { error: "A category with that name already exists" },
          { status: 409 }
        );
      }

      updates.name = newName;

      // Cascade: update all products with the old category name
      const productSnap = await adminDb
        .collection("products")
        .where("category", "==", oldData.name)
        .get();

      const productIds = productSnap.docs.map((d) => d.id);

      if (productIds.length > 0) {
        const idChunks = chunkArray(productIds, BATCH_SIZE);
        for (const chunk of idChunks) {
          const batch = adminDb.batch();
          for (const pid of chunk) {
            batch.update(adminDb.collection("products").doc(pid), {
              category: newName,
              updatedAt: now,
            });
          }
          await batch.commit();
        }

        // Algolia sync
        const algoliaAdminKey = process.env.ALGOLIA_ADMIN_API_KEY;
        if (algoliaAdminKey && productIds.length > 0) {
          const algoliaAdmin = algoliasearch(
            process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
            algoliaAdminKey
          );
          const algoliaChunks = chunkArray(productIds, ALGOLIA_CONCURRENCY);
          for (const chunk of algoliaChunks) {
            await Promise.all(
              chunk.map((pid) =>
                algoliaAdmin.partialUpdateObject({
                  indexName: PRODUCTS_INDEX,
                  objectID: pid,
                  attributesToUpdate: { category: newName },
                })
              )
            );
          }
        }
      }
    }

    await catRef.update(updates);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

// DELETE /api/admin/categories/[id]?reassignTo=<categoryId>
// If products are assigned and no reassignTo: returns 409 with count
// If reassignTo is provided: reassigns products then deletes category
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const reassignToId = searchParams.get("reassignTo");

    const catRef = adminDb.collection("categories").doc(id);
    const catSnap = await catRef.get();
    if (!catSnap.exists) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const catData = catSnap.data()!;

    // Check for assigned products
    const productSnap = await adminDb
      .collection("products")
      .where("category", "==", catData.name)
      .get();

    const productIds = productSnap.docs.map((d) => d.id);

    if (productIds.length > 0 && !reassignToId) {
      return NextResponse.json(
        { error: "Category has products", count: productIds.length },
        { status: 409 }
      );
    }

    const now = new Date();

    if (productIds.length > 0 && reassignToId) {
      // Fetch target category name
      const targetSnap = await adminDb.collection("categories").doc(reassignToId).get();
      if (!targetSnap.exists) {
        return NextResponse.json({ error: "Reassign target not found" }, { status: 404 });
      }
      const targetName = (targetSnap.data()!.name) as string;

      // Batch update products
      const idChunks = chunkArray(productIds, BATCH_SIZE);
      for (const chunk of idChunks) {
        const batch = adminDb.batch();
        for (const pid of chunk) {
          batch.update(adminDb.collection("products").doc(pid), {
            category: targetName,
            updatedAt: now,
          });
        }
        await batch.commit();
      }

      // Algolia sync
      const algoliaAdminKey = process.env.ALGOLIA_ADMIN_API_KEY;
      if (algoliaAdminKey) {
        const algoliaAdmin = algoliasearch(
          process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
          algoliaAdminKey
        );
        const algoliaChunks = chunkArray(productIds, ALGOLIA_CONCURRENCY);
        for (const chunk of algoliaChunks) {
          await Promise.all(
            chunk.map((pid) =>
              algoliaAdmin.partialUpdateObject({
                indexName: PRODUCTS_INDEX,
                objectID: pid,
                attributesToUpdate: { category: targetName },
              })
            )
          );
        }
      }
    }

    await catRef.delete();

    return NextResponse.json({ success: true, reassigned: productIds.length });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
