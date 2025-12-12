"use client";

import { CreditCard, FileText, Lock, Check, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { PaymentMethod } from "@/lib/constants";
import { PAYMENT_METHOD, PAYMENT_METHOD_LABELS } from "@/lib/constants";
import { usePaymentEligibility } from "@/hooks/useCustomer";
import type { Customers } from "@/types/customers";

interface PaymentSelectorProps {
  customer: Customers | null;
  selectedMethod: PaymentMethod | null;
  onSelect: (method: PaymentMethod) => void;
  className?: string;
}

export function PaymentSelector({
  customer,
  selectedMethod,
  onSelect,
  className = "",
}: PaymentSelectorProps) {
  const eligibility = usePaymentEligibility(customer);

  const paymentOptions = [
    {
      method: PAYMENT_METHOD.CREDIT_CARD as PaymentMethod,
      label: PAYMENT_METHOD_LABELS.credit_card,
      description: "Pay now with credit or debit card",
      icon: CreditCard,
      enabled: eligibility.canPayByCreditCard,
      disabledReason: !eligibility.canPayByCreditCard
        ? "Account must be active"
        : null,
    },
    {
      method: PAYMENT_METHOD.NET_30 as PaymentMethod,
      label: PAYMENT_METHOD_LABELS.net_30,
      description: `Invoice payment within ${
        eligibility.netTermsDays || 30
      } days`,
      icon: FileText,
      enabled: eligibility.canPayByNet30,
      disabledReason: eligibility.reasonForNet30Denial,
      badge: eligibility.canPayByNet30 ? "Available" : null,
    },
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="font-semibold flex items-center gap-2">
        <Lock className="h-4 w-4" />
        Payment Method
      </h3>

      <div className="space-y-3">
        {paymentOptions.map((option) => {
          const isSelected = selectedMethod === option.method;
          const Icon = option.icon;

          return (
            <div
              key={option.method}
              onClick={() => option.enabled && onSelect(option.method)}
              className={`relative p-4 rounded-lg border-2 transition-all ${
                option.enabled
                  ? "cursor-pointer"
                  : "cursor-not-allowed opacity-60"
              } ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : option.enabled
                  ? "border-base-300 hover:border-primary/50"
                  : "border-base-300"
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Selection indicator */}
                <div
                  className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                    isSelected ? "border-primary bg-primary" : "border-base-300"
                  }`}
                >
                  {isSelected && (
                    <Check className="h-3 w-3 text-primary-content" />
                  )}
                </div>

                {/* Icon */}
                <div
                  className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                    isSelected ? "bg-primary/20 text-primary" : "bg-base-200"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{option.label}</span>
                    {option.badge && (
                      <Badge variant="success" size="sm">
                        {option.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-base-content/60 mt-0.5">
                    {option.description}
                  </p>
                  {!option.enabled && option.disabledReason && (
                    <p className="text-sm text-warning flex items-center gap-1 mt-2">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {option.disabledReason}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Security note */}
      <p className="text-xs text-base-content/50 flex items-center gap-1">
        <Lock className="h-3 w-3" />
        Your payment information is secure and encrypted
      </p>
    </div>
  );
}

// Simple payment method display
interface PaymentMethodDisplayProps {
  method: PaymentMethod;
  className?: string;
}

export function PaymentMethodDisplay({
  method,
  className = "",
}: PaymentMethodDisplayProps) {
  const Icon = method === PAYMENT_METHOD.CREDIT_CARD ? CreditCard : FileText;
  const label = PAYMENT_METHOD_LABELS[method];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Icon className="h-4 w-4 text-base-content/60" />
      <span>{label}</span>
    </div>
  );
}
