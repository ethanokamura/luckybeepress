"use client";

import { Check } from "lucide-react";

interface Step {
  id: string;
  label: string;
}

interface CheckoutStepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function CheckoutStepper({
  steps,
  currentStep,
  className = "",
}: CheckoutStepperProps) {
  return (
    <nav aria-label="Checkout progress" className={className}>
      <ol className="flex items-center">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;

          return (
            <li
              key={step.id}
              className={`flex items-center ${
                index < steps.length - 1 ? "flex-1" : ""
              }`}
            >
              <div className="flex flex-col items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                    isCompleted
                      ? "bg-success border-success text-success-content"
                      : isCurrent
                        ? "bg-primary border-primary text-primary-content"
                        : "bg-base-100 border-base-300 text-base-content/50"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </div>
                <span
                  className={`mt-2 text-sm font-medium ${
                    isCompleted || isCurrent
                      ? "text-base-content"
                      : "text-base-content/50"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-4 ${
                    isCompleted ? "bg-success" : "bg-base-300"
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// Compact mobile stepper
interface MobileStepperProps {
  currentStep: number;
  totalSteps: number;
  currentLabel: string;
  className?: string;
}

export function MobileStepper({
  currentStep,
  totalSteps,
  currentLabel,
  className = "",
}: MobileStepperProps) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="flex items-center gap-1">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index <= currentStep ? "bg-primary" : "bg-base-300"
            }`}
          />
        ))}
      </div>
      <span className="text-sm text-base-content/70">
        Step {currentStep + 1} of {totalSteps}: {currentLabel}
      </span>
    </div>
  );
}

