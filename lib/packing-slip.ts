import type { Order } from "@/types";

function fmtDate(ts: unknown): string {
  if (!ts) return "—";
  const d =
    typeof (ts as { toDate?: () => Date }).toDate === "function"
      ? (ts as { toDate: () => Date }).toDate()
      : ts instanceof Date
      ? ts
      : null;
  if (!d) return "—";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function esc(str: string | null | undefined): string {
  return (str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildSlip(order: Order, isLast: boolean): string {
  const addr = order.shippingAddress;
  const totalUnits = order.items.reduce((s, i) => s + i.quantity, 0);

  const rows = order.items
    .map(
      (item, i) => `
      <tr style="border-bottom:1px solid #eee;${i % 2 === 1 ? "background:#fafafa;" : ""}">
        <td style="padding:9px 6px;font-size:13px;">${esc(item.name)}</td>
        <td style="padding:9px 6px;font-size:12px;color:#666;">${esc(item.sku)}</td>
        <td style="padding:9px 6px;text-align:center;font-weight:700;font-size:14px;">${item.quantity}</td>
        <td style="padding:9px 6px;text-align:center;font-size:20px;color:#ccc;">☐</td>
      </tr>`
    )
    .join("");

  const notesHtml = order.notes
    ? `<div style="margin-top:20px;padding:12px 14px;border:1px solid #e5e7eb;border-radius:4px;background:#fffbeb;">
        <p style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:#92400e;margin:0 0 4px;">Customer Notes</p>
        <p style="font-size:12px;color:#78350f;margin:0;">${esc(order.notes)}</p>
      </div>`
    : "";

  return `
  <div class="slip"${isLast ? "" : ' style="page-break-after:always;"'}>

    <!-- Header -->
    <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #f59e0b;padding-bottom:16px;margin-bottom:20px;">
      <div>
        <p style="font-size:20px;font-weight:700;color:#1a1a1a;margin:0;letter-spacing:-0.5px;">Lucky Bee Press</p>
        <p style="font-size:11px;color:#9ca3af;margin:3px 0 0;letter-spacing:.5px;text-transform:uppercase;">Artisan Letterpress Cards</p>
      </div>
      <div style="text-align:right;">
        <p style="font-size:18px;font-weight:700;color:#1a1a1a;margin:0;letter-spacing:3px;text-transform:uppercase;">Packing Slip</p>
      </div>
    </div>

    <!-- Order meta + Ship-to -->
    <div style="display:flex;justify-content:space-between;gap:40px;margin-bottom:24px;">
      <div style="min-width:200px;">
        <table style="border-collapse:collapse;">
          <tr>
            <td style="padding:3px 16px 3px 0;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:#6b7280;">Order</td>
            <td style="font-weight:600;font-size:14px;">${esc(order.orderNumber)}</td>
          </tr>
          <tr>
            <td style="padding:3px 16px 3px 0;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:#6b7280;">Date</td>
            <td style="font-size:13px;">${fmtDate(order.createdAt)}</td>
          </tr>
          <tr>
            <td style="padding:3px 16px 3px 0;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:#6b7280;">Units</td>
            <td style="font-size:13px;">${totalUnits}</td>
          </tr>
          <tr>
            <td style="padding:3px 16px 3px 0;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:#6b7280;">Lines</td>
            <td style="font-size:13px;">${order.items.length}</td>
          </tr>
        </table>
      </div>
      <div style="flex:1;max-width:280px;">
        <p style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:#6b7280;margin:0 0 8px;">Ship To</p>
        <p style="margin:0;font-weight:700;font-size:14px;">${esc(addr.firstName)} ${esc(addr.lastName)}</p>
        ${addr.company ? `<p style="margin:2px 0 0;font-size:13px;">${esc(addr.company)}</p>` : ""}
        <p style="margin:2px 0 0;font-size:13px;">${esc(addr.street1)}</p>
        ${addr.street2 ? `<p style="margin:0;font-size:13px;">${esc(addr.street2)}</p>` : ""}
        <p style="margin:2px 0 0;font-size:13px;">${esc(addr.city)}, ${esc(addr.state)} ${esc(addr.postalCode)}</p>
        <p style="margin:0;font-size:13px;">${esc(addr.country)}</p>
      </div>
    </div>

    <!-- Items table -->
    <table style="width:100%;border-collapse:collapse;margin-bottom:8px;">
      <thead>
        <tr style="border-bottom:2px solid #1a1a1a;border-top:1px solid #e5e7eb;">
          <th style="text-align:left;padding:8px 6px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:#374151;">Product</th>
          <th style="text-align:left;padding:8px 6px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:#374151;width:16%;">SKU</th>
          <th style="text-align:center;padding:8px 6px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:#374151;width:10%;">Qty</th>
          <th style="text-align:center;padding:8px 6px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:#374151;width:10%;">✓</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
      <tfoot>
        <tr style="border-top:2px solid #1a1a1a;">
          <td colspan="2" style="padding:9px 6px;font-weight:700;font-size:13px;">Total Units</td>
          <td style="padding:9px 6px;text-align:center;font-weight:700;font-size:14px;">${totalUnits}</td>
          <td></td>
        </tr>
      </tfoot>
    </table>

    ${notesHtml}

    <!-- Picked-by line -->
    <div style="margin-top:32px;display:flex;gap:60px;">
      <div style="flex:1;border-top:1px solid #d1d5db;padding-top:6px;">
        <p style="font-size:10px;color:#9ca3af;margin:0;letter-spacing:.5px;text-transform:uppercase;">Picked By</p>
      </div>
      <div style="flex:1;border-top:1px solid #d1d5db;padding-top:6px;">
        <p style="font-size:10px;color:#9ca3af;margin:0;letter-spacing:.5px;text-transform:uppercase;">Date</p>
      </div>
    </div>

    <!-- Footer -->
    <div style="margin-top:28px;padding-top:12px;border-top:1px solid #f3f4f6;display:flex;justify-content:space-between;font-size:10px;color:#d1d5db;">
      <span>Lucky Bee Press · luckybeepress.com</span>
      <span>Printed ${new Date().toLocaleDateString()}</span>
    </div>

  </div>`;
}

/**
 * Opens a new browser window containing print-ready packing slips for
 * one or more orders, then triggers window.print().
 */
export function printPackingSlips(orders: Order[]): void {
  if (orders.length === 0) return;

  const slipsHtml = orders
    .map((o, i) => buildSlip(o, i === orders.length - 1))
    .join("\n");

  const title =
    orders.length === 1
      ? `Packing Slip – ${orders[0].orderNumber}`
      : `Packing Slips (${orders.length})`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${esc(title)}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0;}
    body{font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1a1a1a;background:#f9fafb;}
    .slip{background:#fff;padding:40px;max-width:780px;margin:24px auto;box-shadow:0 1px 4px rgba(0,0,0,.08);border-radius:4px;}
    .no-print{position:fixed;top:0;left:0;right:0;background:#1a1a1a;color:#fff;padding:12px 20px;display:flex;align-items:center;justify-content:space-between;z-index:999;font-size:13px;}
    .no-print button{background:#f59e0b;color:#1a1a1a;border:none;padding:8px 20px;border-radius:4px;font-weight:700;font-size:14px;cursor:pointer;}
    .no-print button:hover{background:#d97706;}
    .spacer{height:52px;}
    @media print{
      @page{size:letter;margin:.6in;}
      body{background:#fff;}
      .no-print,.spacer{display:none!important;}
      .slip{padding:0;margin:0;max-width:none;box-shadow:none;border-radius:0;}
    }
  </style>
</head>
<body>
  <div class="no-print">
    <span>${esc(title)}</span>
    <button onclick="window.print()">🖨&nbsp; Print</button>
  </div>
  <div class="spacer"></div>
  ${slipsHtml}
</body>
</html>`;

  const win = window.open("", "_blank");
  if (!win) {
    alert("Pop-up blocked. Please allow pop-ups for this page and try again.");
    return;
  }
  win.document.write(html);
  win.document.close();
  win.focus();
}
