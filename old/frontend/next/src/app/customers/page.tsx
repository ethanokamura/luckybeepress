"use client";

import { useState, useEffect } from "react";
import { findCustomers, deleteCustomers } from "@/actions/customers";
import { Customers } from "@/types/customers";
import { BiPlus, BiTrash } from "react-icons/bi";
import Link from "next/link";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customers[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      const res = await findCustomers({ limit: 10 });
      if (res.success && res.data) {
        setCustomers(res.data);
      }
      setLoading(false);
    };
    fetchCustomers();
  }, []);

  const removeCustomers = async (id: string | null) => {
    if (!id) return;
    setLoading(true);
    await deleteCustomers(id);
    const res = await findCustomers({ limit: 10 });
    if (res.success && res.data) {
      setCustomers(res.data);
    }
    setLoading(false);
  };

  return (
    <main className="p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Table: Customers</h1>

      {/* Schema Info */}
      <div className="mb-8 overflow-x-auto rounded-md border border-base-300 shadow-lg bg-base-100">
        <table className="w-full border-collapse">
          <thead className="bg-base-200">
            <tr>
              <th className="text-primary p-3 text-left">Column</th>
              <th className="text-primary p-3 text-left">Type</th>
              <th className="text-primary p-3 text-left">Nullable</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-border">
              <td className="text-primary p-3">id</td>
              <td className="text-secondary p-3">
                <span className="bg-primary-light/20 px-2 py-1 rounded text-primary">
                  string | null
                </span>
              </td>
              <td className="text-secondary p-3">Yes</td>
            </tr>
            <tr className="border-t border-border">
              <td className="text-primary p-3">business_name</td>
              <td className="text-secondary p-3">
                <span className="bg-primary-light/20 px-2 py-1 rounded text-primary">
                  string
                </span>
              </td>
              <td className="text-secondary p-3">No</td>
            </tr>
            <tr className="border-t border-border">
              <td className="text-primary p-3">contact_name</td>
              <td className="text-secondary p-3">
                <span className="bg-primary-light/20 px-2 py-1 rounded text-primary">
                  string | null
                </span>
              </td>
              <td className="text-secondary p-3">Yes</td>
            </tr>
            <tr className="border-t border-border">
              <td className="text-primary p-3">email</td>
              <td className="text-secondary p-3">
                <span className="bg-primary-light/20 px-2 py-1 rounded text-primary">
                  string
                </span>
              </td>
              <td className="text-secondary p-3">No</td>
            </tr>
            <tr className="border-t border-border">
              <td className="text-primary p-3">phone</td>
              <td className="text-secondary p-3">
                <span className="bg-primary-light/20 px-2 py-1 rounded text-primary">
                  string | null
                </span>
              </td>
              <td className="text-secondary p-3">Yes</td>
            </tr>
            <tr className="border-t border-border">
              <td className="text-primary p-3">tax_id</td>
              <td className="text-secondary p-3">
                <span className="bg-primary-light/20 px-2 py-1 rounded text-primary">
                  string | null
                </span>
              </td>
              <td className="text-secondary p-3">Yes</td>
            </tr>
            <tr className="border-t border-border">
              <td className="text-primary p-3">account_status</td>
              <td className="text-secondary p-3">
                <span className="bg-primary-light/20 px-2 py-1 rounded text-primary">
                  string | null
                </span>
              </td>
              <td className="text-secondary p-3">Yes</td>
            </tr>
            <tr className="border-t border-border">
              <td className="text-primary p-3">net_terms</td>
              <td className="text-secondary p-3">
                <span className="bg-primary-light/20 px-2 py-1 rounded text-primary">
                  number | null
                </span>
              </td>
              <td className="text-secondary p-3">Yes</td>
            </tr>
            <tr className="border-t border-border">
              <td className="text-primary p-3">discount_percentage</td>
              <td className="text-secondary p-3">
                <span className="bg-primary-light/20 px-2 py-1 rounded text-primary">
                  number | null
                </span>
              </td>
              <td className="text-secondary p-3">Yes</td>
            </tr>
            <tr className="border-t border-border">
              <td className="text-primary p-3">first_order_date</td>
              <td className="text-secondary p-3">
                <span className="bg-primary-light/20 px-2 py-1 rounded text-primary">
                  Date | null
                </span>
              </td>
              <td className="text-secondary p-3">Yes</td>
            </tr>
            <tr className="border-t border-border">
              <td className="text-primary p-3">total_orders</td>
              <td className="text-secondary p-3">
                <span className="bg-primary-light/20 px-2 py-1 rounded text-primary">
                  number | null
                </span>
              </td>
              <td className="text-secondary p-3">Yes</td>
            </tr>
            <tr className="border-t border-border">
              <td className="text-primary p-3">lifetime_value</td>
              <td className="text-secondary p-3">
                <span className="bg-primary-light/20 px-2 py-1 rounded text-primary">
                  number | null
                </span>
              </td>
              <td className="text-secondary p-3">Yes</td>
            </tr>
            <tr className="border-t border-border">
              <td className="text-primary p-3">notes</td>
              <td className="text-secondary p-3">
                <span className="bg-primary-light/20 px-2 py-1 rounded text-primary">
                  string | null
                </span>
              </td>
              <td className="text-secondary p-3">Yes</td>
            </tr>
            <tr className="border-t border-border">
              <td className="text-primary p-3">created_at</td>
              <td className="text-secondary p-3">
                <span className="bg-primary-light/20 px-2 py-1 rounded text-primary">
                  Date | null
                </span>
              </td>
              <td className="text-secondary p-3">Yes</td>
            </tr>
            <tr className="border-t border-border">
              <td className="text-primary p-3">updated_at</td>
              <td className="text-secondary p-3">
                <span className="bg-primary-light/20 px-2 py-1 rounded text-primary">
                  Date | null
                </span>
              </td>
              <td className="text-secondary p-3">Yes</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">Customers</h1>
          <div className="flex gap-4">
            <Link href="/customers/create">
              <BiPlus size={32} />
            </Link>
          </div>
        </div>
        {!loading &&
          customers.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-base-100 px-6 py-4 rounded-md shadow-md"
            >
              <p className="text-base-content font-bold flex gap-2">
                id:
                <span className="text-base-content/70 font-normal">
                  {item.id}
                </span>
              </p>

              <button
                onClick={() => removeCustomers(item.id)}
                className="flex items-center gap-2 rounded px-4 py-1 bg-error/20 text-error hover:bg-error/40"
              >
                <BiTrash />
                Delete
              </button>
            </div>
          ))}
      </div>
    </main>
  );
}
