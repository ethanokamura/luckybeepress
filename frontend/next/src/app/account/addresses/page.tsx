"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Card, CardContent, Button, Badge, Loading } from "@/components/ui";
import { FiPlus, FiEdit2, FiTrash2, FiCheck } from "react-icons/fi";
import Link from "next/link";

interface Address {
  id: string;
  label: string;
  companyName: string;
  contactName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export default function AddressesPage() {
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();

  // Mock addresses - in real app, fetch from API
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      label: "Main Store",
      companyName: "Sunshine Stationery & Gifts",
      contactName: "Sarah Johnson",
      address1: "123 Main Street",
      address2: "Suite 200",
      city: "Santa Cruz",
      state: "OR",
      postalCode: "97201",
      country: "USA",
      phone: "(831) 419-0778",
      isDefault: true,
    },
    {
      id: "2",
      label: "Warehouse",
      companyName: "Sunshine Stationery & Gifts",
      contactName: "John Smith",
      address1: "456 Industrial Way",
      city: "Santa Cruz",
      state: "OR",
      postalCode: "97202",
      country: "USA",
      phone: "(555) 123-4568",
      isDefault: false,
    },
  ]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/api/auth/login");
    }
  }, [user, userLoading, router]);

  if (userLoading) {
    return <Loading text="Loading addresses..." />;
  }

  if (!user) {
    return null;
  }

  const handleSetDefault = (addressId: string) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === addressId,
      }))
    );
  };

  const handleDelete = (addressId: string) => {
    if (confirm("Are you sure you want to delete this address?")) {
      setAddresses(addresses.filter((addr) => addr.id !== addressId));
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link
          href="/account"
          className="text-sm text-neutral-content hover:underline mb-2 inline-block"
        >
          ← Back to Account
        </Link>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-neutral font-serif mb-2">
              Addresses
            </h1>
            <p className="text-base-content">
              Manage your shipping and billing addresses
            </p>
          </div>
          <Button variant="primary">
            <FiPlus className="w-4 h-4 mr-2" />
            Add New Address
          </Button>
        </div>
      </div>

      {addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {addresses.map((address) => (
            <Card key={address.id} className="relative">
              <CardContent>
                {/* Default Badge */}
                {address.isDefault && (
                  <Badge
                    variant="success"
                    size="sm"
                    className="absolute top-4 right-4"
                  >
                    <FiCheck className="w-3 h-3 mr-1" />
                    Default
                  </Badge>
                )}

                {/* Label */}
                <h3 className="text-lg font-semibold text-neutral mb-4">
                  {address.label}
                </h3>

                {/* Address Details */}
                <div className="text-sm text-base-content space-y-1 mb-6">
                  <p className="font-medium text-neutral">
                    {address.companyName}
                  </p>
                  <p>{address.contactName}</p>
                  <p>{address.address1}</p>
                  {address.address2 && <p>{address.address2}</p>}
                  <p>
                    {address.city}, {address.state} {address.postalCode}
                  </p>
                  <p>{address.country}</p>
                  <p className="pt-2">{address.phone}</p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 pt-4 border-t border-base-300">
                  {!address.isDefault && (
                    <Button
                      variant="ghost"
                      size="sm"
                      fullWidth
                      className="justify-start"
                      onClick={() => handleSetDefault(address.id)}
                    >
                      <FiCheck className="w-4 h-4 mr-2" />
                      Set as Default
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    fullWidth
                    className="justify-start"
                  >
                    <FiEdit2 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    fullWidth
                    className="justify-start text-error hover:bg-error/10"
                    onClick={() => handleDelete(address.id)}
                    disabled={address.isDefault}
                  >
                    <FiTrash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-neutral-content mb-6">No addresses saved yet</p>
            <Button variant="primary">
              <FiPlus className="w-4 h-4 mr-2" />
              Add Your First Address
            </Button>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
