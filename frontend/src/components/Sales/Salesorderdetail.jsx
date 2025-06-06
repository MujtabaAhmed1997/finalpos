import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { SalesOrderDetailvalidator } from "../../controllers/Sorderdeatil"; // Adjust the import path as needed
import conversionService from "../../service/Conversionservice";

const { sellQuantity } = conversionService;

function AddSalesOrderDetail() {
  const { id: SalesOrderID } = useParams(); // Get SalesOrderID from URL
  const [entries, setEntries] = useState([
    {
      SalesOrderID: SalesOrderID || "", // Pre-fill SalesOrderID
      ProductID: "",
      VariationID: "",
      Barcode: "", // Add Barcode field
      Quantity: "",
      LooseQuantity: "", // Add LooseQuantity
      UnitPrice: 0,
      LooseQuantityPrice: 0,
      Discount: 0,
      UnitPerPackage: 1, // Add UnitPerPackaging with default value 1
      LooseStock: 0,
      ContainerStock: 0, // Add ContainerStock field
      UnitType: "",
    },
  ]);

  const [products, setProducts] = useState([]);
  const [variations, setVariations] = useState({});
  const [errors, setErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [total, setTotal] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
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
      const response = await axios.get(
        `http://localhost:3001/api/products/${productId}/variations`
      );
      setVariations((prev) => ({ ...prev, [index]: response.data }));
    } catch (error) {
      console.error("Error fetching variations:", error);
    }
  };

  const fetchVariationDetails = async (variationId, index) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/productVariations/${variationId}`
      );
      const variation = response.data;
      const stockResponse = await axios.get(
        `http://localhost:3001/api/stocktransaction/get-stock/${variationId}`
      );
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
    try {
      const response = await axios.get(
        `http://localhost:3001/api/productVariations/barcode/${barcode}`
      );
      const variation = response.data;
      const stockResponse = await axios.get(
        `http://localhost:3001/api/stocktransaction/get-stock/${variation.VariationID}`
      );
      setEntries((prevEntries) => {
        const newEntries = [...prevEntries];
        newEntries[index].VariationID = variation.VariationID;
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

  // const calculateTotal = async (
  //   quantity,
  //   unitPrice,
  //   discount,
  //   looseQuantity,
  //   unitPerPackage,
  //   unitType,
  //   variationID
  // ) => {
  //   const discountedPrice = unitPrice - discount;

  //   if (unitType === "Container") {
  //     const singlePiecePrice = discountedPrice / unitPerPackage;
  //     const looseQuantityPrice = looseQuantity * singlePiecePrice;

  //     return {
  //       total: quantity * discountedPrice + looseQuantityPrice,
  //       looseQuantityPrice: singlePiecePrice,
  //     };
  //   } else if (unitType === "Sack") {
  //     try {
  //       const response = await axios.get(
  //         "http://localhost:3001/api/pricerule/rate",
  //         {
  //           params: {
  //             variationID: variationID,
  //             looseQuantity: looseQuantity,
  //           },
  //         }
  //       );

  //       const looseQuantityP = response.data.looseQuantityPrice;
  //       const looseQuantityPrice = response.data.price;
  //       return {
  //         total: quantity * discountedPrice + looseQuantityP,
  //         looseQuantityPrice: looseQuantityPrice,
  //       };
  //     } catch (error) {
  //       console.error("Error fetching price for Sack:", error);

  //       // Return a default value in case of an error
  //       return {
  //         total: quantity * discountedPrice,
  //         looseQuantityPrice: 0,
  //       };
  //     }
  //   }

  //   // Return default value for unsupported unitType
  //   return {
  //     total: quantity * discountedPrice,
  //     looseQuantityPrice: 0,
  //   };
  // };

  // const calculateSumOfAllEntries = async () => {
  //   let sum = 0;

  //   for (let entry of entries) {
  //     const {
  //       Quantity,
  //       UnitPrice,
  //       Discount,
  //       LooseQuantity,
  //       UnitPerPackage,
  //       UnitType,
  //       VariationID,
  //     } = entry;

  //     // Safely handle the result from calculateTotal
  //     const result = await calculateTotal(
  //       Quantity,
  //       UnitPrice,
  //       Discount,
  //       LooseQuantity,
  //       UnitPerPackage,
  //       UnitType,
  //       VariationID
  //     );

  //     if (result && typeof result.total === "number") {
  //       // Update entry with looseQuantityPrice
  //       entry.LooseQuantityPrice = result.looseQuantityPrice;

  //       // Accumulate the total
  //       sum += result.total;
  //     } else {
  //       console.error("Invalid result from calculateTotal:", result);
  //     }
  //   }

  //   // Update the total sum in the state
  //   setTotal(sum);
  // };

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
        const response = await axios.get(
          "http://localhost:3001/api/pricerule/rate",
          {
            params: {
              variationID: variationID,
              looseQuantity: looseQuantity,
            },
          }
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

        // Return a default value in case of an error
        return {
          total: quantity * discountedPrice,
          looseQuantityPrice: 0,
        };
      }
    }

    // Return default value for unsupported unitType
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

      // Safely handle the result from calculateTotal
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
        // Update entry with looseQuantityPrice
        entry.LooseQuantityPrice = result.looseQuantityPrice;

        // Accumulate the total
        sum += result.total;
      } else {
        console.error("Invalid result from calculateTotal:", result);
      }
    }

    // Update the total sum in the state
    setTotal(sum);
  };

  useEffect(() => {
    calculateSumOfAllEntries();
  }, [entries]);

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   const validationErrors = entries.map((entry) =>
  //     SalesOrderDetailvalidator(entry)
  //   );
  //   const stockErrors = entries.map((entry) => {
  //     if (entry.Quantity > entry.StockAvailable) {
  //       return { Quantity: "Not enough stock available" };
  //     }
  //     return {};
  //   });

  //   const combinedErrors = validationErrors.map((error, index) => ({
  //     ...error,
  //     ...stockErrors[index],
  //   }));
  //   const hasErrors = combinedErrors.some(
  //     (error) => Object.keys(error).length > 0
  //   );
  //   setErrors(combinedErrors);

  //   if (!hasErrors) {
  //     setIsSubmitting(true);

  //     try {
  //       const salesOrderDetailsResponse = await axios.post(
  //         "http://localhost:3001/api/salesordersdetails",
  //         { entries }
  //       );
  //       console.log("Sales Order Details Response:", salesOrderDetailsResponse);

  //       // Ensure that the response includes IDs
  //       const savedEntries = salesOrderDetailsResponse.data;

  //       // // Step 2: Perform stock transactions and collect responses
  //       // const stockTransactionResponses = await Promise.all(
  //       //   entries.map(async (entry) => {
  //       //     const looseQuantity = entry.LooseQuantity || 0;
  //       //     const containerQuantity = entry.Quantity || 0;
  //       //     const unitType = entry.UnitType || "L";

  //       //     // Call sellQuantity and return the response for this entry
  //       //     const response = await sellQuantity(
  //       //       entry.VariationID,
  //       //       containerQuantity,
  //       //       looseQuantity,
  //       //       unitType
  //       //     );

  //       //     return {
  //       //       ...response, // Include BatchID from the response
  //       //       EntryID: entry.EntryID, // Track the corresponding entry for later use
  //       //     };
  //       //   })
  //       // );

  //       // // Step 3: Update the sales order details with BatchID
  //       // await Promise.all(
  //       //   entries.map(async (entry) => {
  //       //     // Find the matching stock transaction response
  //       //     const matchingResponse = stockTransactionResponses.find(
  //       //       (resp) => resp.EntryID === entry.EntryID
  //       //     );

  //       //     // Perform the PUT request for each sales order detail
  //       //     if (matchingResponse?.BatchID) {
  //       //       await axios.put(
  //       //         `http://localhost:3001/api/salesordersdetails/${entry.EntryID}`,
  //       //         {
  //       //           BatchID: matchingResponse.BatchID,
  //       //         }
  //       //       );
  //       //     }
  //       //   })
  //       // );
  //       const stockTransactionResponses = await Promise.all(
  //         entries.map(async (entry) => {
  //           try {
  //             const looseQuantity = entry.LooseQuantity || 0;
  //             const containerQuantity = entry.Quantity || 0;
  //             const unitType = entry.UnitType || "L";

  //             // Call sellQuantity and return the response for this entry
  //             const response = await sellQuantity(
  //               entry.VariationID,
  //               containerQuantity,
  //               looseQuantity,
  //               unitType
  //             );

  //             console.log("response from sell quantity", response);
  //             // Ensure the response has stockTransactions and containerStockTransactions and handle accordingly
  //             if (
  //               !response ||
  //               (!response.stockTransactions &&
  //                 !response.containerStockTransactions)
  //             ) {
  //               console.error(
  //                 "sellQuantity did not return stockTransactions or containerStockTransactions",
  //                 response
  //               );
  //               return { EntryID: response.Co, BatchIDs: [] }; // Handle missing data safely
  //             }

  //             // Extract BatchIDs from both stockTransactions and containerStockTransactions
  //             const batchIDs = [
  //               ...response.stockTransactions.map((tx) => tx.BatchID), // Extract from stockTransactions for loose quantity
  //               ...response.containerStockTransactions.map((tx) => tx.BatchID), // Extract from containerStockTransactions for container quantity
  //             ];

  //             const variationIDs = [
  //               ...(response.stockTransactions || []).map(
  //                 (tx) => tx.VariationID
  //               ),
  //               ...(response.containerStockTransactions || []).map(
  //                 (tx) => tx.VariationID
  //               ),
  //             ];

  //             console.log("entryid step 2", entry.EntryID);
  //             console.log("variationIDs", variationIDs);

  //             return {
  //               EntryID: entry.EntryID,
  //               VariationIDs: variationIDs,
  //               BatchIDs: batchIDs,
  //             };
  //           } catch (error) {
  //             console.error(
  //               `Error in sellQuantity for EntryID ${entry.EntryID}:`,
  //               error
  //             );
  //             return { EntryID: entry.EntryID, VariationIDs: [], BatchIDs: [] }; // Return an empty array on failure
  //           }
  //         })
  //       );

  //       console.log(
  //         "stock transaction response step 2",
  //         stockTransactionResponses
  //       );

  //       await Promise.all(
  //         stockTransactionResponses.map(async (resp) => {
  //           if (resp.VariationIDs.length > 0 && resp.BatchIDs.length > 0) {
  //             try {
  //               const batchIDsString = resp.BatchIDs.join(",");
  //               console.log("VariationIDs:", resp.VariationIDs);

  //               // Find matching sales order detail based on any VariationID
  //               const matchingEntry = savedEntries.find((entry) =>
  //                 resp.VariationIDs.includes(entry.VariationID)
  //               );

  //               console.log("Matching Entry:", matchingEntry);

  //               if (matchingEntry) {
  //                 const updatedSalesOrderDetail = await axios.put(
  //                   `http://localhost:3001/api/salesordersdetails/update/${matchingEntry.ID}`,
  //                   {
  //                     BatchID: batchIDsString,
  //                   }
  //                 );
  //                 console.log(
  //                   "Updated Sales Order Detail:",
  //                   updatedSalesOrderDetail
  //                 );
  //               }
  //             } catch (error) {
  //               console.error(
  //                 `Error updating sales order detail for EntryID ${resp.EntryID}:`,
  //                 error
  //               );
  //             }
  //           }
  //         })
  //       );

  //       // Step 4: Navigate to the sales order update page
  //       navigate(`/salesorder/update/${SalesOrderID}`);
  //     } catch (error) {
  //       console.error(
  //         "Error handling stock transactions or updating sales order details:",
  //         error
  //       );
  //     }
  //   }
  // };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      for (const entry of entries) {
        const response = await axios.post(
          "http://localhost:3001/api/sellingnewlogic/sell-quantity",
          {
            SalesOrderID,
            ProductID: entry.ProductID,
            VariationID: entry.VariationID,
            containerQuantity: entry.Quantity, // Ensure you have this in your form
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

      alert("Sales Order submitted successfully!");
      navigate(`/salesorder/update/${SalesOrderID}`);
    } catch (error) {
      console.error("Error submitting sales order:", error);
      alert(error.response?.data?.message || "Failed to submit sales order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="d-flex vh-100 justify-content-center align-items-center"
      style={{ backgroundColor: "#263043" }}
    >
      <div
        className="w-75 bg-white rounded p-3 overflow-auto"
        style={{ maxHeight: "90vh" }}
      >
        <form onSubmit={handleSubmit}>
          {entries.map((entry, index) => (
            <div className="row" key={index}>
              <div className="col-md-2 mb-3">
                <label htmlFor={`Barcode-${index}`}>
                  <strong>Barcode</strong>
                </label>
                <input
                  onChange={(event) => handleInput(index, event)}
                  type="text"
                  placeholder="Enter Barcode"
                  className="form-control rounded-0"
                  name="Barcode"
                  value={entry.Barcode}
                  id={`Barcode-${index}`}
                />
                {errors[index]?.Barcode && (
                  <div className="text-danger">{errors[index].Barcode}</div>
                )}
              </div>
              <div className="col-md-2 mb-3">
                <label htmlFor={`ProductID-${index}`}>
                  <strong>Product</strong>
                </label>
                <select
                  className="form-select rounded-0"
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
                  <div className="text-danger">{errors[index].ProductID}</div>
                )}
              </div>
              <div className="col-md-2 mb-3">
                <label htmlFor={`VariationID-${index}`}>
                  <strong>Variation</strong>
                </label>
                <select
                  className="form-select rounded-0"
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
                      {variation.SKU}
                    </option>
                  ))}
                </select>
                {errors[index]?.VariationID && (
                  <div className="text-danger">{errors[index].VariationID}</div>
                )}
              </div>
              <div className="col-md-2 mb-3">
                <label htmlFor={`Quantity-${index}`}>
                  <strong>Quantity</strong>
                </label>
                <input
                  onChange={(event) => handleInput(index, event)}
                  type="number"
                  placeholder="Enter Quantity"
                  className="form-control rounded-0"
                  name="Quantity"
                  value={entry.Quantity}
                  id={`Quantity-${index}`}
                />
                {errors[index]?.Quantity && (
                  <div className="text-danger">{errors[index].Quantity}</div>
                )}
                {entry.ContainerStock > 0 && (
                  <span className="text-success">
                    Available: {entry.ContainerStock}
                  </span>
                )}
              </div>
              <div className="col-md-2 mb-3">
                <label htmlFor={`LooseQuantity-${index}`}>
                  <strong>Loose Quantity</strong>
                </label>
                <input
                  onChange={(event) => handleInput(index, event)}
                  type="number"
                  placeholder="Loose Quantity"
                  className="form-control rounded-0"
                  name="LooseQuantity"
                  value={entry.LooseQuantity}
                  id={`LooseQuantity-${index}`}
                />
                {errors[index]?.LooseQuantity && (
                  <div className="text-danger">
                    {errors[index].LooseQuantity}
                  </div>
                )}
                {entry.LooseStock > 0 && (
                  <span className="text-success">
                    Available: {entry.LooseStock}
                  </span>
                )}
              </div>
              <div className="col-md-2 mb-3">
                <label htmlFor={`UnitPrice-${index}`}>
                  <strong>Unit Price</strong>
                </label>
                <input
                  type="number"
                  placeholder="Unit Price"
                  className="form-control rounded-0"
                  name="UnitPrice"
                  value={entry.UnitPrice}
                  readOnly // Readonly as it is fetched
                  id={`UnitPrice-${index}`}
                />
              </div>
              <div className="col-md-2 mb-3">
                <label htmlFor={`LooseQuantityPrice-${index}`}>
                  <strong>LooseQuantityPrice</strong>
                </label>
                <input
                  type="number"
                  placeholder="LooseQuantityPrice"
                  className="form-control rounded-0"
                  name="LooseQuantityPrice"
                  value={entry.LooseQuantityPrice}
                  readOnly // Readonly as it is fetched
                  id={`LooseQuantityPrice-${index}`}
                />
              </div>
              <div className="col-md-2 mb-3">
                <label htmlFor={`Discount-${index}`}>
                  <strong>Discount</strong>
                </label>
                <input
                  onChange={(event) => handleInput(index, event)}
                  type="number"
                  placeholder="Discount"
                  className="form-control rounded-0"
                  name="Discount"
                  value={entry.Discount}
                  id={`Discount-${index}`}
                />
                {errors[index]?.Discount && (
                  <div className="text-danger">{errors[index].Discount}</div>
                )}
              </div>
              {/* <div className='col-md-2 mb-3'>
                <label htmlFor={`Total-${index}`}><strong>Total</strong></label>
                <input
                  type='text'
                  placeholder='Total Amount'
                  className='form-control rounded-0'
                  name='Total'
                  value={await calculateTotal(entry.Quantity, entry.UnitPrice, entry.Discount, entry.LooseQuantity, entry.UnitPerPackage, entry.UnitType, entry.VariationID)} // Ensure this returns a value before rendering
                  id={`Total-${index}`}
                  readOnly
                />
              </div> */}
              //1{" "}
              {/* <input
      className='form-control rounded-0'
      name='Total'
      value={total} // Use the total from state
      id={`Total-${index}`}
      readOnly

/> */}
              <div>Total: {total}</div>
              <div className="col-md-1 mb-3">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => removeEntry(index)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button type="button" className="btn btn-primary" onClick={addEntry}>
            Add Entry
          </button>
          <button
            type="submit"
            className="btn btn-success"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddSalesOrderDetail;
