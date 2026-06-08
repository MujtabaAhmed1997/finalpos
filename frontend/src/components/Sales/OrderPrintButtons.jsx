import React, { useState } from "react";
import { FaUtensils, FaTruck } from "react-icons/fa";
import { get } from "../../service/apiClient";
import { useToast } from "../../ui/toast/ToastProvider";
import {
  printKitchenTicket,
  printDeliveryTicket,
  mapLocalEntriesToItems,
} from "../../utils/posPrint";

function OrderPrintButtons({
  orderId,
  localEntries = null,
  products = [],
  compact = false,
  className = "",
}) {
  const [printing, setPrinting] = useState(null);
  const toast = useToast();

  const loadPrintData = async () => {
    const [orderRes, detailsRes] = await Promise.all([
      get(`/sales-orders/${orderId}`),
      get(`/salesordersdetails/salesOrder/${orderId}/details?limit=500`),
    ]);

    let items = detailsRes.data?.OrderDetails || [];
    if (items.length === 0 && localEntries?.length) {
      items = mapLocalEntriesToItems(localEntries, products);
    }

    if (items.length === 0) {
      throw new Error("no_items");
    }

    let customer = orderRes.data?.Customer || null;
    if (orderRes.data?.CustomerID) {
      try {
        const custRes = await get(`/customers/${orderRes.data.CustomerID}`);
        customer = custRes.data;
      } catch {
        // keep partial customer from order include
      }
    }

    return { order: orderRes.data, items, customer };
  };

  const handlePrint = async (type) => {
    if (!orderId) {
      toast.error("Order ID missing — cannot print.");
      return;
    }

    setPrinting(type);
    try {
      const data = await loadPrintData();
      const result =
        type === "kitchen"
          ? printKitchenTicket(data)
          : printDeliveryTicket(data);

      if (!result.ok) {
        toast.error(
          "Print window blocked. Allow pop-ups for this site, then try again."
        );
        return;
      }

      toast.success(
        type === "kitchen"
          ? "Kitchen ticket sent to printer."
          : "Delivery slip sent to printer."
      );
    } catch (err) {
      if (err.message === "no_items") {
        toast.error("Add items to the order before printing.");
      } else {
        console.error("Print error:", err);
        toast.error("Could not load order for printing. Try again.");
      }
    } finally {
      setPrinting(null);
    }
  };

  const btnClass = compact ? "btn-pos-print btn-pos-print--compact" : "btn-pos-print";

  return (
    <div className={`order-print-buttons ${className}`.trim()}>
      <button
        type="button"
        className={`${btnClass} btn-kitchen`}
        disabled={!!printing}
        onClick={() => handlePrint("kitchen")}
        title="Print kitchen ticket (KOT)"
      >
        <FaUtensils />
        {printing === "kitchen" ? "Printing…" : compact ? "Kitchen" : "Print Kitchen"}
      </button>
      <button
        type="button"
        className={`${btnClass} btn-delivery`}
        disabled={!!printing}
        onClick={() => handlePrint("delivery")}
        title="Print delivery slip"
      >
        <FaTruck />
        {printing === "delivery" ? "Printing…" : compact ? "Delivery" : "Print Delivery"}
      </button>
    </div>
  );
}

export default OrderPrintButtons;
