"use client";

import { useState } from "react";
import { createCarts } from "@/actions/carts";
import { Carts } from "@/types/carts";

export default function CreateCarts() {
  const [carts, setCarts] = useState<Carts>();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSnackbar, setshowSnackbar] = useState(false);

  const createNewCarts = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const body = {
      customer_id: JSON.stringify(formData.get("customer_id")),
    };

    setLoading(true);
    const res = await createCarts(body);
    if (res.success && res.data?.id) {
      setCarts(res.data);
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
            <h1 className="text-5xl font-bold">Create Carts</h1>
            <p className="py-6">Populate the database with some data!</p>
          </div>
        </div>
      </div>
      <div className="bg-base-100 p-4 md:p-10 rounded-md border-base-300 border shadow-md">
        <form onSubmit={createNewCarts}>
          <fieldset className="fieldset mx-auto max-w-2xl">
              <legend className="fieldset-legend">CustomerId</legend>
              <input
                name="customer_id"
                type="text"
                className="input bg-base-200 w-full border-base-300 rounded-sm"
                placeholder="Enter your customer id"
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
            ? "Successfully created carts!"
            : "Unable to create carts. Please try again later."}
        </div>
      )}
    </main>
  );
}
