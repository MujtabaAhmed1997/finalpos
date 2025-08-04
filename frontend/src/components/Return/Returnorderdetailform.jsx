import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ReturnOrderDetailValidator } from '../../controllers/rorderdetails';
import './Returnorderdetailform.css';

function AddReturnOrderDetail() {
  const { id: ReturnOrderID } = useParams();
  const [entries, setEntries] = useState([{
    ReturnOrderID: ReturnOrderID || "",
    ProductID: "",
    VariationID: "",
    Quantity: "",
    Reason: "", 
    UnitPrice: "",
    LooseQuantity: 0,
    UnitPerPackaging: ""
  }]);

  const [products, setProducts] = useState([]);
  const [variations, setVariations] = useState({});
  const [errors, setErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:3001/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleInput = (index, event) => {
    const { name, value } = event.target;
    const newEntries = [...entries];
    newEntries[index][name] = value;
    setEntries(newEntries);

    if (name === 'ProductID') {
      fetchVariations(value, index);
    } else if (name === 'VariationID') {
      fetchVariationDetails(value, index);
    }
  };

  const fetchVariations = async (productId, index) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/products/${productId}/variations`);
      setVariations(prev => ({ ...prev, [index]: response.data }));
    } catch (error) {
      console.error('Error fetching variations:', error);
    }
  };

  const fetchVariationDetails = async (variationId, index) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/productVariations/${variationId}`);
      const variation = response.data;
      setEntries(prevEntries => {
        const newEntries = [...prevEntries];
        newEntries[index].UnitPrice = variation.SellingPrice;
        newEntries[index].LooseQuantity = variation.LooseQuantity || 0;
        newEntries[index].UnitPerPackaging = variation.UnitsPerPackage || 1;
        return newEntries;
      });
    } catch (error) {
      console.error('Error fetching variation details:', error);
    }
  };

  const addEntry = () => {
    setEntries([...entries, {
      ReturnOrderID: ReturnOrderID || "",
      ProductID: "",
      VariationID: "",
      Quantity: "",
      Reason: "", 
      UnitPrice: "",
      LooseQuantity: 0,
      UnitPerPackaging: ""
    }]);
  };

  const removeEntry = (index) => {
    if (entries.length > 1) {
      setEntries(entries.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = entries.map(entry => ReturnOrderDetailValidator(entry));
    const hasErrors = validationErrors.some(error => Object.keys(error).length > 0);
    setErrors(validationErrors);
  
    if (!hasErrors) {
      setIsSubmitting(true);
  
      try {
        // Create StockTransactions for each entry
        for (const entry of entries) {
          if (entry.Quantity > 0) {
            const stockTransaction = {
              VariationID: entry.VariationID,
              TransactionDate: new Date(),
              Quantity: entry.Quantity,
              UnitType: 'Container',
              TransactionType: 'IN'
            };
            await axios.post('http://localhost:3001/api/stocktransaction', stockTransaction);
          }
          
          if (entry.LooseQuantity > 0) {
            const looseStockTransaction = {
              VariationID: entry.VariationID,
              TransactionDate: new Date(),
              Quantity: entry.LooseQuantity,
              UnitType: 'L',
              TransactionType: 'IN'
            };
            await axios.post('http://localhost:3001/api/stocktransaction', looseStockTransaction);
          }
        }
        
        await axios.post('http://localhost:3001/api/returnordersdetails', { entries });
        navigate(`/updatereturnorder/${ReturnOrderID}`);
        
      } catch (err) {
        console.error('Error adding return order details:', err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="return-detail-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="return-detail-container">
      <div className="return-detail-card">
        <div className="return-detail-header">
          <h2>Add Return Order Details</h2>
          <p>Return Order ID: {ReturnOrderID}</p>
        </div>

        <form onSubmit={handleSubmit} className="return-detail-form">
          {entries.map((entry, index) => (
            <div className="entry-card" key={index}>
              <div className="entry-header">
                <h3>Item #{index + 1}</h3>
                {entries.length > 1 && (
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeEntry(index)}
                    title="Remove this item"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                  </button>
                )}
              </div>

              <div className="form-grid">
                {/* Product Selection */}
                <div className="form-group">
                  <label htmlFor={`ProductID-${index}`}>
                    Product <span className="required">*</span>
                  </label>
                  <select
                    name="ProductID"
                    id={`ProductID-${index}`}
                    className={`form-control ${errors[index]?.ProductID ? 'error' : ''}`}
                    value={entry.ProductID}
                    onChange={event => handleInput(index, event)}
                  >
                    <option value="">Select Product</option>
                    {products.map(product => (
                      <option key={product.ProductID} value={product.ProductID}>
                        {product.ProductName}
                      </option>
                    ))}
                  </select>
                  {errors[index]?.ProductID && (
                    <span className="error-message">{errors[index].ProductID}</span>
                  )}
                </div>

                {/* Variation Selection */}
                <div className="form-group">
                  <label htmlFor={`VariationID-${index}`}>
                    Variation <span className="required">*</span>
                  </label>
                  <select
                    name="VariationID"
                    id={`VariationID-${index}`}
                    className={`form-control ${errors[index]?.VariationID ? 'error' : ''}`}
                    value={entry.VariationID}
                    onChange={event => handleInput(index, event)}
                    disabled={!entry.ProductID}
                  >
                    <option value="">Select Variation</option>
                    {(variations[index] || []).map(variation => (
                      <option key={variation.VariationID} value={variation.VariationID}>
                        {variation.SKU}
                      </option>
                    ))}
                  </select>
                  {errors[index]?.VariationID && (
                    <span className="error-message">{errors[index].VariationID}</span>
                  )}
                </div>

                {/* Reason for Return */}
                <div className="form-group">
                  <label htmlFor={`Reason-${index}`}>
                    Reason for Return <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="Reason"
                    id={`Reason-${index}`}
                    className={`form-control ${errors[index]?.Reason ? 'error' : ''}`}
                    value={entry.Reason}
                    onChange={event => handleInput(index, event)}
                    placeholder="Enter return reason"
                  />
                  {errors[index]?.Reason && (
                    <span className="error-message">{errors[index].Reason}</span>
                  )}
                </div>

                {/* Quantity */}
                <div className="form-group">
                  <label htmlFor={`Quantity-${index}`}>
                    Quantity <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    name="Quantity"
                    id={`Quantity-${index}`}
                    className={`form-control ${errors[index]?.Quantity ? 'error' : ''}`}
                    value={entry.Quantity}
                    onChange={event => handleInput(index, event)}
                    min="0"
                    placeholder="0"
                  />
                  {errors[index]?.Quantity && (
                    <span className="error-message">{errors[index].Quantity}</span>
                  )}
                </div>

                {/* Unit Price */}
                <div className="form-group">
                  <label htmlFor={`UnitPrice-${index}`}>Unit Price</label>
                  <input
                    type="number"
                    name="UnitPrice"
                    id={`UnitPrice-${index}`}
                    className="form-control"
                    value={entry.UnitPrice}
                    readOnly
                    placeholder="Auto-filled"
                  />
                </div>

                {/* Loose Quantity */}
                {entry.UnitPerPackaging > 1 && (
                  <div className="form-group">
                    <label htmlFor={`LooseQuantity-${index}`}>Loose Quantity</label>
                    <input
                      type="number"
                      name="LooseQuantity"
                      id={`LooseQuantity-${index}`}
                      className="form-control"
                      value={entry.LooseQuantity}
                      onChange={event => handleInput(index, event)}
                      disabled={!entry.ProductID || !entry.VariationID}
                      min="0"
                      max={entry.UnitPerPackaging - 1}
                      placeholder="0"
                    />
                    <small className="help-text">
                      Max: {entry.UnitPerPackaging - 1} units
                    </small>
                  </div>
                )}
              </div>
            </div>
          ))}

          <div className="form-actions">
            <button
              type="button"
              className="add-entry-btn"
              onClick={addEntry}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Add Another Item
            </button>

            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner-small"></div>
                  Processing...
                </>
              ) : (
                'Submit Return Details'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddReturnOrderDetail;
