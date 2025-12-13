"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { BRAND, MINIMUM_ORDER_AMOUNT, PRODUCT_CONFIG } from "@/lib/constants";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-base-content/60 mt-1">
          Configure your wholesale store settings
        </p>
      </div>

      {/* Business info (read-only for now) */}
      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Business Name"
              value={BRAND.name}
              disabled
              hint="Contact support to change"
            />
            <Input label="Tagline" value={BRAND.tagline} disabled />
            <Input
              label="Established Year"
              value={BRAND.established.toString()}
              disabled
            />
            <Input
              label="Years in Business"
              value={`${BRAND.yearsInBusiness}+`}
              disabled
            />
          </div>
        </CardContent>
      </Card>

      {/* Order settings */}
      <Card>
        <CardHeader>
          <CardTitle>Order Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Minimum Order Amount"
              value={`$${MINIMUM_ORDER_AMOUNT}`}
              disabled
              hint="Minimum wholesale order requirement"
            />
            <Input
              label="Default Card Pack Size"
              value={PRODUCT_CONFIG.single.increment.toString()}
              disabled
              hint="Cards sold in sets of 6"
            />
            <Input
              label="Default Box Pack Size"
              value={PRODUCT_CONFIG.box.increment.toString()}
              disabled
              hint="Boxes sold in sets of 3"
            />
          </div>
        </CardContent>
      </Card>

      {/* Admin access info */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Access</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base-content/70 mb-4">
            Admin access is controlled through the customer database. To grant
            admin access to a user:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-base-content/70">
            <li>
              Add the <code className="bg-base-200 px-1 rounded">is_admin</code>{" "}
              column to the customers table
            </li>
            <li>
              Set{" "}
              <code className="bg-base-200 px-1 rounded">is_admin = true</code>{" "}
              for admin users
            </li>
            <li>
              Alternatively, set{" "}
              <code className="bg-base-200 px-1 rounded">
                NEXT_PUBLIC_ADMIN_EMAIL
              </code>{" "}
              environment variable
            </li>
          </ol>

          <div className="mt-6 p-4 rounded-lg bg-warning/10 border border-warning/20">
            <p className="text-sm text-warning">
              <strong>Database Migration Required:</strong> Run the following
              SQL to add admin support:
            </p>
            <pre className="mt-2 p-3 rounded bg-base-200 text-xs overflow-x-auto">
              {`ALTER TABLE customers ADD COLUMN is_admin BOOLEAN DEFAULT false;`}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Environment info */}
      <Card>
        <CardHeader>
          <CardTitle>Environment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-base-content/60">Environment</p>
              <p className="font-mono">{process.env.NODE_ENV}</p>
            </div>
            <div>
              <p className="text-sm text-base-content/60">
                Admin Email Override
              </p>
              <p className="font-mono">
                {process.env.NEXT_PUBLIC_ADMIN_EMAIL || "Not set"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
