import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

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

const DEFAULT_CATEGORIES = [
  { name: "Birthday", order: 0, supportsBoxSet: false },
  { name: "Thank You", order: 1, supportsBoxSet: true },
  { name: "Holiday", order: 2, supportsBoxSet: true },
  { name: "Christmas", order: 3, supportsBoxSet: true },
  { name: "Hanukkah", order: 4, supportsBoxSet: true },
  { name: "Season's Greetings", order: 5, supportsBoxSet: true },
  { name: "New Year's", order: 6, supportsBoxSet: false },
  { name: "Valentine's Day", order: 7, supportsBoxSet: false },
  { name: "Love", order: 8, supportsBoxSet: false },
  { name: "Sympathy", order: 9, supportsBoxSet: false },
  { name: "Congratulations", order: 10, supportsBoxSet: false },
  { name: "Baby", order: 11, supportsBoxSet: false },
  { name: "Wedding", order: 12, supportsBoxSet: false },
  { name: "Graduation", order: 13, supportsBoxSet: false },
  { name: "Mother's Day", order: 14, supportsBoxSet: false },
  { name: "Father's Day", order: 15, supportsBoxSet: false },
  { name: "Rosh Hashanah", order: 16, supportsBoxSet: false },
  { name: "Easter", order: 17, supportsBoxSet: false },
  { name: "Everyday", order: 18, supportsBoxSet: false },
  { name: "Blank", order: 19, supportsBoxSet: false },
  { name: "Other", order: 20, supportsBoxSet: false },
];

// POST /api/admin/categories
// Body: { name, order?, supportsBoxSet? } | { seed: true }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Seed all defaults
    if (body.seed === true) {
      const existing = await adminDb.collection("categories").count().get();
      if (existing.data().count > 0) {
        return NextResponse.json(
          { error: "Categories already exist. Delete all before re-seeding." },
          { status: 409 }
        );
      }
      const now = new Date();
      const batch = adminDb.batch();
      for (const cat of DEFAULT_CATEGORIES) {
        const ref = adminDb.collection("categories").doc();
        batch.set(ref, { ...cat, createdAt: now, updatedAt: now });
      }
      await batch.commit();
      return NextResponse.json({ success: true, seeded: DEFAULT_CATEGORIES.length });
    }

    // Create single category
    const { name, order, supportsBoxSet = false } = body;
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Check for duplicate name
    const dupe = await adminDb
      .collection("categories")
      .where("name", "==", name.trim())
      .limit(1)
      .get();
    if (!dupe.empty) {
      return NextResponse.json(
        { error: "A category with that name already exists" },
        { status: 409 }
      );
    }

    // Default order = max existing order + 1
    let resolvedOrder = order;
    if (typeof resolvedOrder !== "number") {
      const snap = await adminDb
        .collection("categories")
        .orderBy("order", "desc")
        .limit(1)
        .get();
      resolvedOrder = snap.empty ? 0 : (snap.docs[0].data().order as number) + 1;
    }

    const now = new Date();
    const ref = adminDb.collection("categories").doc();
    await ref.set({
      name: name.trim(),
      order: resolvedOrder,
      supportsBoxSet,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({ success: true, id: ref.id });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
