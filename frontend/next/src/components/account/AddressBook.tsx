"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, MapPin, Check } from "lucide-react";
import type { Addresses } from "@/types/addresses";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal, ModalFooter } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { EmptyAddresses } from "@/components/ui/EmptyState";
import { AddressForm } from "@/components/checkout/AddressForm";
import { useAddresses, useAddressForm } from "@/hooks/useAddresses";
import { formatAddressMultiline } from "@/lib/format";

interface AddressBookProps {
  customerId: string;
  className?: string;
}

export function AddressBook({ customerId, className = "" }: AddressBookProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Addresses | null>(null);

  const {
    addresses,
    loading,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  } = useAddresses({ customerId });

  const addressForm = useAddressForm(editingAddress);

  const handleAddAddress = async () => {
    if (!addressForm.validate()) return;

    const newAddress = await addAddress(addressForm.getCreateInput(customerId));
    if (newAddress) {
      setShowAddModal(false);
      addressForm.reset();
    }
  };

  const handleEditAddress = async () => {
    if (!editingAddress?.id || !addressForm.validate()) return;

    const success = await updateAddress(editingAddress.id, addressForm.getUpdateInput());
    if (success) {
      setEditingAddress(null);
      addressForm.reset();
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (confirm("Are you sure you want to delete this address?")) {
      await deleteAddress(addressId);
    }
  };

  if (loading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-40 rounded-xl border border-base-300 bg-base-200 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Saved Addresses</h2>
        <Button
          variant="primary"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => {
            addressForm.reset();
            setShowAddModal(true);
          }}
        >
          Add Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <EmptyAddresses onAdd={() => setShowAddModal(true)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => {
            const lines = formatAddressMultiline(address);

            return (
              <Card key={address.id} className="relative">
                <CardContent className="p-5">
                  {/* Badges */}
                  <div className="flex items-center gap-2 mb-3">
                    <Badge
                      variant={
                        address.address_type === "shipping" ? "primary" : "secondary"
                      }
                      size="sm"
                    >
                      {address.address_type}
                    </Badge>
                    {address.is_default && (
                      <Badge variant="success" size="sm">
                        Default
                      </Badge>
                    )}
                  </div>

                  {/* Address */}
                  <div className="space-y-0.5">
                    {lines.map((line, i) => (
                      <p
                        key={i}
                        className={i === 0 ? "font-medium" : "text-base-content/70"}
                      >
                        {line}
                      </p>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-base-300">
                    {!address.is_default && (
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<Check className="h-4 w-4" />}
                        onClick={() => address.id && setDefaultAddress(address.id)}
                      >
                        Set Default
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Edit2 className="h-4 w-4" />}
                      onClick={() => setEditingAddress(address)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Trash2 className="h-4 w-4" />}
                      onClick={() => address.id && handleDeleteAddress(address.id)}
                      className="text-error hover:bg-error/10"
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Address Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Address"
        size="lg"
      >
        <AddressForm
          formData={addressForm.formData}
          errors={addressForm.errors}
          onChange={addressForm.updateField}
          showTypeSelector
        />
        <ModalFooter>
          <Button variant="ghost" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddAddress}>
            Add Address
          </Button>
        </ModalFooter>
      </Modal>

      {/* Edit Address Modal */}
      <Modal
        isOpen={Boolean(editingAddress)}
        onClose={() => setEditingAddress(null)}
        title="Edit Address"
        size="lg"
      >
        <AddressForm
          formData={addressForm.formData}
          errors={addressForm.errors}
          onChange={addressForm.updateField}
          showTypeSelector
        />
        <ModalFooter>
          <Button variant="ghost" onClick={() => setEditingAddress(null)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditAddress}>
            Save Changes
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

