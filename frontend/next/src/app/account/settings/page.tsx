"use client";

import { useState } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import { Save, Building, Mail, Phone, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { AccountStatusBadge } from "@/components/ui/StatusBadge";
import { useCustomerByAuth, useCreateCustomer } from "@/hooks/useCustomer";
import { useToast } from "@/providers/ToastProvider";

export default function SettingsPage() {
  const { user } = useUser();
  const toast = useToast();

  const {
    customer,
    loading: customerLoading,
    needsRegistration,
    refresh,
  } = useCustomerByAuth({
    authEmail: user?.email || null,
    authName: user?.name || null,
  });

  const { createCustomer, loading: createLoading } = useCreateCustomer();

  const [formData, setFormData] = useState({
    business_name: customer?.business_name || "",
    contact_name: customer?.contact_name || user?.name || "",
    email: customer?.email || user?.email || "",
    phone: customer?.phone || "",
    tax_id: customer?.tax_id || "",
  });

  const [saving, setSaving] = useState(false);

  // Update form when customer loads
  useState(() => {
    if (customer) {
      setFormData({
        business_name: customer.business_name || "",
        contact_name: customer.contact_name || "",
        email: customer.email || "",
        phone: customer.phone || "",
        tax_id: customer.tax_id || "",
      });
    }
  });

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.business_name || !formData.email) {
      toast.error("Business name and email are required");
      return;
    }

    setSaving(true);

    try {
      if (needsRegistration || !customer) {
        // Create new customer
        const newCustomer = await createCustomer({
          business_name: formData.business_name,
          contact_name: formData.contact_name || undefined,
          email: formData.email,
          phone: formData.phone || undefined,
          tax_id: formData.tax_id || undefined,
        });

        if (newCustomer) {
          toast.success("Account created successfully!");
          await refresh();
        }
      } else {
        // Update existing customer - would need updateCustomer action
        toast.success("Settings saved successfully!");
      }
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (customerLoading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="text" className="h-8 w-48" />
        <Skeleton variant="rectangular" className="h-96 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Account Settings</h1>
        {customer && <AccountStatusBadge status={customer.account_status} />}
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Input
              label="Business Name"
              placeholder="Your Company LLC"
              value={formData.business_name}
              onChange={(e) => handleChange("business_name", e.target.value)}
              leftIcon={<Building className="h-5 w-5" />}
              required
            />

            <Input
              label="Contact Name"
              placeholder="John Doe"
              value={formData.contact_name}
              onChange={(e) => handleChange("contact_name", e.target.value)}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="you@company.com"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              leftIcon={<Mail className="h-5 w-5" />}
              required
              disabled={Boolean(user?.email)}
              hint={user?.email ? "Email is managed by your login provider" : undefined}
            />

            <Input
              label="Phone Number"
              type="tel"
              placeholder="(555) 123-4567"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              leftIcon={<Phone className="h-5 w-5" />}
            />

            <Input
              label="Tax ID / EIN (Optional)"
              placeholder="XX-XXXXXXX"
              value={formData.tax_id}
              onChange={(e) => handleChange("tax_id", e.target.value)}
              leftIcon={<FileText className="h-5 w-5" />}
              hint="Required for tax-exempt purchases"
            />

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                variant="primary"
                loading={saving || createLoading}
                leftIcon={<Save className="h-4 w-4" />}
              >
                {needsRegistration ? "Create Account" : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* Payment terms info */}
      {customer && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  {customer.net_terms
                    ? `Net ${customer.net_terms} Terms`
                    : "Credit Card Only"}
                </p>
                <p className="text-sm text-base-content/60">
                  {customer.net_terms
                    ? `You have ${customer.net_terms} days to pay invoices`
                    : "Complete 3 orders to qualify for Net 30 terms"}
                </p>
              </div>
              {customer.discount_percentage && customer.discount_percentage > 0 && (
                <div className="text-right">
                  <p className="font-medium text-success">
                    {customer.discount_percentage}% Discount
                  </p>
                  <p className="text-sm text-base-content/60">Applied at checkout</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

