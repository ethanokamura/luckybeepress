"use client";

import { useState } from "react";
import Link from "next/link";
import { MoreVertical, Eye, Ban, CheckCircle, Mail } from "lucide-react";
import type { Customers } from "@/types/customers";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { AccountStatusBadge } from "@/components/ui/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/format";
import { ACCOUNT_STATUS } from "@/lib/constants";

interface AdminCustomersTableProps {
  customers: Customers[];
  loading?: boolean;
  onUpdateStatus?: (customerId: string, status: string) => Promise<void>;
  className?: string;
}

export function AdminCustomersTable({
  customers,
  loading = false,
  onUpdateStatus,
  className = "",
}: AdminCustomersTableProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const handleStatusUpdate = async (customerId: string, status: string) => {
    if (!onUpdateStatus) return;
    setUpdatingId(customerId);
    try {
      await onUpdateStatus(customerId, status);
    } finally {
      setUpdatingId(null);
      setOpenMenuId(null);
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-base-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Customer</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Contact</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">Orders</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Lifetime Value</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Terms</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-t border-base-300">
                    <td className="px-4 py-3">
                      <Skeleton variant="text" className="h-5 w-40" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton variant="text" className="h-5 w-48" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton variant="text" className="h-6 w-20" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton variant="text" className="h-5 w-8 mx-auto" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton variant="text" className="h-5 w-20 ml-auto" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton variant="text" className="h-5 w-16" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton variant="text" className="h-8 w-8 ml-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (customers.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="py-12 text-center">
          <p className="text-base-content/60">No customers found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-base-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Contact</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Orders</th>
                <th className="px-4 py-3 text-right text-sm font-semibold">Lifetime Value</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Terms</th>
                <th className="px-4 py-3 text-right text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-t border-base-300 hover:bg-base-200/50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{customer.business_name}</p>
                      {customer.first_order_date && (
                        <p className="text-xs text-base-content/50">
                          Since {formatDate(customer.first_order_date)}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      {customer.contact_name && (
                        <p className="text-sm">{customer.contact_name}</p>
                      )}
                      <a
                        href={`mailto:${customer.email}`}
                        className="text-sm text-primary hover:underline"
                      >
                        {customer.email}
                      </a>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <AccountStatusBadge status={customer.account_status} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-center font-mono">
                    {customer.total_orders ?? 0}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">
                    {formatCurrency(Number(customer.lifetime_value || 0))}
                  </td>
                  <td className="px-4 py-3">
                    {customer.net_terms ? (
                      <span className="text-sm">Net {customer.net_terms}</span>
                    ) : (
                      <span className="text-sm text-base-content/50">Standard</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="relative inline-block">
                      <button
                        onClick={() =>
                          setOpenMenuId(openMenuId === customer.id ? null : customer.id || null)
                        }
                        className="p-2 rounded-lg hover:bg-base-200"
                        disabled={updatingId === customer.id}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      {openMenuId === customer.id && (
                        <div className="absolute right-0 top-full mt-1 w-48 rounded-lg border border-base-300 bg-base-100 shadow-lg z-10">
                          <Link
                            href={`/admin/customers/${customer.id}`}
                            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-base-200"
                            onClick={() => setOpenMenuId(null)}
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </Link>
                          <a
                            href={`mailto:${customer.email}`}
                            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-base-200"
                            onClick={() => setOpenMenuId(null)}
                          >
                            <Mail className="h-4 w-4" />
                            Send Email
                          </a>
                          {customer.account_status !== ACCOUNT_STATUS.ACTIVE && (
                            <button
                              onClick={() =>
                                customer.id &&
                                handleStatusUpdate(customer.id, ACCOUNT_STATUS.ACTIVE)
                              }
                              className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-base-200 w-full text-left text-success"
                            >
                              <CheckCircle className="h-4 w-4" />
                              Activate Account
                            </button>
                          )}
                          {customer.account_status !== ACCOUNT_STATUS.SUSPENDED && (
                            <button
                              onClick={() =>
                                customer.id &&
                                handleStatusUpdate(customer.id, ACCOUNT_STATUS.SUSPENDED)
                              }
                              className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-base-200 w-full text-left text-error"
                            >
                              <Ban className="h-4 w-4" />
                              Suspend Account
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

