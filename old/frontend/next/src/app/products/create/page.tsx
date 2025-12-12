"use client";

import { useState } from "react";
import { createProducts } from "@/actions/products";
import { Products } from "@/types/products";

export default function CreateProducts() {
  const [products, setProducts] = useState<Products>();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSnackbar, setshowSnackbar] = useState(false);

  const createNewProducts = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const body = {
      sku: JSON.stringify(formData.get("sku")),
      name: JSON.stringify(formData.get("name")),
      wholesale_price: JSON.stringify(formData.get("wholesale_price")),
    };

    setLoading(true);
    const res = await createProducts(body);
    if (res.success && res.data?.id) {
      setProducts(res.data);
      setSuccess(true);
      setshowSnackbar(true);
    } else {
      setSuccess(false);
      setshowSnackbar(true);
    }
    setLoading(false);
  };

  return (
    <main>
      <div className="hero">
        <div className="hero-content text-center">
          <div>
            <h1 className="text-5xl font-bold">Create Products</h1>
            <p className="py-6">Populate the database with some data!</p>
          </div>
        </div>
      </div>
      <div className="bg-base-100 p-4 md:p-10 rounded-md border-base-300 border shadow-md">
        <form onSubmit={createNewProducts}>
          <fieldset className="fieldset mx-auto max-w-2xl">
              <legend className="fieldset-legend">Sku</legend>
              <input
                name="sku"
                type="text"
                className="input bg-base-200 w-full border-base-300 rounded-sm"
                placeholder="Enter your sku"
              />
              <legend className="fieldset-legend">Name</legend>
              <input
                name="name"
                type="text"
                className="input bg-base-200 w-full border-base-300 rounded-sm"
                placeholder="Enter your name"
              />
              <legend className="fieldset-legend">WholesalePrice</legend>
              <input
                name="wholesale_price"
                type="text"
                className="input bg-base-200 w-full border-base-300 rounded-sm"
                placeholder="Enter your wholesale price"
              />
            <br />
            <button
              className="bg-primary text-base-200 py-2 rounded-sm w-full"
              type="submit"
            >
              Create
            </button>
          </fieldset>
        </form>
      </div>
      {loading ? (
        <div className="fixed bottom-10 right-10 bg-text-primary text-base-200 rounded px-8 py-4">
          Loading...
        </div>
      ) : (
        <div
          className={`${
            showSnackbar ? "" : "hidden"
          } fixed bottom-10 right-10 ${
            success ? "bg-success/20 text-success" : "bg-error/20 text-error"
          } rounded px-8 py-4`}
        >
          {success
            ? "Successfully created products!"
            : "Unable to create products. Please try again later."}
        </div>
      )}
    </main>
  );
}
