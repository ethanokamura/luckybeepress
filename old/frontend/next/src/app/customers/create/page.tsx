"use client";

import { useState } from "react";
import { createCustomers } from "@/actions/customers";
import { Customers } from "@/types/customers";

export default function CreateCustomers() {
  const [customers, setCustomers] = useState<Customers>();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSnackbar, setshowSnackbar] = useState(false);

  const createNewCustomers = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const body = {
      business_name: JSON.stringify(formData.get("business_name")),
      email: JSON.stringify(formData.get("email")),
    };

    setLoading(true);
    const res = await createCustomers(body);
    if (res.success && res.data?.id) {
      setCustomers(res.data);
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
            <h1 className="text-5xl font-bold">Create Customers</h1>
            <p className="py-6">Populate the database with some data!</p>
          </div>
        </div>
      </div>
      <div className="bg-base-100 p-4 md:p-10 rounded-md border-base-300 border shadow-md">
        <form onSubmit={createNewCustomers}>
          <fieldset className="fieldset mx-auto max-w-2xl">
              <legend className="fieldset-legend">BusinessName</legend>
              <input
                name="business_name"
                type="text"
                className="input bg-base-200 w-full border-base-300 rounded-sm"
                placeholder="Enter your business name"
              />
              <legend className="fieldset-legend">Email</legend>
              <input
                name="email"
                type="text"
                className="input bg-base-200 w-full border-base-300 rounded-sm"
                placeholder="Enter your email"
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
            ? "Successfully created customers!"
            : "Unable to create customers. Please try again later."}
        </div>
      )}
    </main>
  );
}
