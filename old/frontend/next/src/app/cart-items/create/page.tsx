"use client";

import { useState } from "react";
import { createCartItems } from "@/actions/cart-items";
import { CartItems } from "@/types/cart-items";

export default function CreateCartItems() {
  const [cartItems, setCartItems] = useState<CartItems>();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSnackbar, setshowSnackbar] = useState(false);

  const createNewCartItems = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const body = {
      cart_id: JSON.stringify(formData.get("cart_id")),
      product_id: JSON.stringify(formData.get("product_id")),
      quantity: JSON.stringify(formData.get("quantity")),
      unit_price: JSON.stringify(formData.get("unit_price")),
    };

    setLoading(true);
    const res = await createCartItems(body);
    if (res.success && res.data?.id) {
      setCartItems(res.data);
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
            <h1 className="text-5xl font-bold">Create CartItems</h1>
            <p className="py-6">Populate the database with some data!</p>
          </div>
        </div>
      </div>
      <div className="bg-base-100 p-4 md:p-10 rounded-md border-base-300 border shadow-md">
        <form onSubmit={createNewCartItems}>
          <fieldset className="fieldset mx-auto max-w-2xl">
              <legend className="fieldset-legend">CartId</legend>
              <input
                name="cart_id"
                type="text"
                className="input bg-base-200 w-full border-base-300 rounded-sm"
                placeholder="Enter your cart id"
              />
              <legend className="fieldset-legend">ProductId</legend>
              <input
                name="product_id"
                type="text"
                className="input bg-base-200 w-full border-base-300 rounded-sm"
                placeholder="Enter your product id"
              />
              <legend className="fieldset-legend">Quantity</legend>
              <input
                name="quantity"
                type="text"
                className="input bg-base-200 w-full border-base-300 rounded-sm"
                placeholder="Enter your quantity"
              />
              <legend className="fieldset-legend">UnitPrice</legend>
              <input
                name="unit_price"
                type="text"
                className="input bg-base-200 w-full border-base-300 rounded-sm"
                placeholder="Enter your unit price"
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
            ? "Successfully created cartItems!"
            : "Unable to create cartItems. Please try again later."}
        </div>
      )}
    </main>
  );
}
