import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { generateOrderNumber } from "@/lib/firebase-helpers";
import type { OrderAddress, OrderItem } from "@/types";

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const adminDb = getFirestore();

const SHIPPING_FEE_CENTS = 1500;

interface AdminOrderRequestBody {
  customerId: string;
  customerEmail: string;
  customerDisplayName: string;
  items: OrderItem[];
  shippingAddress: OrderAddress;
  billingAddress: OrderAddress;
  paymentTerms: "card" | "net30";
  notes: string;
  adminNotes: string;
  overrideReason: string | null;
  subtotal: number;
  discount: number;
  adminEmail: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: AdminOrderRequestBody = await request.json();
    const {
      customerId,
      customerEmail,
      customerDisplayName,
      items,
      shippingAddress,
      billingAddress,
      paymentTerms,
      notes,
      adminNotes,
      overrideReason,
      subtotal,
      discount,
      adminEmail,
    } = body;

    if (!customerId || !customerEmail) {
      return NextResponse.json({ error: "Customer is required" }, { status: 400 });
    }
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "At least one item is required" }, { status: 400 });
    }
    if (!shippingAddress?.street1) {
      return NextResponse.json({ error: "Shipping address is required" }, { status: 400 });
    }

    const shippingCost = SHIPPING_FEE_CENTS;
    const tax = 0;
    const total = subtotal + shippingCost + tax - discount;

    const orderNumber = generateOrderNumber();
    const orderId = `${customerId}-${Date.now()}`;

    const order = {
      orderNumber,
      userId: customerId,
      userEmail: customerEmail,
      status: "confirmed",
      paymentStatus: paymentTerms === "net30" ? "pending" : "pending",
      items,
      shippingAddress,
      billingAddress,
      subtotal,
      shippingCost,
      tax,
      discount,
      total,
      paymentMethod: paymentTerms === "net30" ? "net30" : "card",
      paymentIntentId: null,
      shipping: null,
      notes: notes || null,
      adminNotes: adminNotes || null,
      adminCreated: true,
      createdBy: adminEmail,
      paymentTerms,
      overrideReason: overrideReason || null,
      paidAt: null,
      cancelledAt: null,
      refundedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await adminDb.collection("orders").doc(orderId).set(order);

    // Queue customer confirmation email
    const itemsHtml = items
      .map(
        (item) =>
          `<tr>
            <td style="padding:8px;border:1px solid #ddd;">${item.name}</td>
            <td style="padding:8px;border:1px solid #ddd;text-align:center;">${item.quantity}</td>
            <td style="padding:8px;border:1px solid #ddd;text-align:right;">$${(item.price / 100).toFixed(2)}</td>
            <td style="padding:8px;border:1px solid #ddd;text-align:right;">$${(item.total / 100).toFixed(2)}</td>
          </tr>`
      )
      .join("");

    const addr = shippingAddress;
    const addressHtml = `${addr.firstName} ${addr.lastName}${addr.company ? `<br>${addr.company}` : ""}<br>${addr.street1}${addr.street2 ? `<br>${addr.street2}` : ""}<br>${addr.city}, ${addr.state} ${addr.postalCode}<br>${addr.country}`;

    const paymentTermsLabel = paymentTerms === "net30" ? "Net 30 (invoice will follow)" : "Credit Card";

    const customerEmailData = {
      to: customerEmail,
      message: {
        subject: `Order Confirmation – ${orderNumber} | Lucky Bee Press`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a;">
            <h2 style="color:#f59e0b;">Order Confirmed!</h2>
            <p>Hi ${customerDisplayName || customerEmail},</p>
            <p>Thank you for your order. Lucky Bee Press has received and confirmed the following order on your behalf.</p>

            <table style="border-collapse:collapse;width:100%;margin-top:16px;">
              <tr>
                <td style="padding:8px;border:1px solid #ddd;font-weight:bold;width:40%;">Order Number</td>
                <td style="padding:8px;border:1px solid #ddd;">${orderNumber}</td>
              </tr>
              <tr>
                <td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Payment Terms</td>
                <td style="padding:8px;border:1px solid #ddd;">${paymentTermsLabel}</td>
              </tr>
            </table>

            <h3 style="margin-top:24px;border-bottom:2px solid #f59e0b;padding-bottom:4px;">Items</h3>
            <table style="border-collapse:collapse;width:100%;margin-top:8px;">
              <thead>
                <tr style="background:#f9fafb;">
                  <th style="padding:8px;border:1px solid #ddd;text-align:left;">Product</th>
                  <th style="padding:8px;border:1px solid #ddd;text-align:center;">Qty</th>
                  <th style="padding:8px;border:1px solid #ddd;text-align:right;">Unit Price</th>
                  <th style="padding:8px;border:1px solid #ddd;text-align:right;">Subtotal</th>
                </tr>
              </thead>
              <tbody>${itemsHtml}</tbody>
            </table>

            <h3 style="margin-top:24px;border-bottom:2px solid #f59e0b;padding-bottom:4px;">Shipping Address</h3>
            <div style="padding:12px;background:#f9fafb;border-radius:4px;margin-top:8px;">
              ${addressHtml}
            </div>

            <h3 style="margin-top:24px;border-bottom:2px solid #f59e0b;padding-bottom:4px;">Order Summary</h3>
            <table style="border-collapse:collapse;width:100%;margin-top:8px;">
              <tr>
                <td style="padding:8px;border:1px solid #ddd;">Subtotal</td>
                <td style="padding:8px;border:1px solid #ddd;text-align:right;">$${(subtotal / 100).toFixed(2)}</td>
              </tr>
              <tr>
                <td style="padding:8px;border:1px solid #ddd;">Shipping</td>
                <td style="padding:8px;border:1px solid #ddd;text-align:right;">$${(shippingCost / 100).toFixed(2)}</td>
              </tr>
              ${discount > 0 ? `<tr><td style="padding:8px;border:1px solid #ddd;">Discount</td><td style="padding:8px;border:1px solid #ddd;text-align:right;color:#16a34a;">-$${(discount / 100).toFixed(2)}</td></tr>` : ""}
              <tr style="font-weight:bold;background:#f59e0b;color:#fff;">
                <td style="padding:8px;border:1px solid #ddd;">Total</td>
                <td style="padding:8px;border:1px solid #ddd;text-align:right;">$${(total / 100).toFixed(2)}</td>
              </tr>
            </table>

            ${notes ? `<h3 style="margin-top:24px;">Notes</h3><div style="padding:12px;background:#f9fafb;border-radius:4px;">${notes}</div>` : ""}

            <p style="margin-top:32px;color:#666;font-size:12px;">
              If you have any questions about this order, please contact us.<br>
              Lucky Bee Press
            </p>
          </div>
        `,
        text: `Order Confirmed – ${orderNumber}\n\nHi ${customerDisplayName || customerEmail},\n\nThank you for your order. Lucky Bee Press has confirmed the following order on your behalf.\n\nPayment Terms: ${paymentTermsLabel}\n\nItems:\n${items.map((i) => `• ${i.name} x${i.quantity} – $${(i.total / 100).toFixed(2)}`).join("\n")}\n\nSubtotal: $${(subtotal / 100).toFixed(2)}\nShipping: $${(shippingCost / 100).toFixed(2)}\nTotal: $${(total / 100).toFixed(2)}\n\nShipping to:\n${addr.firstName} ${addr.lastName}\n${addr.street1}\n${addr.city}, ${addr.state} ${addr.postalCode}\n${addr.country}\n\nOrder placed at: ${new Date().toLocaleString()}`,
      },
    };

    await adminDb.collection("mail").add(customerEmailData);

    return NextResponse.json({ orderId, orderNumber });
  } catch (error) {
    console.error("Error creating admin order:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
