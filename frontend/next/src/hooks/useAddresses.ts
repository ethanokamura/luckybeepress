"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  findAddresses,
  getAddresses,
  createAddresses,
  updateAddresses,
  deleteAddresses,
} from "@/actions/addresses";
import type { Addresses } from "@/types/addresses";
import type {
  CreateAddressesInput,
  UpdateAddressesInput,
} from "@/actions/addresses/validators";
import { ADDRESS_TYPES, type AddressType } from "@/lib/constants";

// ============================================================================
// Types
// ============================================================================

export interface UseAddressesOptions {
  customerId: string | null;
  addressType?: AddressType;
  autoFetch?: boolean;
}

export interface UseAddressesReturn {
  addresses: Addresses[];
  shippingAddresses: Addresses[];
  billingAddresses: Addresses[];
  defaultShippingAddress: Addresses | null;
  defaultBillingAddress: Addresses | null;
  loading: boolean;
  error: string | null;

  // Actions
  refresh: () => Promise<void>;
  addAddress: (input: CreateAddressesInput) => Promise<Addresses | null>;
  updateAddress: (id: string, input: UpdateAddressesInput) => Promise<boolean>;
  deleteAddress: (id: string) => Promise<boolean>;
  setDefaultAddress: (id: string) => Promise<boolean>;
}

