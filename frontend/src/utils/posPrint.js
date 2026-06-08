const THERMAL_STYLES = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 12px;
    line-height: 1.35;
    color: #000;
    background: #fff;
    width: 72mm;
    max-width: 72mm;
    margin: 0 auto;
    padding: 4mm 3mm;
  }
  .ticket-title {
    text-align: center;
    font-size: 16px;
    font-weight: 700;
    text-transform: uppercase;
    margin-bottom: 6px;
  }
  .ticket-subtitle {
    text-align: center;
    font-size: 11px;
    margin-bottom: 8px;
  }
  .divider {
    border-top: 1px dashed #000;
    margin: 8px 0;
  }
  .meta-row {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 4px;
    font-size: 11px;
  }
  .meta-block {
    margin-bottom: 6px;
    font-size: 11px;
  }
  .meta-block strong {
    display: block;
    font-size: 12px;
    margin-bottom: 2px;
  }
  .items-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 11px;
  }
  .items-table th {
    text-align: left;
    border-bottom: 1px solid #000;
    padding: 4px 0;
    font-size: 10px;
    text-transform: uppercase;
  }
  .items-table td {
    padding: 5px 0;
    vertical-align: top;
    border-bottom: 1px dotted #ccc;
  }
  .item-name {
    font-weight: 700;
    font-size: 12px;
  }
  .item-meta {
    font-size: 10px;
    color: #333;
  }
  .qty {
    text-align: right;
    font-weight: 700;
    white-space: nowrap;
  }
  .total-row {
    display: flex;
    justify-content: space-between;
    font-weight: 700;
    font-size: 13px;
    margin-top: 8px;
  }
  .footer {
    text-align: center;
    font-size: 10px;
    margin-top: 10px;
  }
  @page { size: 80mm auto; margin: 2mm; }
  @media print {
    body { width: 72mm; }
  }
`;

const formatDateTime = (dateString) => {
  const d = dateString ? new Date(dateString) : new Date();
  return {
    date: d.toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric" }),
    time: d.toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" }),
  };
};

const formatQty = (item) => {
  const parts = [];
  if (item.Quantity) parts.push(`${item.Quantity} pkg`);
  if (item.LooseQuantity) parts.push(`${item.LooseQuantity} loose`);
  return parts.length ? parts.join(" + ") : "—";
};

const getProductName = (item) =>
  item.Product?.ProductName || item.productName || item.ProductName || "Item";

const getVariationLabel = (item) => {
  const v = item.ProductVariation;
  if (!v) return "";
  const parts = [v.Size, v.Color, v.SKU].filter(Boolean);
  return parts.join(" • ");
};

const buildItemsRows = (items, showPrices) =>
  items
    .map((item) => {
      const name = getProductName(item);
      const variation = getVariationLabel(item);
      const qty = formatQty(item);
      const priceCell =
        showPrices && item.total != null
          ? `<td class="qty">${Number(item.total).toFixed(0)}</td>`
          : "";
      return `
        <tr>
          <td>
            <div class="item-name">${name}</div>
            ${variation ? `<div class="item-meta">${variation}</div>` : ""}
          </td>
          <td class="qty">${qty}</td>
          ${priceCell}
        </tr>
      `;
    })
    .join("");

const buildKitchenHtml = ({ order, items, customer }) => {
  const { date, time } = formatDateTime(order?.OrderDate);
  const orderId = order?.SalesOrderID || "—";
  const customerName = customer?.CustomerName || order?.Customer?.CustomerName || "Walk-in";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Kitchen Order #${orderId}</title>
  <style>${THERMAL_STYLES}</style>
</head>
<body>
  <div class="ticket-title">Kitchen Order</div>
  <div class="ticket-subtitle">KOT — Order #${orderId}</div>
  <div class="divider"></div>
  <div class="meta-row"><span>Date: ${date}</span><span>Time: ${time}</span></div>
  <div class="meta-block"><strong>Customer:</strong> ${customerName}</div>
  <div class="divider"></div>
  <table class="items-table">
    <thead>
      <tr>
        <th>Item</th>
        <th style="text-align:right">Qty</th>
      </tr>
    </thead>
    <tbody>
      ${buildItemsRows(items, false)}
    </tbody>
  </table>
  <div class="divider"></div>
  <div class="footer">*** Send to Kitchen ***</div>
  <script>
    window.onload = function() {
      setTimeout(function() {
        window.focus();
        window.print();
      }, 250);
    };
  </script>
</body>
</html>`;
};

const buildDeliveryHtml = ({ order, items, customer }) => {
  const { date, time } = formatDateTime(order?.OrderDate);
  const orderId = order?.SalesOrderID || "—";
  const customerName = customer?.CustomerName || order?.Customer?.CustomerName || "Walk-in";
  const phone = customer?.Phone || "—";
  const address = customer?.Address || "—";
  const total = order?.TotalAmount ?? items.reduce((sum, i) => sum + (Number(i.total) || 0), 0);

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Delivery Slip #${orderId}</title>
  <style>${THERMAL_STYLES}</style>
</head>
<body>
  <div class="ticket-title">Delivery Slip</div>
  <div class="ticket-subtitle">Order #${orderId}</div>
  <div class="divider"></div>
  <div class="meta-row"><span>Date: ${date}</span><span>Time: ${time}</span></div>
  <div class="meta-block"><strong>${customerName}</strong>Phone: ${phone}</div>
  <div class="meta-block"><strong>Address:</strong> ${address}</div>
  <div class="divider"></div>
  <table class="items-table">
    <thead>
      <tr>
        <th>Item</th>
        <th style="text-align:right">Qty</th>
        <th style="text-align:right">Amt</th>
      </tr>
    </thead>
    <tbody>
      ${buildItemsRows(items, true)}
    </tbody>
  </table>
  <div class="divider"></div>
  <div class="total-row"><span>Total</span><span>${Number(total).toFixed(0)}</span></div>
  <div class="footer">*** Delivery Copy ***</div>
  <script>
    window.onload = function() {
      setTimeout(function() {
        window.focus();
        window.print();
      }, 250);
    };
  </script>
</body>
</html>`;
};

export const openPrintWindow = (html, title) => {
  const printWindow = window.open("", "_blank", "width=420,height=720,noopener,noreferrer");
  if (!printWindow) {
    return { ok: false, error: "popup_blocked" };
  }

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.document.title = title;

  return { ok: true, window: printWindow };
};

export const printKitchenTicket = (payload) => {
  const html = buildKitchenHtml(payload);
  const orderId = payload?.order?.SalesOrderID || "";
  return openPrintWindow(html, `Kitchen Order #${orderId}`);
};

export const printDeliveryTicket = (payload) => {
  const html = buildDeliveryHtml(payload);
  const orderId = payload?.order?.SalesOrderID || "";
  return openPrintWindow(html, `Delivery Slip #${orderId}`);
};

export const mapLocalEntriesToItems = (entries, products = []) =>
  entries
    .filter((e) => e.ProductID && (e.Quantity || e.LooseQuantity))
    .map((entry) => {
      const product = products.find(
        (p) => String(p.ProductID) === String(entry.ProductID)
      );
      return {
        Product: { ProductName: product?.ProductName || entry.ProductName || "Item" },
        ProductVariation: {
          Size: entry.SkuLabel || entry.UnitType || "",
          SKU: entry.Barcode || "",
        },
        Quantity: Number(entry.Quantity) || 0,
        LooseQuantity: Number(entry.LooseQuantity) || 0,
        total: 0,
      };
    });
