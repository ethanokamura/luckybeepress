"use client";

import { useState, useEffect, useCallback } from "react";
import {
  findCustomers,
  getCustomers,
  createCustomers,
  updateCustomers,
} from "@/actions/customers";
import type { Customers } from "@/types/customers";
import type {
  CreateCustomersInput,
  UpdateCustomersInput,
} from "@/actions/customers/validators";
import {
  NET_30_ORDER_THRESHOLD,
  ACCOUNT_STATUS,
  type AccountStatus,
} from "@/lib/constants";

// ============================================================================
// Types
// ============================================================================

export interface UseCustomerOptions {
  customerId?: string | null;
  email?: string | null;
  autoFetch?: boolean;
}

export interface UseCustomerReturn {
  customer: Customers | null;
  loading: boolean;
  error: string | null;
  
  // Derived state
  isEligibleForNet30: boolean;
  hasActiveAccount: boolean;
  
  // Actions
  refresh: () => Promise<void>;
  updateProfile: (input: UpdateCustomersInput) => Promise<boolean>;
}

export interface UseCreateCustomerReturn {
  createCustomer: (input: CreateCustomersInput) => Promise<Customers | null>;
  loading: boolean;
  error: string | null;
}

// ============================================================================
// Customer Hook
// ============================================================================

export function useCustomer(options: UseCustomerOptions = {}): UseCustomerReturn {
  const { customerId, email, autoFetch = true } = options;

  // State
  const [customer, setCustomer] = useState<Customers | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch customer by ID
  const fetchCustomerById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getCustomers(id);

      if (response.success && response.data) {
        setCustomer(response.data);
      } else {
        setError(response.error || "Customer not found");
        setCustomer(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch customer by email
  const fetchCustomerByEmail = useCallback(async (customerEmail: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await findCustomers({
        email: customerEmail,
        limit: 1,
      });

      if (response.success && response.data && response.data.length > 0) {
        setCustomer(response.data[0]);
      } else {
        // Customer not found by email (not an error, just doesn't exist yet)
        setCustomer(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch customer
  const fetchCustomer = useCallback(async () => {
    if (customerId) {
      await fetchCustomerById(customerId);
    } else if (email) {
      await fetchCustomerByEmail(email);
    } else {
      setCustomer(null);
    }
  }, [customerId, email, fetchCustomerById, fetchCustomerByEmail]);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch && (customerId || email)) {
      fetchCustomer();
    }
  }, [autoFetch, customerId, email, fetchCustomer]);

  // Derived state
  const isEligibleForNet30 = Boolean(
    customer &&
      customer.account_status === ACCOUNT_STATUS.ACTIVE &&
      (customer.net_terms ?? 0) > 0
  );

  // Check if customer has met the order threshold for Net 30
  const hasMetNet30Threshold = Boolean(
    customer && (customer.total_orders ?? 0) >= NET_30_ORDER_THRESHOLD
  );

  const hasActiveAccount = Boolean(
    customer && customer.account_status === ACCOUNT_STATUS.ACTIVE
  );

  // Actions
  const refresh = useCallback(async () => {
    await fetchCustomer();
  }, [fetchCustomer]);

  const updateProfile = useCallback(
    async (input: UpdateCustomersInput): Promise<boolean> => {
      if (!customer?.id) {
        setError("No customer to update");
        return false;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await updateCustomers(customer.id, input);

        if (response.success && response.data) {
          setCustomer(response.data);
          return true;
        } else {
          setError(response.error || "Failed to update profile");
          return false;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [customer?.id]
  );

  return {
    customer,
    loading,
    error,
    isEligibleForNet30,
    hasActiveAccount,
    refresh,
    updateProfile,
  };
}

// ============================================================================
// Create Customer Hook
// ============================================================================

export function useCreateCustomer(): UseCreateCustomerReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCustomer = useCallback(
    async (input: CreateCustomersInput): Promise<Customers | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await createCustomers({
          ...input,
          account_status: ACCOUNT_STATUS.PENDING,
          net_terms: 0, // Start with no net terms
        });

        if (response.success && response.data) {
          return response.data;
        } else {
          setError(response.error || "Failed to create customer");
          return null;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    createCustomer,
    loading,
    error,
  };
}

// ============================================================================
// Customer by Auth Hook (for use with Auth0)
// ============================================================================

export interface UseCustomerByAuthOptions {
  authEmail: string | null;
  authName?: string | null;
  autoCreate?: boolean;
}

export function useCustomerByAuth(options: UseCustomerByAuthOptions) {
  const { authEmail, authName, autoCreate = false } = options;

  const [customer, setCustomer] = useState<Customers | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsRegistration, setNeedsRegistration] = useState(false);

  const fetchOrCreateCustomer = useCallback(async () => {
    if (!authEmail) {
      setCustomer(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Try to find existing customer by email
      const findResponse = await findCustomers({
        email: authEmail,
        limit: 1,
      });

      if (findResponse.success && findResponse.data && findResponse.data.length > 0) {
        setCustomer(findResponse.data[0]);
        setNeedsRegistration(false);
      } else if (autoCreate) {
        // Auto-create customer if enabled
        const createResponse = await createCustomers({
          email: authEmail,
          business_name: authName || "New Business",
          account_status: ACCOUNT_STATUS.PENDING,
        });

        if (createResponse.success && createResponse.data) {
          setCustomer(createResponse.data);
          setNeedsRegistration(true); // They need to complete registration
        } else {
          setError(createResponse.error || "Failed to create customer account");
        }
      } else {
        // Customer not found and autoCreate is false
        setCustomer(null);
        setNeedsRegistration(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [authEmail, authName, autoCreate]);

  useEffect(() => {
    fetchOrCreateCustomer();
  }, [fetchOrCreateCustomer]);

  return {
    customer,
    loading,
    error,
    needsRegistration,
    refresh: fetchOrCreateCustomer,
  };
}

// ============================================================================
// Customer Payment Eligibility Hook
// ============================================================================

export interface PaymentEligibility {
  canPayByCreditCard: boolean;
  canPayByNet30: boolean;
  netTermsDays: number;
  reasonForNet30Denial: string | null;
}

export function usePaymentEligibility(customer: Customers | null): PaymentEligibility {
  if (!customer) {
    return {
      canPayByCreditCard: false,
      canPayByNet30: false,
      netTermsDays: 0,
      reasonForNet30Denial: "Account required",
    };
  }

  const isActive = customer.account_status === ACCOUNT_STATUS.ACTIVE;
  const hasNet30 = (customer.net_terms ?? 0) > 0;
  const orderCount = customer.total_orders ?? 0;

  let reasonForNet30Denial: string | null = null;

  if (!isActive) {
    reasonForNet30Denial = "Account must be active";
  } else if (!hasNet30) {
    if (orderCount < NET_30_ORDER_THRESHOLD) {
      reasonForNet30Denial = `Complete ${NET_30_ORDER_THRESHOLD - orderCount} more order(s) to qualify for Net 30`;
    } else {
      reasonForNet30Denial = "Contact us to enable Net 30 terms";
    }
  }

  return {
    canPayByCreditCard: isActive,
    canPayByNet30: isActive && hasNet30,
    netTermsDays: customer.net_terms ?? 0,
    reasonForNet30Denial,
  };
}

