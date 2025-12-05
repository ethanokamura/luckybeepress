"use client";

import { useState } from "react";
import { createOrders } from "@/actions/orders";
import { Orders } from "@/types/orders";

export default function CreateOrders() {
  const [orders, setOrders] = useState<Orders>();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSnackbar, setshowSnackbar] = useState(false);

  const createNewOrders = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const body = {
      order_number: JSON.stringify(formData.get("order_number")),
      customer_id: JSON.stringify(formData.get("customer_id")),
      shipping_address_1: JSON.stringify(formData.get("shipping_address_1")),
      shipping_city: JSON.stringify(formData.get("shipping_city")),
      shipping_state: JSON.stringify(formData.get("shipping_state")),
      shipping_postal_code: JSON.stringify(formData.get("shipping_postal_code")),
      shipping_country: JSON.stringify(formData.get("shipping_country")),
      subtotal: JSON.stringify(formData.get("subtotal")),
      total_amount: JSON.stringify(formData.get("total_amount")),
      order_date: JSON.stringify(formData.get("order_date")),
    };

    setLoading(true);
    const res = await createOrders(body);
    if (res.success && res.data?.id) {
      setOrders(res.data);
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
            <h1 className="text-5xl font-bold">Create Orders</h1>
            <p className="py-6">Populate the database with some data!</p>
          </div>
        </div>
      </div>
      <div className="bg-base-100 p-4 md:p-10 rounded-md border-base-300 border shadow-md">
        <form onSubmit={createNewOrders}>
          <fieldset className="fieldset mx-auto max-w-2xl">
              <legend className="fieldset-legend">OrderNumber</legend>
              <input
                name="order_number"
                type="text"
                className="input bg-base-200 w-full border-base-300 rounded-sm"
                placeholder="Enter your order number"
              />
              <legend className="fieldset-legend">CustomerId</legend>
              <input
                name="customer_id"
                type="text"
                className="input bg-base-200 w-full border-base-300 rounded-sm"
                placeholder="Enter your customer id"
              />
              <legend className="fieldset-legend">ShippingAddress1</legend>
              <input
                name="shipping_address_1"
                type="text"
                className="input bg-base-200 w-full border-base-300 rounded-sm"
                placeholder="Enter your shipping address 1"
              />
              <legend className="fieldset-legend">ShippingCity</legend>
              <input
                name="shipping_city"
                type="text"
                className="input bg-base-200 w-full border-base-300 rounded-sm"
                placeholder="Enter your shipping city"
              />
              <legend className="fieldset-legend">ShippingState</legend>
              <input
                name="shipping_state"
                type="text"
                className="input bg-base-200 w-full border-base-300 rounded-sm"
                placeholder="Enter your shipping state"
              />
              <legend className="fieldset-legend">ShippingPostalCode</legend>
              <input
                name="shipping_postal_code"
                type="text"
                className="input bg-base-200 w-full border-base-300 rounded-sm"
                placeholder="Enter your shipping postal code"
              />
              <legend className="fieldset-legend">ShippingCountry</legend>
              <input
                name="shipping_country"
                type="text"
                className="input bg-base-200 w-full border-base-300 rounded-sm"
                placeholder="Enter your shipping country"
              />
              <legend className="fieldset-legend">Subtotal</legend>
              <input
                name="subtotal"
                type="text"
                className="input bg-base-200 w-full border-base-300 rounded-sm"
                placeholder="Enter your subtotal"
              />
              <legend className="fieldset-legend">TotalAmount</legend>
              <input
                name="total_amount"
                type="text"
                className="input bg-base-200 w-full border-base-300 rounded-sm"
                placeholder="Enter your total amount"
              />
              <legend className="fieldset-legend">OrderDate</legend>
              <input
                name="order_date"
                type="text"
                className="input bg-base-200 w-full border-base-300 rounded-sm"
                placeholder="Enter your order date"
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
            ? "Successfully created orders!"
            : "Unable to create orders. Please try again later."}
        </div>
      )}
    </main>
  );
}
