import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlusCircle, FaBox, FaWeightHanging, FaDollarSign, FaTrash, FaList } from 'react-icons/fa';
import { get, post } from "../../service/apiClient";

function PriceRuleForm() {
  const [selectedVariation, setSelectedVariation] = useState('');
  const [priceRanges, setPriceRanges] = useState([
    {
      min_quantity: '',
      max_quantity: '',
      price_per_kg: ''
    }
  ]);
  const [variations, setVariations] = useState([]);
  const [errors, setErrors] = useState({});
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch variations from the API
  useEffect(() => {
    const fetchVariations = async () => {
      try {
        const response = await get('/productVariations');
        setVariations(response.data);
      } catch (error) {
        console.error('Error fetching variations:', error);
        setErrors({ apiError: 'Failed to fetch variations.' });
      }
    };

    fetchVariations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    if (!selectedVariation) {
      setErrors({ apiError: 'Please select a product variation.' });
      setIsSubmitting(false);
      return;
    }

    // Filter out empty ranges
    const validRanges = priceRanges.filter(range => 
      range.min_quantity && range.max_quantity && range.price_per_kg
    );

    if (validRanges.length === 0) {
      setErrors({ apiError: 'Please add at least one valid price range.' });
      setIsSubmitting(false);
      return;
    }

    try {
      // Submit each price range for the selected variation
      const promises = validRanges.map(range => 
        post('/pricerule', {
          VariationID: selectedVariation,
          min_quantity: range.min_quantity,
          max_quantity: range.max_quantity,
          price_per_kg: range.price_per_kg,
        })
      );

      await Promise.all(promises);
      navigate('/pricerule/show');
    } catch (error) {
      console.error('Error adding price rules:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setErrors({ apiError: error.response.data.message });
      } else {
        setErrors({ apiError: 'Failed to add price rules.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRangeChange = (index, field, value) => {
    const updatedRanges = [...priceRanges];
    updatedRanges[index][field] = value;
    setPriceRanges(updatedRanges);
  };

  const addNewRange = () => {
    setPriceRanges([...priceRanges, {
      min_quantity: '',
      max_quantity: '',
      price_per_kg: ''
    }]);
  };

  const removeRange = (index) => {
    if (priceRanges.length > 1) {
      const updatedRanges = priceRanges.filter((_, i) => i !== index);
      setPriceRanges(updatedRanges);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        backgroundColor: "#263043",
        minHeight: "100vh",
        padding: windowWidth < 768 ? "10px" : "20px",
      }}
    >
      <div
        className="rounded-4 shadow-lg p-4 p-md-5"
        style={{
          minWidth: windowWidth < 480 ? "280px" : "320px",
          maxWidth: "800px",
          width: "100%",
          border: "1px solid #404040",
          background: "rgba(255,255,255,0.95)",
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
        }}
      >
        <div className="text-center mb-4">
          <FaPlusCircle 
            size={windowWidth < 768 ? 32 : 40} 
            color="#263043" 
          />
          <h3 
            className="fw-bold mt-2" 
            style={{ 
              color: "#263043",
              fontSize: windowWidth < 768 ? "1.5rem" : "1.75rem"
            }}
          >
            Add Price Ranges
          </h3>
          <p 
            className="text-muted" 
            style={{ 
              fontSize: windowWidth < 768 ? "14px" : "15px" 
            }}
          >
            Create multiple price ranges for a single product variation based on quantity tiers.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {errors.apiError && (
            <div className="alert alert-danger" role="alert">
              {errors.apiError}
            </div>
          )}

          {/* Product Variation Selection */}
          <div className="mb-4">
            <label htmlFor="variationSelect" className="form-label fw-semibold" style={{ color: "#263043" }}>
              <FaBox className="me-2" />
              Product Variation
            </label>
            <select
              className="form-control rounded-3"
              value={selectedVariation}
              onChange={(e) => setSelectedVariation(e.target.value)}
              required
              style={{
                background: "#f8f9fa",
                border: "1px solid #dee2e6",
                transition: "all 0.2s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                fontSize: windowWidth < 768 ? "14px" : "16px",
                padding: windowWidth < 768 ? "8px 12px" : "12px 16px",
              }}
              onFocus={e => {
                e.target.style.borderColor = "#263043";
                e.target.style.boxShadow = "0 0 0 0.2rem rgba(38, 48, 67, 0.25)";
              }}
              onBlur={e => {
                e.target.style.borderColor = "#dee2e6";
                e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
              }}
            >
              <option value="">Select Variation</option>
              {variations.map((variation) => (
                <option key={variation.VariationID} value={variation.VariationID}>
                  {variation.SKU}
                </option>
              ))}
            </select>
          </div>

          {/* Price Ranges Section */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="mb-0 fw-bold" style={{ color: "#263043" }}>
                <FaList className="me-2" />
                Price Ranges
              </h6>
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={addNewRange}
                style={{
                  borderColor: "#263043",
                  color: "#263043",
                  fontSize: "12px",
                  padding: "4px 8px"
                }}
              >
                <FaPlusCircle className="me-1" />
                Add Range
              </button>
            </div>

            {priceRanges.map((range, index) => (
              <div key={index} className="mb-4 p-3 border rounded-3" style={{ borderColor: "#dee2e6", backgroundColor: "#f8f9fa" }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0 fw-bold" style={{ color: "#263043" }}>
                    Price Range #{index + 1}
                  </h6>
                  {priceRanges.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => removeRange(index)}
                      style={{
                        borderColor: "#dc3545",
                        color: "#dc3545",
                        fontSize: "12px",
                        padding: "4px 8px"
                      }}
                    >
                      <FaTrash className="me-1" />
                      Remove
                    </button>
                  )}
                </div>

                <div className="row">
                  <div className="col-12 col-md-6 mb-3">
                    <label htmlFor={`minQuantity-${index}`} className="form-label fw-semibold" style={{ color: "#263043" }}>
                      <FaWeightHanging className="me-2" />
                      Min Quantity (kg)
                    </label>
                    <input
                      type="number"
                      className="form-control rounded-3"
                      value={range.min_quantity}
                      onChange={(e) => handleRangeChange(index, 'min_quantity', e.target.value)}
                      required
                      placeholder="Enter minimum quantity"
                      style={{
                        background: "white",
                        border: "1px solid #dee2e6",
                        transition: "all 0.2s",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        fontSize: windowWidth < 768 ? "14px" : "16px",
                        padding: windowWidth < 768 ? "8px 12px" : "12px 16px",
                      }}
                      onFocus={e => {
                        e.target.style.borderColor = "#263043";
                        e.target.style.boxShadow = "0 0 0 0.2rem rgba(38, 48, 67, 0.25)";
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = "#dee2e6";
                        e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
                      }}
                    />
                  </div>

                  <div className="col-12 col-md-6 mb-3">
                    <label htmlFor={`maxQuantity-${index}`} className="form-label fw-semibold" style={{ color: "#263043" }}>
                      <FaWeightHanging className="me-2" />
                      Max Quantity (kg)
                    </label>
                    <input
                      type="number"
                      className="form-control rounded-3"
                      value={range.max_quantity}
                      onChange={(e) => handleRangeChange(index, 'max_quantity', e.target.value)}
                      required
                      placeholder="Enter maximum quantity"
                      style={{
                        background: "white",
                        border: "1px solid #dee2e6",
                        transition: "all 0.2s",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        fontSize: windowWidth < 768 ? "14px" : "16px",
                        padding: windowWidth < 768 ? "8px 12px" : "12px 16px",
                      }}
                      onFocus={e => {
                        e.target.style.borderColor = "#263043";
                        e.target.style.boxShadow = "0 0 0 0.2rem rgba(38, 48, 67, 0.25)";
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = "#dee2e6";
                        e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
                      }}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor={`pricePerKg-${index}`} className="form-label fw-semibold" style={{ color: "#263043" }}>
                    <FaDollarSign className="me-2" />
                    Price per kg
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control rounded-3"
                    value={range.price_per_kg}
                    onChange={(e) => handleRangeChange(index, 'price_per_kg', e.target.value)}
                    required
                    placeholder="Enter price per kg"
                    style={{
                      background: "white",
                      border: "1px solid #dee2e6",
                      transition: "all 0.2s",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      fontSize: windowWidth < 768 ? "14px" : "16px",
                      padding: windowWidth < 768 ? "8px 12px" : "12px 16px",
                    }}
                    onFocus={e => {
                      e.target.style.borderColor = "#263043";
                      e.target.style.boxShadow = "0 0 0 0.2rem rgba(38, 48, 67, 0.25)";
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = "#dee2e6";
                      e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="btn w-100 rounded-3 fw-bold"
            disabled={isSubmitting}
            style={{
              background: isSubmitting ? "#6c757d" : "#263043",
              border: "none",
              fontSize: windowWidth < 768 ? "16px" : "18px",
              letterSpacing: 1,
              boxShadow: "0 4px 12px rgba(38, 48, 67, 0.3)",
              transition: "all 0.3s",
              color: "white",
              padding: windowWidth < 768 ? "10px 16px" : "12px 20px",
            }}
            onMouseOver={e => {
              if (!isSubmitting) {
                e.target.style.background = "#1a2332";
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 20px rgba(38, 48, 67, 0.4)";
              }
            }}
            onMouseOut={e => {
              if (!isSubmitting) {
                e.target.style.background = "#263043";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 12px rgba(38, 48, 67, 0.3)";
              }
            }}
          >
            <FaPlusCircle className="me-2 mb-1" />
            {isSubmitting 
              ? 'Adding...' 
              : `Add ${priceRanges.length} Price Range${priceRanges.length > 1 ? 's' : ''}`
            }
          </button>
        </form>
      </div>
    </div>
  );
}

export default PriceRuleForm;
