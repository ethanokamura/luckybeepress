"use client";

import { useState } from "react";
import { createAddresses } from "@/actions/addresses";
import { Addresses } from "@/types/addresses";

export default function CreateAddresses() {
  const [addresses, setAddresses] = useState<Addresses>();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSnackbar, setshowSnackbar] = useState(false);

  const createNewAddresses = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const body = {
      customer_id: JSON.stringify(formData.get("customer_id")),
      address_type: JSON.stringify(formData.get("address_type")),
      street_address_1: JSON.stringify(formData.get("street_address_1")),
      city: JSON.stringify(formData.get("city")),
      state: JSON.stringify(formData.get("state")),
      postal_code: JSON.stringify(formData.get("postal_code")),
    };

    setLoading(true);
    const res = await createAddresses(body);
    if (res.success && res.data?.id) {
      setAddresses(res.data);
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
            <h1 className="text-5xl font-bold">Create Addresses</h1>
            <p className="py-6">Populate the database with some data!</p>
          </div>
        </div>
      </div>
      <div className="bg-base-100 p-4 md:p-10 rounded-md border-base-300 border shadow-md">
        <form onSubmit={createNewAddresses}>
          <fieldset className="fieldset mx-auto max-w-2xl">
              <legend className="fieldset-legend">CustomerId</legend>
              <input
                name="customer_id"
                type="text"
                className="input bg-base-200 w-full border-base-300 rounded-sm"
                placeholder="Enter your customer id"
              />
              <legend className="fieldset-legend">AddressType</legend>
              <input
                name="address_type"
                type="text"
                className="input bg-base-200 w-full border-base-300 rounded-sm"
                placeholder="Enter your address type"
              />
              <legend className="fieldset-legend">StreetAddress1</legend>
              <input
                name="street_address_1"
                type="text"
                className="input bg-base-200 w-full border-base-300 rounded-sm"
                placeholder="Enter your street address 1"
              />
              <legend className="fieldset-legend">City</legend>
              <input
                name="city"
                type="text"
                className="input bg-base-200 w-full border-base-300 rounded-sm"
                placeholder="Enter your city"
              />
              <legend className="fieldset-legend">State</legend>
              <input
                name="state"
                type="text"
                className="input bg-base-200 w-full border-base-300 rounded-sm"
                placeholder="Enter your state"
              />
              <legend className="fieldset-legend">PostalCode</legend>
              <input
                name="postal_code"
                type="text"
                className="input bg-base-200 w-full border-base-300 rounded-sm"
                placeholder="Enter your postal code"
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
            ? "Successfully created addresses!"
            : "Unable to create addresses. Please try again later."}
        </div>
      )}
    </main>
  );
}
