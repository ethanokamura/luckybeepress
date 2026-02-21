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

const MAX_FEATURED = 12;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { featured }: { featured: boolean } = await request.json();

    const productRef = adminDb.collection("products").doc(id);
    const productSnap = await productRef.get();

    if (!productSnap.exists) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    let featuredOrder: number | null = null;

    if (featured) {
      // Enforce cap
      const countSnap = await adminDb
        .collection("products")
        .where("featured", "==", true)
        .count()
        .get();

      if (countSnap.data().count >= MAX_FEATURED) {
        return NextResponse.json(
          { error: `Cannot feature more than ${MAX_FEATURED} products` },
          { status: 400 }
        );
      }

      featuredOrder = Date.now();
    }

    await productRef.update({ featured, featuredOrder });

    // Sync to Algolia if admin key is configured
    const algoliaAdminKey = process.env.ALGOLIA_ADMIN_API_KEY;
    if (algoliaAdminKey) {
      const algoliaAdmin = algoliasearch(
        process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
        algoliaAdminKey
      );
      await algoliaAdmin.partialUpdateObject({
        indexName: PRODUCTS_INDEX,
        objectID: id,
        attributesToUpdate: { featured, featuredOrder },
      });
    }

    return NextResponse.json({ success: true, featured, featuredOrder });
  } catch (error) {
    console.error("Error toggling featured:", error);
    return NextResponse.json(
      { error: "Failed to toggle featured status" },
      { status: 500 }
    );
  }
}
