import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./Salesorderdetail.css";
import { useToast } from "../../ui/toast/ToastProvider";
import { useConfirm } from "../../ui/confirm/ConfirmProvider";
import { useInvalidate } from "../../context/DataRefreshContext";
import { get, post, delete_ } from "../../service/apiClient";
import "./sales.css";

function AddSalesOrderDetail() {
  const { id: SalesOrderID } = useParams();
  const [entries, setEntries] = useState([
    {
      SalesOrderID: SalesOrderID || "",
      ProductID: "",
      VariationID: "",
      Barcode: "",
      Quantity: "",
      LooseQuantity: "",
      UnitPrice: 0,
      LooseQuantityPrice: 0,
      Discount: 0,
      UnitPerPackage: 1,
      LooseStock: 0,
      ContainerStock: 0,
      UnitType: "",
    },
  ]);

  const [products, setProducts] = useState([]);
  const [variations, setVariations] = useState({});
  const [errors, setErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [total, setTotal] = useState(0);

  const navigate = useNavigate();
  const toast = useToast();
  const { confirm } = useConfirm();
  const invalidate = useInvalidate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await get("/products");
        
        if (response.data.success) {
          setProducts(response.data.products);
        } else {
          console.error("Failed to fetch products:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        
        if (error.response) {
          if (error.response.status === 500) {
            console.error("Server error. Please try again later.");
          } else if (error.response.status === 404) {
            console.error("Products not found.");
          } else {
            console.error(error.response.data.message || "Failed to load products");
          }
        } else if (error.request) {
          console.error("Network error. Please check your connection and try again.");
        } else {
          console.error("An unexpected error occurred. Please try again.");
        }
      }
    };

    fetchProducts();
  }, []);

  const handleInput = (index, event) => {
    const { name, value } = event.target;
    const newEntries = [...entries];
    newEntries[index][name] = value;
    setEntries(newEntries);

    if (name === "ProductID") {
      fetchVariations(value, index);
    } else if (name === "VariationID") {
      console.log("vid", value);
      fetchVariationDetails(value, index);
    } else if (name === "Barcode") {
      fetchVariationByBarcode(value, index);
    }
  };

  const fetchVariations = async (productId, index) => {
    try {
      const response = await get(`/products/${productId}/variations`);
      setVariations((prev) => ({ ...prev, [index]: response.data }));
    } catch (error) {
      console.error("Error fetching variations:", error);
    }
  };

  const fetchVariationDetails = async (variationId, index) => {
    try {
      const response = await get(`/productVariations/${variationId}`);
      const variation = response.data;
      const stockResponse = await get(`/stocktransaction/get-stock/${variationId}`);
      setEntries((prevEntries) => {
        const newEntries = [...prevEntries];
        newEntries[index].UnitPrice = variation.SellingPrice;
        newEntries[index].UnitPerPackage = variation.UnitsPerPackage;
        newEntries[index].ContainerStock = stockResponse.data.stock.Container;
        newEntries[index].LooseStock = stockResponse.data.stock.LooseStock;
        newEntries[index].ProductID = variation.ProductID;
        newEntries[index].UnitType = stockResponse.data.stock.UnitType;
        return newEntries;
      });
    } catch (error) {
      console.error("Error fetching variation details:", error);
    }
  };

  const fetchVariationByBarcode = async (barcode, index) => {
    if (!barcode?.trim()) return;
    try {
      const response = await get(`/productVariations/barcode/${encodeURIComponent(barcode.trim())}`);
      const variation = response.data;
      const stockResponse = await get(`/stocktransaction/get-stock/${variation.VariationID}`);
      const variationsRes = await get(`/products/${variation.ProductID}/variations`);
      setVariations((prev) => ({ ...prev, [index]: variationsRes.data }));
      setEntries((prevEntries) => {
        const newEntries = [...prevEntries];
        newEntries[index].VariationID = variation.VariationID;
        newEntries[index].Barcode = variation.Barcode || barcode.trim();
        newEntries[index].UnitPrice = variation.SellingPrice;
        newEntries[index].UnitPerPackage = variation.UnitsPerPackage;
        newEntries[index].ContainerStock = stockResponse.data.stock.Container;
        newEntries[index].LooseStock = stockResponse.data.stock.LooseStock;
        newEntries[index].ProductID = variation.ProductID;
        newEntries[index].UnitType = stockResponse.data.stock.UnitType;
        return newEntries;
      });
    } catch (error) {
      console.error("Error fetching variation by barcode:", error);
      toast.error("Barcode not found. Check SKU/barcode or select product manually.");
    }
  };

  const addEntry = () => {
    setEntries([
      ...entries,
      {
        SalesOrderID: SalesOrderID || "",
        ProductID: "",
        VariationID: "",
        Barcode: "",
        Quantity: "",
        LooseQuantity: "",
        UnitPrice: "",
        LooseQuantityPrice: 0,
        Discount: 0,
        UnitPerPackage: 1,
        LooseStock: 0,
        ContainerStock: 0,
        UnitType: "",
      },
    ]);
  };

  const removeEntry = (index) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const calculateTotal = async (
    quantity,
    unitPrice,
    discount,
    looseQuantity,
    unitPerPackage,
    unitType,
    variationID
  ) => {
    const discountedPrice = unitPrice - discount;
    console.log("unitype", unitType);
    if (unitType === "Container") {
      const singlePiecePrice = discountedPrice / unitPerPackage;
      const looseQuantityPrice = looseQuantity * singlePiecePrice;

      return {
        total: quantity * discountedPrice + looseQuantityPrice,
        looseQuantityPrice: singlePiecePrice,
      };
    } else if (unitType === "Sack") {
      try {
        const response = await get(
          `/pricerule/rate?variationID=${encodeURIComponent(variationID)}&looseQuantity=${encodeURIComponent(looseQuantity)}`
        );

        const looseQuantityP = response.data.looseQuantityPrice;
        const looseQuantityPrice = response.data.price;
        console.log("lp", looseQuantityP);
        console.log("lqp", looseQuantityPrice);

        return {
          total: quantity * discountedPrice + looseQuantityP,
          looseQuantityPrice: looseQuantityPrice,
        };
      } catch (error) {
        console.error("Error fetching price for Sack:", error);

        return {
          total: quantity * discountedPrice,
          looseQuantityPrice: 0,
        };
      }
    }

    return {
      total: quantity * discountedPrice,
      looseQuantityPrice: 0,
    };
  };

  const calculateSumOfAllEntries = async () => {
    let sum = 0;

    for (let entry of entries) {
      const {
        Quantity,
        UnitPrice,
        Discount,
        LooseQuantity,
        UnitPerPackage,
        UnitType,
        VariationID,
      } = entry;

      const result = await calculateTotal(
        Quantity,
        UnitPrice,
        Discount,
        LooseQuantity,
        UnitPerPackage,
        UnitType,
        VariationID
      );

      if (result && typeof result.total === "number") {
        entry.LooseQuantityPrice = result.looseQuantityPrice;
        sum += result.total;
      } else {
        console.error("Invalid result from calculateTotal:", result);
      }
    }

    setTotal(sum);
  };

  useEffect(() => {
    calculateSumOfAllEntries();
  }, [entries]);

  const getStockStatus = (stock) => {
    if (stock > 10) return "available";
    if (stock > 0) return "low";
    return "out";
  };

  const getStockText = (stock) => {
    if (stock > 10) return "In Stock";
    if (stock > 0) return "Low Stock";
    return "Out of Stock";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const validateEntry = (entry) => {
    const errors = {};
    const qty = Number(entry.Quantity) || 0;
    const looseQty = Number(entry.LooseQuantity) || 0;
    
    if (!entry.ProductID) {
      errors.ProductID = "Product is required";
    }
    
    if (!entry.VariationID) {
      errors.VariationID = "Variation is required";
    }
    
    if (qty <= 0 && looseQty <= 0) {
      errors.Quantity = "At least one quantity is required";
    }
    
    if (qty > 0 && qty > Number(entry.ContainerStock)) {
      errors.Quantity = `Only ${entry.ContainerStock} containers available`;
    }
    
    if (looseQty > 0 && looseQty > Number(entry.LooseStock)) {
      errors.LooseQuantity = `Only ${entry.LooseStock} loose items available`;
    }
    
    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Validate all entries
    const validationErrors = entries.map(validateEntry);
    const hasErrors = validationErrors.some(error => Object.keys(error).length > 0);
    
    if (hasErrors) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);

    try {
      for (const entry of entries) {
        const response = await post(
          "/sellingnewlogic/sell-quantity",
          {
            SalesOrderID,
            ProductID: entry.ProductID,
            VariationID: entry.VariationID,
            containerQuantity: entry.Quantity,
            looseQuantity: entry.LooseQuantity,
            unitType: entry.UnitType,
            UnitPrice: entry.UnitPrice,
            LooseQuantityPrice: entry.LooseQuantityPrice,
            Discount: entry.Discount,
          }
        );

        if (response.status !== 200) {
          throw new Error(response.data.message || "Failed to process sale");
        }
      }

      toast.success("Sales order submitted successfully!");
      invalidate(["salesOrders", "products"]);
      navigate(`/salesorder/update/${SalesOrderID}`);
    } catch (error) {
      console.error("Error submitting sales order:", error);
      toast.error(error.response?.data?.message || "Failed to submit sales order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelOrder = async () => {
    const ok = await confirm({
      title: "Cancel this sales order?",
      description:
        "If you cancel now, we will try to delete the sales order to avoid leaving a partial order in the system.",
      confirmText: "Cancel order",
      cancelText: "Keep working",
      tone: "danger",
    });
    if (!ok) return;

    try {
      await delete_(`/sales-orders/${SalesOrderID}`);
      toast.info("Sales order cancelled.");
      navigate("/salesorder/show");
    } catch (e) {
      toast.error("Could not cancel the order (server rejected delete).");
    }
  };

  return (
    <div className="sales-order-container">
      <div className="sales-order-card">
        <div className="form-header">
          <div className="form-header-nav">
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => navigate(-1)}>
              ← Back
            </button>
            <Link to="/Homepage" className="btn btn-secondary btn-sm">Home</Link>
            <Link to="/salesorder/show" className="btn btn-secondary btn-sm">Sales List</Link>
          </div>
          <h2>Sales Order Details</h2>
          <p>Add products and quantities to your sales order</p>
        </div>

        <form onSubmit={handleSubmit}>
          {entries.map((entry, index) => (
            <div className="entry-row" key={index}>
              <div className="entry-header">
                <span className="entry-number">Entry #{index + 1}</span>
                {entries.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => removeEntry(index)}
                  >
                    <i className="fas fa-trash"></i>
                    Remove
                  </button>
                )}
              </div>

              <div className="row">
                <div className="col-md-3 col-sm-6 mb-3">
                  <div className="form-group">
                    <label className="form-label" htmlFor={`Barcode-${index}`}>
                      Barcode
                    </label>
                    <input
                      onChange={(event) => handleInput(index, event)}
                      type="text"
                      placeholder="Scan or enter barcode"
                      className="form-control"
                      name="Barcode"
                      value={entry.Barcode}
                      id={`Barcode-${index}`}
                    />
                    {errors[index]?.Barcode && (
                      <div className="error-message">
                        <i className="fas fa-exclamation-circle"></i>
                        {errors[index].Barcode}
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-md-3 col-sm-6 mb-3">
                  <div className="form-group">
                    <label className="form-label" htmlFor={`ProductID-${index}`}>
                      Product
                    </label>
                    <select
                      className="form-control form-select"
                      name="ProductID"
                      value={entry.ProductID}
                      onChange={(event) => handleInput(index, event)}
                      id={`ProductID-${index}`}
                    >
                      <option value="">Select Product</option>
                      {products.map((product) => (
                        <option key={product.ProductID} value={product.ProductID}>
                          {product.ProductName}
                        </option>
                      ))}
                    </select>
                    {errors[index]?.ProductID && (
                      <div className="error-message">
                        <i className="fas fa-exclamation-circle"></i>
                        {errors[index].ProductID}
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-md-3 col-sm-6 mb-3">
                  <div className="form-group">
                    <label className="form-label" htmlFor={`VariationID-${index}`}>
                      Variation
                    </label>
                    <select
                      className="form-control form-select"
                      name="VariationID"
                      value={entry.VariationID}
                      onChange={(event) => handleInput(index, event)}
                      id={`VariationID-${index}`}
                    >
                      <option value="">Select Variation</option>
                      {variations[index]?.map((variation) => (
                        <option
                          key={variation.VariationID}
                          value={variation.VariationID}
                        >
                          {variation.SKU || variation.Size || `Var #${variation.VariationID}`}
                        </option>
                      ))}
                    </select>
                    {errors[index]?.VariationID && (
                      <div className="error-message">
                        <i className="fas fa-exclamation-circle"></i>
                        {errors[index].VariationID}
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-md-3 col-sm-6 mb-3">
                  <div className="form-group">
                    <label className="form-label" htmlFor={`Quantity-${index}`}>
                      Container Quantity
                    </label>
                    <input
                      onChange={(event) => handleInput(index, event)}
                      type="number"
                      placeholder="Enter quantity"
                      className="form-control"
                      name="Quantity"
                      value={entry.Quantity}
                      id={`Quantity-${index}`}
                      min="0"
                    />
                    {errors[index]?.Quantity && (
                      <div className="error-message">
                        <i className="fas fa-exclamation-circle"></i>
                        {errors[index].Quantity}
                      </div>
                    )}
                    {entry.ContainerStock > 0 && (
                      <div className="stock-info">
                        <span className={`stock-badge ${getStockStatus(entry.ContainerStock)}`}>
                          <i className="fas fa-box"></i>
                          {getStockText(entry.ContainerStock)}: {entry.ContainerStock}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-md-3 col-sm-6 mb-3">
                  <div className="form-group">
                    <label className="form-label" htmlFor={`LooseQuantity-${index}`}>
                      Loose Quantity
                    </label>
                    <input
                      onChange={(event) => handleInput(index, event)}
                      type="number"
                      placeholder="Loose items"
                      className="form-control"
                      name="LooseQuantity"
                      value={entry.LooseQuantity}
                      id={`LooseQuantity-${index}`}
                      min="0"
                    />
                    {errors[index]?.LooseQuantity && (
                      <div className="error-message">
                        <i className="fas fa-exclamation-circle"></i>
                        {errors[index].LooseQuantity}
                      </div>
                    )}
                    {entry.LooseStock > 0 && (
                      <div className="stock-info">
                        <span className={`stock-badge ${getStockStatus(entry.LooseStock)}`}>
                          <i className="fas fa-cube"></i>
                          {getStockText(entry.LooseStock)}: {entry.LooseStock}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-md-3 col-sm-6 mb-3">
                  <div className="form-group">
                    <label className="form-label" htmlFor={`UnitPrice-${index}`}>
                      Unit Price
                    </label>
                    <input
                      type="number"
                      placeholder="Unit price"
                      className="form-control"
                      name="UnitPrice"
                      value={entry.UnitPrice}
                      readOnly
                      id={`UnitPrice-${index}`}
                    />
                  </div>
                </div>

                <div className="col-md-3 col-sm-6 mb-3">
                  <div className="form-group">
                    <label className="form-label" htmlFor={`LooseQuantityPrice-${index}`}>
                      Loose Unit Price
                    </label>
                    <input
                      type="number"
                      placeholder="Loose unit price"
                      className="form-control"
                      name="LooseQuantityPrice"
                      value={entry.LooseQuantityPrice}
                      readOnly
                      id={`LooseQuantityPrice-${index}`}
                    />
                  </div>
                </div>

                <div className="col-md-3 col-sm-6 mb-3">
                  <div className="form-group">
                    <label className="form-label" htmlFor={`Discount-${index}`}>
                      Discount
                    </label>
                    <input
                      onChange={(event) => handleInput(index, event)}
                      type="number"
                      placeholder="Discount amount"
                      className="form-control"
                      name="Discount"
                      value={entry.Discount}
                      id={`Discount-${index}`}
                      min="0"
                    />
                    {errors[index]?.Discount && (
                      <div className="error-message">
                        <i className="fas fa-exclamation-circle"></i>
                        {errors[index].Discount}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="total-section">
            <p className="total-label">Total Amount</p>
            <h3 className="total-amount">{formatCurrency(total)}</h3>
          </div>

          <div className="action-buttons">
            <button type="button" className="btn btn-primary" onClick={addEntry}>
              <i className="fas fa-plus"></i>
              Add Entry
            </button>
            <button
              type="button"
              className="btn btn-danger"
              disabled={isSubmitting}
              onClick={handleCancelOrder}
            >
              <i className="fas fa-times"></i>
              Cancel Order
            </button>
            <button
              type="submit"
              className="btn btn-success"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="loading-spinner"></span>
                  Processing...
                </>
              ) : (
                <>
                  <i className="fas fa-check"></i>
                  Submit Order
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddSalesOrderDetail;
