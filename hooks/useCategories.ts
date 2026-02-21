"use client";

import { useEffect, useState } from "react";
import { getDocs, query, orderBy } from "firebase/firestore";
import { collections } from "@/lib/firebase-helpers";
import type { Category } from "@/types";

// Fallback list used when the categories collection is empty
export const DEFAULT_CATEGORIES: Omit<Category, "id" | "createdAt" | "updatedAt">[] = [
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

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const snap = await getDocs(
          query(collections.categories, orderBy("order", "asc"))
        );
        if (!snap.empty) {
          setCategories(snap.docs.map((d) => d.data()));
        }
        // If empty, categories stays [] — callers handle the empty case
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading };
}
