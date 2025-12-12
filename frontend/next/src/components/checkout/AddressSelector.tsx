"use client";

import { useState } from "react";
import { MapPin, Plus, Check, Edit2 } from "lucide-react";
import type { Addresses } from "@/types/addresses";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal, ModalFooter } from "@/components/ui/Modal";
import { EmptyAddresses } from "@/components/ui/EmptyState";
import { AddressForm } from "./AddressForm";
import { useAddresses, useAddressForm } from "@/hooks/useAddresses";
import { formatAddressMultiline } from "@/lib/format";
import { ADDRESS_TYPES } from "@/lib/constants";

interface AddressSelectorProps {
  customerId: string;
  type: "shipping" | "billing";
  selectedAddressId: string | null;
  onSelect: (addressId: string) => void;
  className?: string;
}

export function AddressSelector({
  customerId,
  type,
  selectedAddressId,
  onSelect,
  className = "",
}: AddressSelectorProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Addresses | null>(null);

  const {
    addresses,
    shippingAddresses,
    billingAddresses,
    loading,
    addAddress,
    updateAddress,
    deleteAddress,
  } = useAddresses({ customerId });

  const addressForm = useAddressForm(editingAddress);

  const displayedAddresses =
    type === "shipping" ? shippingAddresses : billingAddresses;

  const handleAddAddress = async () => {
    if (!addressForm.validate()) return;

    const input = addressForm.getCreateInput(customerId);
    input.address_type = type === "shipping" ? ADDRESS_TYPES.SHIPPING : ADDRESS_TYPES.BILLING;

    const newAddress = await addAddress(input);
    if (newAddress?.id) {
      onSelect(newAddress.id);
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
      if (selectedAddressId === addressId) {
        // Select another address if available
        const remaining = displayedAddresses.filter((a) => a.id !== addressId);
        if (remaining.length > 0 && remaining[0].id) {
          onSelect(remaining[0].id);
        }
      }
    }
  };

  if (loading) {
    return (
      <div className={`space-y-3 ${className}`}>
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="h-24 rounded-lg border border-base-300 bg-base-200 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          {type === "shipping" ? "Shipping" : "Billing"} Address
        </h3>
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => {
            addressForm.reset();
            addressForm.updateField(
              "address_type",
              type === "shipping" ? ADDRESS_TYPES.SHIPPING : ADDRESS_TYPES.BILLING
            );
            setShowAddModal(true);
          }}
        >
          Add New
        </Button>
      </div>

      {displayedAddresses.length === 0 ? (
        <EmptyAddresses
          onAdd={() => setShowAddModal(true)}
          className="py-8"
        />
      ) : (
        <div className="space-y-3">
          {displayedAddresses.map((address) => {
            const isSelected = selectedAddressId === address.id;
            const lines = formatAddressMultiline(address);

            return (
              <div
                key={address.id}
                onClick={() => address.id && onSelect(address.id)}
                className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-base-300 hover:border-primary/50"
                }`}
              >
                {/* Selection indicator */}
                <div
                  className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isSelected
                      ? "border-primary bg-primary"
                      : "border-base-300"
                  }`}
                >
                  {isSelected && <Check className="h-3 w-3 text-primary-content" />}
                </div>

                {/* Address content */}
                <div className="pr-8">
                  {address.is_default && (
                    <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-primary/20 text-primary mb-2">
                      Default
                    </span>
                  )}
                  {lines.map((line, i) => (
                    <p
                      key={i}
                      className={`text-sm ${i === 0 ? "font-medium" : "text-base-content/70"}`}
                    >
                      {line}
                    </p>
                  ))}
                </div>

                {/* Edit button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingAddress(address);
                  }}
                  className="absolute bottom-4 right-4 p-1.5 rounded-lg text-base-content/40 hover:text-primary hover:bg-primary/10 transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
              </div>
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
        />
        <ModalFooter>
          <Button
            variant="danger"
            onClick={() => editingAddress?.id && handleDeleteAddress(editingAddress.id)}
            className="mr-auto"
          >
            Delete
          </Button>
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

