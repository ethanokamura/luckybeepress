"use client";

import { useUser } from "@auth0/nextjs-auth0";
import { AddressBook } from "@/components/account/AddressBook";
import { Skeleton } from "@/components/ui/Skeleton";
import { useCustomerByAuth } from "@/hooks/useCustomer";

export default function AddressesPage() {
  const { user } = useUser();
  const { customer, loading } = useCustomerByAuth({
    authEmail: user?.email || null,
  });

  if (loading) {
    return (
      <div>
        <Skeleton variant="text" className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" className="h-40 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!customer?.id) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold mb-4">Account Not Found</h1>
        <p className="text-base-content/60">
          Please complete your account registration first.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Address Book</h1>
      <AddressBook customerId={customer.id} />
    </div>
  );
}

