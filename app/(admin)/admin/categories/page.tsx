"use client";

import { useEffect, useState, useCallback } from "react";
import { getDocs, query, orderBy } from "firebase/firestore";
import { collections } from "@/lib/firebase-helpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUp, ArrowDown, Pencil, Trash2, Check, X, Tag } from "lucide-react";
import type { Category } from "@/types";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  // Add new category
  const [newName, setNewName] = useState("");
  const [newSupportsBoxSet, setNewSupportsBoxSet] = useState(false);

  // Inline edit
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editSupportsBoxSet, setEditSupportsBoxSet] = useState(false);

  // Delete flow
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleteProductCount, setDeleteProductCount] = useState(0);
  const [deleteStep, setDeleteStep] = useState<"confirm" | "reassign" | "progress" | "done">("confirm");
  const [reassignToId, setReassignToId] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const snap = await getDocs(
        query(collections.categories, orderBy("order", "asc"))
      );
      setCategories(snap.docs.map((d) => d.data()));
    } catch (e) {
      console.error("Error fetching categories:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSeed = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seed: true }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to seed categories");
        return;
      }
      await fetchCategories();
    } finally {
      setBusy(false);
    }
  };

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim(), supportsBoxSet: newSupportsBoxSet }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to create category");
        return;
      }
      setNewName("");
      setNewSupportsBoxSet(false);
      await fetchCategories();
    } finally {
      setBusy(false);
    }
  };

  const handleSaveEdit = async (cat: Category) => {
    if (!editName.trim()) return;
    const nameChanged = editName.trim() !== cat.name;
    const boxChanged = editSupportsBoxSet !== cat.supportsBoxSet;
    if (!nameChanged && !boxChanged) {
      setEditId(null);
      return;
    }
    setBusy(true);
    try {
      const body: Record<string, unknown> = {};
      if (nameChanged) body.name = editName.trim();
      if (boxChanged) body.supportsBoxSet = editSupportsBoxSet;

      const res = await fetch(`/api/admin/categories/${cat.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to update category");
        return;
      }
      setEditId(null);
      await fetchCategories();
    } finally {
      setBusy(false);
    }
  };

  const handleMove = async (cat: Category, direction: "up" | "down") => {
    const idx = categories.findIndex((c) => c.id === cat.id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= categories.length) return;

    const other = categories[swapIdx];
    setBusy(true);
    try {
      await Promise.all([
        fetch(`/api/admin/categories/${cat.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: other.order }),
        }),
        fetch(`/api/admin/categories/${other.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: cat.order }),
        }),
      ]);
      await fetchCategories();
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteClick = (cat: Category) => {
    setDeleteTarget(cat);
    setDeleteProductCount(0);
    setReassignToId("");
    setDeleteStep("confirm");
    setDeleteModalOpen(true);
  };

  const executeDelete = async (withReassign = false) => {
    if (!deleteTarget) return;
    setDeleteStep("progress");

    const url = withReassign && reassignToId
      ? `/api/admin/categories/${deleteTarget.id}?reassignTo=${reassignToId}`
      : `/api/admin/categories/${deleteTarget.id}`;

    try {
      const res = await fetch(url, { method: "DELETE" });
      const data = await res.json();

      if (res.status === 409 && data.count) {
        setDeleteProductCount(data.count);
        setDeleteStep("reassign");
        return;
      }

      if (!res.ok) {
        alert(data.error || "Failed to delete category");
        setDeleteStep("confirm");
        return;
      }

      setDeleteStep("done");
      setTimeout(() => {
        setDeleteModalOpen(false);
        setDeleteTarget(null);
        fetchCategories();
      }, 1000);
    } catch {
      alert("Failed to delete category");
      setDeleteStep("confirm");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted animate-pulse rounded w-40" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-14 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Categories</h1>
        {categories.length === 0 && (
          <Button variant="outline" size="sm" onClick={handleSeed} disabled={busy}>
            Seed Defaults
          </Button>
        )}
      </div>

      {categories.length === 0 ? (
        <div className="bg-card border rounded-lg p-12 text-center">
          <Tag className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="text-xl font-medium mb-2">No categories yet</h2>
          <p className="text-muted-foreground mb-6">
            Seed the default category list or add categories manually below.
          </p>
          <Button onClick={handleSeed} disabled={busy}>Seed Default Categories</Button>
        </div>
      ) : (
        <div className="bg-card border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="text-left p-4 font-medium w-10">#</th>
                <th className="text-left p-4 font-medium">Name</th>
                <th className="text-center p-4 font-medium w-28">Box Sets</th>
                <th className="text-right p-4 font-medium w-36">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {categories.map((cat, idx) => (
                <tr key={cat.id} className="hover:bg-muted/20">
                  <td className="p-4 text-muted-foreground">{idx + 1}</td>
                  <td className="p-4">
                    {editId === cat.id ? (
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveEdit(cat);
                          if (e.key === "Escape") setEditId(null);
                        }}
                        className="h-8 text-sm"
                        autoFocus
                      />
                    ) : (
                      <span className="font-medium">{cat.name}</span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    {editId === cat.id ? (
                      <input
                        type="checkbox"
                        checked={editSupportsBoxSet}
                        onChange={(e) => setEditSupportsBoxSet(e.target.checked)}
                        className="cursor-pointer"
                      />
                    ) : cat.supportsBoxSet ? (
                      <Check className="w-4 h-4 text-green-600 mx-auto" />
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1">
                      {editId === cat.id ? (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleSaveEdit(cat)}
                            disabled={busy}
                            title="Save"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => setEditId(null)}
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleMove(cat, "up")}
                            disabled={busy || idx === 0}
                            title="Move up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleMove(cat, "down")}
                            disabled={busy || idx === categories.length - 1}
                            title="Move down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => {
                              setEditId(cat.id);
                              setEditName(cat.name);
                              setEditSupportsBoxSet(cat.supportsBoxSet);
                            }}
                            disabled={busy}
                            title="Edit"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteClick(cat)}
                            disabled={busy}
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add new category */}
      <div className="bg-card border rounded-lg p-4">
        <h2 className="text-sm font-semibold mb-3">Add Category</h2>
        <div className="flex items-center gap-3">
          <Input
            placeholder="Category name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            className="flex-1"
          />
          <label className="flex items-center gap-2 text-sm whitespace-nowrap">
            <input
              type="checkbox"
              checked={newSupportsBoxSet}
              onChange={(e) => setNewSupportsBoxSet(e.target.checked)}
              className="cursor-pointer"
            />
            Box Sets
          </label>
          <Button onClick={handleAdd} disabled={busy || !newName.trim()} size="sm">
            Add
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          &ldquo;Box Sets&rdquo; allows products in this category to have a box set option (6 cards/box).
        </p>
      </div>

      {/* Delete modal */}
      {deleteModalOpen && deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => deleteStep !== "progress" && setDeleteModalOpen(false)}
          />
          <div className="relative z-10 bg-background border rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            {deleteStep === "progress" ? (
              <div className="text-center space-y-4">
                <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm font-medium">Processing…</p>
              </div>
            ) : deleteStep === "done" ? (
              <div className="text-center space-y-4">
                <Check className="mx-auto w-8 h-8 text-green-600" />
                <p className="font-medium">Category deleted.</p>
              </div>
            ) : deleteStep === "reassign" ? (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Reassign Products</h2>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{deleteTarget.name}</span> has{" "}
                  <span className="font-medium text-foreground">{deleteProductCount}</span> product
                  {deleteProductCount !== 1 ? "s" : ""}. Choose a category to move them to before deleting.
                </p>
                <select
                  value={reassignToId}
                  onChange={(e) => setReassignToId(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">— Select a category —</option>
                  {categories
                    .filter((c) => c.id !== deleteTarget.id)
                    .map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" size="sm" onClick={() => setDeleteModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={!reassignToId}
                    onClick={() => executeDelete(true)}
                  >
                    Reassign &amp; Delete
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Delete Category</h2>
                <p className="text-sm text-muted-foreground">
                  Delete <span className="font-medium text-foreground">{deleteTarget.name}</span>?
                  This cannot be undone.
                </p>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" size="sm" onClick={() => setDeleteModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => executeDelete(false)}>
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
