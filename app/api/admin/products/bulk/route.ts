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

interface BulkRequest {
  action: "status" | "category" | "delete";
  productIds: string[];
  status?: "draft" | "active" | "archived";
  category?: string;
}

const VALID_STATUSES = ["draft", "active", "archived"] as const;
const BATCH_SIZE = 400;
const ALGOLIA_CONCURRENCY = 50;

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

export async function POST(request: NextRequest) {
  try {
    const body: BulkRequest = await request.json();
    const { action, productIds } = body;

    if (!productIds || productIds.length === 0) {
      return NextResponse.json({ error: "No product IDs provided" }, { status: 400 });
    }

    if (productIds.length > 2000) {
      return NextResponse.json({ error: "Cannot process more than 2000 products at once" }, { status: 400 });
    }

    if (!["status", "category", "delete"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    if (action === "status") {
      if (!body.status || !VALID_STATUSES.includes(body.status)) {
        return NextResponse.json({ error: "Invalid or missing status value" }, { status: 400 });
      }
    }

    if (action === "category" && !body.category) {
      return NextResponse.json({ error: "Missing category value" }, { status: 400 });
    }

    // Process Firestore writes in chunks of BATCH_SIZE
    const idChunks = chunkArray(productIds, BATCH_SIZE);

    for (const chunk of idChunks) {
      const batch = adminDb.batch();
      const now = new Date();

      for (const id of chunk) {
        const ref = adminDb.collection("products").doc(id);
        if (action === "delete") {
          batch.delete(ref);
        } else if (action === "status") {
          batch.update(ref, { status: body.status, updatedAt: now });
        } else if (action === "category") {
          batch.update(ref, { category: body.category, updatedAt: now });
        }
      }

      await batch.commit();
    }

    // Sync to Algolia if admin key is configured
    const algoliaAdminKey = process.env.ALGOLIA_ADMIN_API_KEY;
    if (algoliaAdminKey) {
      const algoliaAdmin = algoliasearch(
        process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
        algoliaAdminKey
      );

      const algoliaChunks = chunkArray(productIds, ALGOLIA_CONCURRENCY);

      for (const chunk of algoliaChunks) {
        if (action === "delete") {
          await Promise.all(
            chunk.map((id) =>
              algoliaAdmin.deleteObject({ indexName: PRODUCTS_INDEX, objectID: id })
            )
          );
        } else {
          const attributesToUpdate: Record<string, unknown> =
            action === "status"
              ? { status: body.status }
              : { category: body.category };

          await Promise.all(
            chunk.map((id) =>
              algoliaAdmin.partialUpdateObject({
                indexName: PRODUCTS_INDEX,
                objectID: id,
                attributesToUpdate,
              })
            )
          );
        }
      }
    }

    return NextResponse.json({ success: true, processed: productIds.length });
  } catch (error) {
    console.error("Error in bulk product operation:", error);
    return NextResponse.json(
      { error: "Bulk operation failed" },
      { status: 500 }
    );
  }
}
