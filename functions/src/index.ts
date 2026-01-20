import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { setGlobalOptions } from "firebase-functions/v2";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

const OWNER_EMAIL = "ethanokamura3@gmail.com";

// Set global options for all functions
setGlobalOptions({ region: "us-central1" });

/**
 * Trigger: When a new user document is created in Firestore
 * Sends an email notification to the business owner
 */
export const onUserCreated = onDocumentCreated(
  "users/{userId}",
  async (event) => {
    const snap = event.data;
    if (!snap) {
      logger.error("No data in event");
      return;
    }

    const user = snap.data();
    const userId = event.params.userId;

    const emailData = {
      to: OWNER_EMAIL,
      message: {
        subject: "🐝 New Customer Signup - Lucky Bee Press",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #f59e0b;">New Customer Signup!</h2>
            <p>A new customer has signed up on Lucky Bee Press.</p>
            <table style="border-collapse: collapse; width: 100%; margin-top: 20px;">
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${
                  user.email || "N/A"
                }</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Display Name</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${
                  user.displayName || "Not provided"
                }</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">User ID</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${userId}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Signup Time</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${new Date().toLocaleString()}</td>
              </tr>
            </table>
          </div>
        `,
        text: `New customer signup!\n\nEmail: ${
          user.email || "N/A"
        }\nDisplay Name: ${
          user.displayName || "Not provided"
        }\nUser ID: ${userId}\nSignup Time: ${new Date().toLocaleString()}`,
      },
    };

    try {
      await db.collection("mail").add(emailData);
      logger.info("New user notification email queued", { email: user.email });
    } catch (error) {
      logger.error("Failed to queue new user notification email", error);
    }
  }
);

/**
 * Trigger: When a new order is created in Firestore
 * Sends an email notification to the business owner with order details
 */
export const onOrderCreated = onDocumentCreated(
  "orders/{orderId}",
  async (event) => {
    const snap = event.data;
    if (!snap) {
      logger.error("No data in event");
      return;
    }

    const order = snap.data();
    const orderId = event.params.orderId;

    // Format items list
    const itemsList =
      order.items
        ?.map(
          (item: { name: string; quantity: number; price: number }) =>
            `• ${item.name} x${item.quantity} - $${(item.price / 100).toFixed(
              2
            )}`
        )
        .join("<br>") || "No items";

    const itemsText =
      order.items
        ?.map(
          (item: { name: string; quantity: number; price: number }) =>
            `• ${item.name} x${item.quantity} - $${(item.price / 100).toFixed(
              2
            )}`
        )
        .join("\n") || "No items";

    // Format shipping address
    const shippingAddress = order.shippingAddress;
    const addressHtml = shippingAddress
      ? `${shippingAddress.firstName} ${shippingAddress.lastName}<br>
         ${shippingAddress.street1}<br>
         ${shippingAddress.street2 ? shippingAddress.street2 + "<br>" : ""}
         ${shippingAddress.city}, ${shippingAddress.state} ${
          shippingAddress.postalCode
        }<br>
         ${shippingAddress.country}`
      : "No shipping address provided";

    const addressText = shippingAddress
      ? `${shippingAddress.firstName} ${shippingAddress.lastName}
${shippingAddress.street1}
${shippingAddress.street2 ? shippingAddress.street2 + "\n" : ""}${
          shippingAddress.city
        }, ${shippingAddress.state} ${shippingAddress.postalCode}
${shippingAddress.country}`
      : "No shipping address provided";

    const emailData = {
      to: OWNER_EMAIL,
      message: {
        subject: `🐝 New Order ${
          order.orderNumber || `#${orderId.slice(0, 8)}`
        } - Lucky Bee Press`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #f59e0b;">New Order Received!</h2>
            <p>A new order has been placed on Lucky Bee Press.</p>
            
            <h3 style="margin-top: 20px; border-bottom: 2px solid #f59e0b; padding-bottom: 5px;">Order Details</h3>
            <table style="border-collapse: collapse; width: 100%; margin-top: 10px;">
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Order Number</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${
                  order.orderNumber || orderId
                }</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Customer Email</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${
                  order.userEmail || "N/A"
                }</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Order Status</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${
                  order.status || "pending"
                }</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Payment Status</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${
                  order.paymentStatus || "pending"
                }</td>
              </tr>
            </table>

            <h3 style="margin-top: 20px; border-bottom: 2px solid #f59e0b; padding-bottom: 5px;">Items</h3>
            <div style="padding: 15px; background: #f9fafb; border-radius: 5px; margin-top: 10px;">
              ${itemsList}
            </div>

            <h3 style="margin-top: 20px; border-bottom: 2px solid #f59e0b; padding-bottom: 5px;">Shipping Address</h3>
            <div style="padding: 15px; background: #f9fafb; border-radius: 5px; margin-top: 10px;">
              ${addressHtml}
            </div>

            <h3 style="margin-top: 20px; border-bottom: 2px solid #f59e0b; padding-bottom: 5px;">Order Summary</h3>
            <table style="border-collapse: collapse; width: 100%; margin-top: 10px;">
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd;">Subtotal</td>
                <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">$${(
                  (order.subtotal || 0) / 100
                ).toFixed(2)}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd;">Shipping</td>
                <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">$${(
                  (order.shippingCost || 0) / 100
                ).toFixed(2)}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd;">Tax</td>
                <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">$${(
                  (order.tax || 0) / 100
                ).toFixed(2)}</td>
              </tr>
              ${
                order.discount
                  ? `
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd;">Discount</td>
                <td style="padding: 10px; border: 1px solid #ddd; text-align: right; color: #16a34a;">-$${(
                  (order.discount || 0) / 100
                ).toFixed(2)}</td>
              </tr>
              `
                  : ""
              }
              <tr style="font-weight: bold; background: #f59e0b; color: white;">
                <td style="padding: 10px; border: 1px solid #ddd;">Total</td>
                <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">$${(
                  (order.total || 0) / 100
                ).toFixed(2)}</td>
              </tr>
            </table>

            ${
              order.notes
                ? `
            <h3 style="margin-top: 20px; border-bottom: 2px solid #f59e0b; padding-bottom: 5px;">Customer Notes</h3>
            <div style="padding: 15px; background: #f9fafb; border-radius: 5px; margin-top: 10px;">
              ${order.notes}
            </div>
            `
                : ""
            }

            <p style="margin-top: 30px; color: #666; font-size: 12px;">
              Order placed at: ${new Date().toLocaleString()}
            </p>
          </div>
        `,
        text: `New Order Received!

Order Number: ${order.orderNumber || orderId}
Customer Email: ${order.userEmail || "N/A"}
Order Status: ${order.status || "pending"}
Payment Status: ${order.paymentStatus || "pending"}

Items:
${itemsText}

Shipping Address:
${addressText}

Order Summary:
Subtotal: $${((order.subtotal || 0) / 100).toFixed(2)}
Shipping: $${((order.shippingCost || 0) / 100).toFixed(2)}
Tax: $${((order.tax || 0) / 100).toFixed(2)}
${
  order.discount
    ? `Discount: -$${((order.discount || 0) / 100).toFixed(2)}\n`
    : ""
}Total: $${((order.total || 0) / 100).toFixed(2)}

${order.notes ? `Customer Notes: ${order.notes}\n` : ""}
Order placed at: ${new Date().toLocaleString()}`,
      },
    };

    try {
      await db.collection("mail").add(emailData);
      logger.info("New order notification email queued", {
        orderId,
        orderNumber: order.orderNumber,
      });
    } catch (error) {
      logger.error("Failed to queue new order notification email", error);
    }
  }
);
