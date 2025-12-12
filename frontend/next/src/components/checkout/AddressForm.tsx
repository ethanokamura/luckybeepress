"use client";

import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { US_STATES, ADDRESS_TYPES } from "@/lib/constants";
import type { AddressFormState } from "@/hooks/useAddresses";

interface AddressFormProps {
  formData: AddressFormState;
  errors: Record<string, string>;
  onChange: <K extends keyof AddressFormState>(
    field: K,
    value: AddressFormState[K]
  ) => void;
  showTypeSelector?: boolean;
  className?: string;
}

export function AddressForm({
  formData,
  errors,
  onChange,
  showTypeSelector = false,
  className = "",
}: AddressFormProps) {
  const stateOptions = US_STATES.map((state) => ({
    value: state.value,
    label: state.label,
  }));

  const addressTypeOptions = [
    { value: ADDRESS_TYPES.SHIPPING, label: "Shipping Address" },
    { value: ADDRESS_TYPES.BILLING, label: "Billing Address" },
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {showTypeSelector && (
        <Select
          label="Address Type"
          options={addressTypeOptions}
          value={formData.address_type}
          onChange={(e) =>
            onChange("address_type", e.target.value as typeof ADDRESS_TYPES.SHIPPING)
          }
          error={errors.address_type}
        />
      )}

      <Input
        label="Company Name (Optional)"
        placeholder="Your business name"
        value={formData.company_name}
        onChange={(e) => onChange("company_name", e.target.value)}
        error={errors.company_name}
      />

      <Input
        label="Street Address"
        placeholder="123 Main St"
        value={formData.street_address_1}
        onChange={(e) => onChange("street_address_1", e.target.value)}
        error={errors.street_address_1}
        required
      />

      <Input
        label="Apartment, Suite, etc. (Optional)"
        placeholder="Apt 4B"
        value={formData.street_address_2}
        onChange={(e) => onChange("street_address_2", e.target.value)}
        error={errors.street_address_2}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="City"
          placeholder="New York"
          value={formData.city}
          onChange={(e) => onChange("city", e.target.value)}
          error={errors.city}
          required
        />

        <Select
          label="State"
          options={stateOptions}
          value={formData.state}
          onChange={(e) => onChange("state", e.target.value)}
          error={errors.state}
          placeholder="Select state"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="ZIP Code"
          placeholder="10001"
          value={formData.postal_code}
          onChange={(e) => onChange("postal_code", e.target.value)}
          error={errors.postal_code}
          required
        />

        <Input
          label="Country"
          value={formData.country}
          onChange={(e) => onChange("country", e.target.value)}
          error={errors.country}
          disabled
        />
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={formData.is_default}
          onChange={(e) => onChange("is_default", e.target.checked)}
          className="checkbox checkbox-primary checkbox-sm"
        />
        <span className="text-sm">Set as default address</span>
      </label>
    </div>
  );
}

// Compact address display for checkout summary
interface AddressDisplayProps {
  address: {
    company_name?: string | null;
    street_address_1: string;
    street_address_2?: string | null;
    city: string;
    state: string;
    postal_code: string;
    country?: string | null;
  };
  className?: string;
}

export function AddressDisplay({ address, className = "" }: AddressDisplayProps) {
  return (
    <div className={`text-sm ${className}`}>
      {address.company_name && (
        <p className="font-medium">{address.company_name}</p>
      )}
      <p>{address.street_address_1}</p>
      {address.street_address_2 && <p>{address.street_address_2}</p>}
      <p>
        {address.city}, {address.state} {address.postal_code}
      </p>
      {address.country && address.country !== "USA" && address.country !== "US" && (
        <p>{address.country}</p>
      )}
    </div>
  );
}

