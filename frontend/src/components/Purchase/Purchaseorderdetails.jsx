import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import CreatableSelect from "react-select/creatable";
import { validatePurchaseOrderDetail } from "../../controllers/POrderdetailsvalidator";
import { FaShoppingCart, FaPlus, FaTrash, FaSave, FaArrowLeft, FaBox, FaTag, FaHashtag, FaDollarSign } from 'react-icons/fa';
import './PurchaseOrderDetailsForm.css';

function AddPurchaseOrderDetail() {
  const { id: PurchaseOrderID } = useParams();
  const [entries, setEntries] = useState([
    {
      PurchaseOrderID: PurchaseOrderID || "",
      ProductID: "",
      VariationID: "",
      Quantity: "",
      UnitPrice: "",
    },
  ]);

  const [products, setProducts] = useState([]);
  const [variations, setVariations] = useState([]);
  const [errors, setErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [purchaseOrder, setPurchaseOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/products");
        
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

    const fetchPurchaseOrderInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/purchase-orders/${PurchaseOrderID}`);
        setPurchaseOrder(response.data);
      } catch (error) {
        console.error("Error fetching purchase order info:", error);
      }
    };

    fetchProducts();
    fetchPurchaseOrderInfo();
  }, [PurchaseOrderID]);

  const handleInput = (index, event) => {
    const { name, value } = event.target;
    const newEntries = [...entries];
    newEntries[index][name] = value;
    setEntries(newEntries);

    if (name === "ProductID") {
      fetchVariations(value, index);
    }
  };

  const fetchVariations = async (productId) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/products/${productId}/variations`
      );
      console.log("response: ", response.data);
      setVariations(response.data);
    } catch (error) {
      console.error("Error fetching variations:", error);
    }
  };

  const addEntry = () => {
    setEntries([
      ...entries,
      {
        PurchaseOrderID: PurchaseOrderID || "",
        ProductID: "",
        VariationID: "",
        Quantity: "",
        UnitPrice: "",
      },
    ]);
  };

  const removeEntry = (index) => {
    if (entries.length > 1) {
      setEntries(entries.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = entries.map((entry) =>
      validatePurchaseOrderDetail(entry)
    );
    const hasErrors = validationErrors.some(
      (error) => Object.keys(error).length > 0
    );
    setErrors(validationErrors);

    if (!hasErrors) {
      setIsSubmitting(true);

      try {
        // Create Batches
        const batchPromises = entries.map((entry) =>
          axios.post("http://localhost:3001/api/batch/create", {
            ProductID: entry.ProductID,
            VariationID: entry.VariationID,
            CostPricePerUnit: entry.UnitPrice,
            Quantity: entry.Quantity,
          })
        );
        const batchResponses = await Promise.all(batchPromises);
        console.log("batch response", batchResponses);
        
        // Add BatchIDs to Entries
        const batchIds = batchResponses.map((response) => {
          return response.data.batch.BatchID;
        });

        const entriesWithBatchIds = entries.map((entry, index) => ({
          ...entry,
          BatchID: batchIds[index],
        }));
        console.log("batch with ids", entriesWithBatchIds);
        
        // Add Purchase Order Details
        await axios.post("http://localhost:3001/api/purchaseordersdetails", {
          entries: entriesWithBatchIds,
        });

        // ==========================================
        // DYNAMIC UNIT TYPE IMPLEMENTATION - NEW CODE
        // ==========================================
        // Create Stock Transactions with dynamic unit type fetching from Product model
        
        // STEP 1: Get all unique variation IDs to minimize API calls
        const uniqueVariationIds = [...new Set(entriesWithBatchIds.map(entry => entry.VariationID))];
        console.log("Unique Variation IDs:", uniqueVariationIds);
        
        // STEP 2: Fetch product data for all variations in parallel (batch request)
        const variationDataPromises = uniqueVariationIds.map(variationId => 
          axios.get(`http://localhost:3001/api/productVariations/${variationId}/with-product`)
        );
        const variationDataResponses = await Promise.all(variationDataPromises);
        console.log("Variation data responses:", variationDataResponses.map(r => r.data));
        
        // STEP 3: Create a lookup map for efficient unit type access
        // Map structure: { variationId: unitType }
        const variationUnitMap = {};
        variationDataResponses.forEach(response => {
          const variation = response.data;
          variationUnitMap[variation.VariationID] = variation.Product.Unit;
        });
        console.log("Unit type mapping:", variationUnitMap);
        
        // STEP 4: Create stock transactions using the dynamically fetched unit types
        const stockTransactionPromises = entriesWithBatchIds.map((entry) => {
          const unitType = variationUnitMap[entry.VariationID];
          console.log(`Creating stock transaction for variation ${entry.VariationID} with unit type: ${unitType}`);
          
          return axios.post("http://localhost:3001/api/stocktransaction", {
            VariationID: entry.VariationID,
            TransactionDate: new Date(),
            Quantity: entry.Quantity,
            RemainingQuantity: entry.Quantity,
            TransactionType: "IN",
            UnitType: unitType, // Dynamic unit type from Product model
            BuyingPrice: entry.UnitPrice,
            BatchID: entry.BatchID,
          });
        });
        
        // ==========================================
        // OLD CODE - COMMENTED OUT
        // ==========================================
        // Previous implementation had empty UnitType field:
        // const stockTransactionPromises = entriesWithBatchIds.map((entry) =>
        //   axios.post("http://localhost:3001/api/stocktransaction", {
        //     VariationID: entry.VariationID,
        //     TransactionDate: new Date(),
        //     Quantity: entry.Quantity,
        //     RemainingQuantity: entry.Quantity,
        //     TransactionType: "IN",
        //     UnitType: ,  // <-- This was empty and causing the issue
        //     BuyingPrice: entry.UnitPrice,
        //     BatchID: entry.BatchID,
        //   })
        // );
        // ==========================================
        await Promise.all(stockTransactionPromises);

        navigate(`/purchaseorder/update/${PurchaseOrderID}`);
      } catch (error) {
        console.error("Error during submission:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const calculateTotal = () => {
    return entries.reduce((sum, entry) => {
      const quantity = parseFloat(entry.Quantity) || 0;
      const unitPrice = parseFloat(entry.UnitPrice) || 0;
      return sum + (quantity * unitPrice);
    }, 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  console.log("variations: ", variations);

  return (
    <div className="purchase-order-details-form-container">
      <div className="purchase-order-details-form-card">
        <div className="form-header">
          <div className="header-content">
            <FaShoppingCart className="header-icon" />
            <div className="header-text">
              <h2 className="form-title">Add Purchase Order Details</h2>
              <p className="form-subtitle">
                Order #{PurchaseOrderID} - {purchaseOrder?.OrderDate ? new Date(purchaseOrder.OrderDate).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
          <button className="back-button" onClick={handleBackClick}>
            <FaArrowLeft className="back-icon" />
            Back
          </button>
        </div>

        {purchaseOrder && (
          <div className="order-summary">
            <div className="summary-grid">
              <div className="summary-item">
                <FaBox className="summary-icon" />
                <div className="summary-content">
                  <span className="summary-label">Supplier</span>
                  <span className="summary-value">{purchaseOrder.Supplier?.SupplierName || 'N/A'}</span>
                </div>
              </div>
              <div className="summary-item">
                <FaDollarSign className="summary-icon" />
                <div className="summary-content">
                  <span className="summary-label">Order Total</span>
                  <span className="summary-value">{formatCurrency(purchaseOrder.TotalAmount || 0)}</span>
                </div>
              </div>
              <div className="summary-item">
                <FaTag className="summary-icon" />
                <div className="summary-content">
                  <span className="summary-label">Items to Add</span>
                  <span className="summary-value">{entries.length}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="purchase-order-details-form">
          <div className="entries-container">
            {entries.map((entry, index) => (
              <div key={index} className="entry-card">
                <div className="entry-header">
                  <FaHashtag className="entry-icon" />
                  <span className="entry-number">Item {index + 1}</span>
                  {entries.length > 1 && (
                    <button
                      type="button"
                      className="remove-entry-button"
                      onClick={() => removeEntry(index)}
                    >
                      <FaTrash className="remove-icon" />
                    </button>
                  )}
                </div>

                <div className="entry-fields">
                  <div className="field-group">
                    <label className="field-label">
                      <FaBox className="label-icon" />
                      Purchase Order ID
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={entry.PurchaseOrderID}
                      readOnly
                    />
                    {errors[index]?.PurchaseOrderID && (
                      <span className="error-message">{errors[index].PurchaseOrderID}</span>
                    )}
                  </div>

                  <div className="field-group">
                    <label className="field-label">
                      <FaBox className="label-icon" />
                      Product
                    </label>
                    <CreatableSelect
                      options={products.map((product) => ({
                        value: product.ProductID,
                        label: product.ProductName,
                      }))}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      isClearable
                      isSearchable
                      name="ProductID"
                      value={products
                        .map((product) => ({
                          value: product.ProductID,
                          label: product.ProductName,
                        }))
                        .find((option) => option.value === entry.ProductID)}
                      onChange={(selectedOption) =>
                        handleInput(index, {
                          target: {
                            name: "ProductID",
                            value: selectedOption ? selectedOption.value : "",
                          },
                        })
                      }
                      placeholder="Select a product..."
                    />
                    {errors[index]?.ProductID && (
                      <span className="error-message">{errors[index].ProductID}</span>
                    )}
                  </div>

                  <div className="field-group">
                    <label className="field-label">
                      <FaTag className="label-icon" />
                      Variation
                    </label>
                    <CreatableSelect
                      options={
                        variations.length > 0 &&
                        variations.map((variation) => ({
                          value: variation.VariationID,
                          label: variation.SKU,
                        }))
                      }
                      className="react-select-container"
                      classNamePrefix="react-select"
                      isClearable
                      isSearchable
                      name="VariationID"
                      value={
                        variations.length > 0 &&
                        variations
                          .map((variation) => ({
                            value: variation.VariationID,
                            label: variation.SKU,
                          }))
                          .find((option) => option.value === entry.VariationID)
                      }
                      onChange={(selectedOption) =>
                        handleInput(index, {
                          target: {
                            name: "VariationID",
                            value: selectedOption ? selectedOption.value : "",
                          },
                        })
                      }
                      placeholder="Select a variation..."
                      isDisabled={!entry.ProductID}
                    />
                    {errors[index]?.VariationID && (
                      <span className="error-message">{errors[index].VariationID}</span>
                    )}
                  </div>

                  <div className="field-group">
                    <label className="field-label">
                      <FaHashtag className="label-icon" />
                      Quantity
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="Quantity"
                      value={entry.Quantity}
                      onChange={(event) => handleInput(index, event)}
                      placeholder="Enter quantity"
                    />
                    {errors[index]?.Quantity && (
                      <span className="error-message">{errors[index].Quantity}</span>
                    )}
                  </div>

                  <div className="field-group">
                    <label className="field-label">
                      <FaDollarSign className="label-icon" />
                      Unit Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      name="UnitPrice"
                      value={entry.UnitPrice}
                      onChange={(event) => handleInput(index, event)}
                      placeholder="Enter unit price"
                    />
                    {errors[index]?.UnitPrice && (
                      <span className="error-message">{errors[index].UnitPrice}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button type="button" className="add-entry-button" onClick={addEntry}>
              <FaPlus className="button-icon" />
              Add Another Item
            </button>
            
            <div className="total-section">
              <div className="total-row">
                <span className="total-label">Estimated Total:</span>
                <span className="total-amount">{formatCurrency(calculateTotal())}</span>
              </div>
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              <FaSave className="button-icon" />
              {isSubmitting ? "Saving..." : "Save Purchase Order Details"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPurchaseOrderDetail;