export interface UseAddressReturn {
  address: Addresses | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

// ============================================================================
// Addresses List Hook
// ============================================================================

export function useAddresses(options: UseAddressesOptions): UseAddressesReturn {
  const { customerId, addressType, autoFetch = true } = options;

  // State
  const [addresses, setAddresses] = useState<Addresses[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch addresses
  const fetchAddresses = useCallback(async () => {
    if (!customerId) {
      setAddresses([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const query: Parameters<typeof findAddresses>[0] = {
        customer_id: customerId,
        limit: 50,
      };

      if (addressType) {
        query.address_type = addressType;
      }

      const response = await findAddresses(query);

      if (response.success && response.data) {
        setAddresses(response.data);
      } else {
        setError(response.error || "Failed to fetch addresses");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [customerId, addressType]);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch && customerId) {
      fetchAddresses();
    }
  }, [autoFetch, customerId, fetchAddresses]);

  // Derived data
  const shippingAddresses = useMemo(
    () => addresses.filter((a) => a.address_type === ADDRESS_TYPES.SHIPPING),
    [addresses]
  );

  const billingAddresses = useMemo(
    () => addresses.filter((a) => a.address_type === ADDRESS_TYPES.BILLING),
    [addresses]
  );

  const defaultShippingAddress = useMemo(
    () =>
      shippingAddresses.find((a) => a.is_default) || shippingAddresses[0] || null,
    [shippingAddresses]
  );

  const defaultBillingAddress = useMemo(
    () =>
      billingAddresses.find((a) => a.is_default) || billingAddresses[0] || null,
    [billingAddresses]
  );

  // Actions
  const refresh = useCallback(async () => {
    await fetchAddresses();
  }, [fetchAddresses]);

  const addAddress = useCallback(
    async (input: CreateAddressesInput): Promise<Addresses | null> => {
      if (!customerId) {
        setError("Customer ID is required");
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        // If this is the first address of its type, make it default
        const isFirstOfType =
          addresses.filter((a) => a.address_type === input.address_type)
            .length === 0;

        const response = await createAddresses({
          ...input,
          customer_id: customerId,
          is_default: input.is_default ?? isFirstOfType,
        });

        if (response.success && response.data) {
          // If this is set as default, unset other defaults
          if (response.data.is_default) {
            setAddresses((prev) =>
              prev.map((a) =>
                a.address_type === input.address_type && a.id !== response.data!.id
                  ? { ...a, is_default: false }
                  : a
              )
            );
          }

          setAddresses((prev) => [...prev, response.data!]);
          return response.data;
        } else {
          setError(response.error || "Failed to add address");
          return null;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [customerId, addresses]
  );

  const updateAddress = useCallback(
    async (id: string, input: UpdateAddressesInput): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const response = await updateAddresses(id, input);

        if (response.success && response.data) {
          // If setting as default, unset other defaults of same type
          if (input.is_default) {
            const updatedType = response.data.address_type;
            setAddresses((prev) =>
              prev.map((a) => {
                if (a.id === id) return response.data!;
                if (a.address_type === updatedType) {
                  return { ...a, is_default: false };
                }
                return a;
              })
            );
          } else {
            setAddresses((prev) =>
              prev.map((a) => (a.id === id ? response.data! : a))
            );
          }
          return true;
        } else {
          setError(response.error || "Failed to update address");
          return false;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteAddress = useCallback(
    async (id: string): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const response = await deleteAddresses(id);

        if (response.success) {
          setAddresses((prev) => prev.filter((a) => a.id !== id));
          return true;
        } else {
          setError(response.error || "Failed to delete address");
          return false;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const setDefaultAddress = useCallback(
    async (id: string): Promise<boolean> => {
      return updateAddress(id, { is_default: true });
    },
    [updateAddress]
  );

  return {
    addresses,
    shippingAddresses,
    billingAddresses,
    defaultShippingAddress,
    defaultBillingAddress,
    loading,
    error,
    refresh,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  };
}

// ============================================================================
// Single Address Hook
// ============================================================================

export function useAddress(addressId: string | null): UseAddressReturn {
  const [address, setAddress] = useState<Addresses | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAddress = useCallback(async () => {
    if (!addressId) {
      setAddress(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getAddresses(addressId);

      if (response.success && response.data) {
        setAddress(response.data);
      } else {
        setError(response.error || "Address not found");
        setAddress(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setAddress(null);
    } finally {
      setLoading(false);
    }
  }, [addressId]);

  useEffect(() => {
    fetchAddress();
  }, [fetchAddress]);

  return {
    address,
    loading,
    error,
    refresh: fetchAddress,
  };
}

// ============================================================================
// Address Validation Helper
// ============================================================================

export interface AddressValidation {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateAddress(
  address: Partial<CreateAddressesInput>
): AddressValidation {
  const errors: Record<string, string> = {};

  if (!address.street_address_1?.trim()) {
    errors.street_address_1 = "Street address is required";
  }

  if (!address.city?.trim()) {
    errors.city = "City is required";
  }

  if (!address.state?.trim()) {
    errors.state = "State is required";
  }

  if (!address.postal_code?.trim()) {
    errors.postal_code = "Postal code is required";
  } else if (!/^\d{5}(-\d{4})?$/.test(address.postal_code)) {
    errors.postal_code = "Invalid postal code format";
  }

  if (!address.address_type) {
    errors.address_type = "Address type is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// ============================================================================
// Address Form State Hook
// ============================================================================

export interface AddressFormState {
  company_name: string;
  street_address_1: string;
  street_address_2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  address_type: AddressType;
  is_default: boolean;
}

const initialFormState: AddressFormState = {
  company_name: "",
  street_address_1: "",
  street_address_2: "",
  city: "",
  state: "",
  postal_code: "",
  country: "USA",
  address_type: ADDRESS_TYPES.SHIPPING,
  is_default: false,
};

export function useAddressForm(existingAddress?: Addresses | null) {
  const [formData, setFormData] = useState<AddressFormState>(() => {
    if (existingAddress) {
      return {
        company_name: existingAddress.company_name || "",
        street_address_1: existingAddress.street_address_1,
        street_address_2: existingAddress.street_address_2 || "",
        city: existingAddress.city,
        state: existingAddress.state,
        postal_code: existingAddress.postal_code,
        country: existingAddress.country || "USA",
        address_type: existingAddress.address_type as AddressType,
        is_default: existingAddress.is_default || false,
      };
    }
    return initialFormState;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form when existing address changes
  useEffect(() => {
    if (existingAddress) {
      setFormData({
        company_name: existingAddress.company_name || "",
        street_address_1: existingAddress.street_address_1,
        street_address_2: existingAddress.street_address_2 || "",
        city: existingAddress.city,
        state: existingAddress.state,
        postal_code: existingAddress.postal_code,
        country: existingAddress.country || "USA",
        address_type: existingAddress.address_type as AddressType,
        is_default: existingAddress.is_default || false,
      });
    }
  }, [existingAddress]);

  const updateField = useCallback(
    <K extends keyof AddressFormState>(field: K, value: AddressFormState[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear error when field is updated
      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const validate = useCallback((): boolean => {
    const validation = validateAddress(formData);
    setErrors(validation.errors);
    return validation.isValid;
  }, [formData]);

  const reset = useCallback(() => {
    setFormData(initialFormState);
    setErrors({});
  }, []);

  const getCreateInput = useCallback(
    (customerId: string): CreateAddressesInput => ({
      customer_id: customerId,
      address_type: formData.address_type,
      company_name: formData.company_name || undefined,
      street_address_1: formData.street_address_1,
      street_address_2: formData.street_address_2 || undefined,
      city: formData.city,
      state: formData.state,
      postal_code: formData.postal_code,
      country: formData.country || "USA",
      is_default: formData.is_default,
    }),
    [formData]
  );

  const getUpdateInput = useCallback((): UpdateAddressesInput => ({
    company_name: formData.company_name || undefined,
    street_address_1: formData.street_address_1,
    street_address_2: formData.street_address_2 || undefined,
    city: formData.city,
    state: formData.state,
    postal_code: formData.postal_code,
    country: formData.country || "USA",
    is_default: formData.is_default,
  }), [formData]);

  return {
    formData,
    errors,
    updateField,
    validate,
    reset,
    getCreateInput,
    getUpdateInput,
  };
}

