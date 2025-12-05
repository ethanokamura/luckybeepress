"use client";

import { useState } from "react";
import { createOrderItems } from "@/actions/order-items";
import { OrderItems } from "@/types/order-items";

export default function CreateOrderItems() {
  const [orderItems, setOrderItems] = useState<OrderItems>();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSnackbar, setshowSnackbar] = useState(false);

  const createNewOrderItems = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const body = {
      order_id: JSON.stringify(formData.get("order_id")),
      product_id: JSON.stringify(formData.get("product_id")),
      sku: JSON.stringify(formData.get("sku")),
      product_name: JSON.stringify(formData.get("product_name")),
      quantity: JSON.stringify(formData.get("quantity")),
      unit_wholesale_price: JSON.stringify(formData.get("unit_wholesale_price")),
      subtotal: JSON.stringify(formData.get("subtotal")),
    };

    setLoading(true);
    const res = await createOrderItems(body);
    if (res.success && res.data?.id) {
      setOrderItems(res.data);
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
            <h1 className="text-5xl font-bold">Create OrderItems</h1>
            <p className="py-6">Populate the database with some data!</p>
          </div>
        </div>
      </div>
      <div className="bg-base-100 p-4 md:p-10 rounded-md border-base-300 border shadow-md">
        <form onSubmit={createNewOrderItems}>
          <fieldset className="fieldset mx-auto max-w-2xl">
              <legend className="fieldset-legend">OrderId</legend>
              <input
                name="order_id"
                type="text"
                className="input bg-base-200 w-full border-base-300 rounded-sm"
                placeholder="Enter your order id"
              />
              <legend className="fieldset-legend">ProductId</legend>
              <input
                name="product_id"
                type="text"
                className="input bg-base-200 w-full border-base-300 rounded-sm"
                placeholder="Enter your product id"
              />
              <legend className="fieldset-legend">Sku</legend>
              <input
                name="sku"
                type="text"
                className="input bg-base-200 w-full border-base-300 rounded-sm"
                placeholder="Enter your sku"
              />
              <legend className="fieldset-legend">ProductName</legend>
              <input
                name="product_name"
                type="text"
                className="input bg-base-200 w-full border-base-300 rounded-sm"
                placeholder="Enter your product name"
              />
              <legend className="fieldset-legend">Quantity</legend>
              <input
                name="quantity"
                type="text"
                className="input bg-base-200 w-full border-base-300 rounded-sm"
                placeholder="Enter your quantity"
              />
              <legend className="fieldset-legend">UnitWholesalePrice</legend>
              <input
                name="unit_wholesale_price"
                type="text"
                className="input bg-base-200 w-full border-base-300 rounded-sm"
                placeholder="Enter your unit wholesale price"
              />
              <legend className="fieldset-legend">Subtotal</legend>
              <input
                name="subtotal"
                type="text"
                className="input bg-base-200 w-full border-base-300 rounded-sm"
                placeholder="Enter your subtotal"
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
            ? "Successfully created orderItems!"
            : "Unable to create orderItems. Please try again later."}
        </div>
      )}
    </main>
  );
}
