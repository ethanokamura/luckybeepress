/**
 * Custom Hooks Index
 * Re-exports all custom hooks for convenient importing
 */

// Product hooks
export {
  useProducts,
  useProduct,
  useCategories,
  useBestSellers,
  useNewArrivals,
  type UseProductsOptions,
  type UseProductsReturn,
  type UseProductReturn,
  type ProductFilters,
  type ProductSort,
} from "./useProducts";

// Cart hook
export {
  useCart,
  type UseCartOptions,
  type UseCartReturn,
} from "./useCart";

// Order hooks
export {
  useOrders,
  useOrder,
  useCreateOrder,
  useRecentOrders,
  useOrderStats,
  type UseOrdersOptions,
  type UseOrdersReturn,
  type UseOrderReturn,
  type UseCreateOrderReturn,
  type OrderWithItems,
  type OrderFilters,
  type OrderStats,
} from "./useOrders";

// Customer hooks
export {
  useCustomer,
  useCreateCustomer,
  useCustomerByAuth,
  usePaymentEligibility,
  type UseCustomerOptions,
  type UseCustomerReturn,
  type UseCreateCustomerReturn,
  type UseCustomerByAuthOptions,
  type PaymentEligibility,
} from "./useCustomer";

// Address hooks
export {
  useAddresses,
  useAddress,
  useAddressForm,
  validateAddress,
  type UseAddressesOptions,
  type UseAddressesReturn,
  type UseAddressReturn,
  type AddressFormState,
  type AddressValidation,
} from "./useAddresses";

