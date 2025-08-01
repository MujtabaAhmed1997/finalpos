import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEdit, FaBox, FaWeightHanging, FaDollarSign } from 'react-icons/fa';

function EditPriceRuleForm() {
  const { id: priceRuleId } = useParams();
  const [minQuantity, setMinQuantity] = useState('');
  const [maxQuantity, setMaxQuantity] = useState('');
  const [pricePerKg, setPricePerKg] = useState('');
  const [variations, setVariations] = useState([]);
  const [selectedVariation, setSelectedVariation] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
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
        const response = await axios.get('http://localhost:3001/api/productVariations');
        setVariations(response.data);
      } catch (error) {
        console.error('Error fetching variations:', error);
        setErrors({ apiError: 'Failed to fetch variations.' });
      }
    };

    fetchVariations();
  }, []);

  // Fetch existing price rule data for editing
  useEffect(() => {
    const fetchPriceRule = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/pricerule/${priceRuleId}`);
        const { VariationID, min_quantity, max_quantity, price_per_kg } = response.data;

        setSelectedVariation(VariationID);
        setMinQuantity(min_quantity);
        setMaxQuantity(max_quantity);
        setPricePerKg(price_per_kg);
      } catch (error) {
        console.error('Error fetching price rule:', error);
        setServerError('Failed to load price rule data.');
      }
    };

    fetchPriceRule();
  }, [priceRuleId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setServerError('');

    const priceRuleData = {
      VariationID: selectedVariation,
      min_quantity: minQuantity,
      max_quantity: maxQuantity,
      price_per_kg: pricePerKg,
    };

    try {
      await axios.put(`http://localhost:3001/api/pricerule/${priceRuleId}`, priceRuleData);
      navigate('/pricerule/show');
    } catch (error) {
      console.error('Error updating price rule:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setServerError(error.response.data.message);
      } else {
        setServerError('Failed to update price rule.');
      }
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
          maxWidth: "600px",
          width: "100%",
          border: "1px solid #404040",
          background: "rgba(255,255,255,0.95)",
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
        }}
      >
        <div className="text-center mb-4">
          <FaEdit 
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
            Update Price Rule
          </h3>
          <p 
            className="text-muted" 
            style={{ 
              fontSize: windowWidth < 768 ? "14px" : "15px" 
            }}
          >
            Modify the pricing rule information below.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {serverError && (
            <div className="alert alert-danger" role="alert">
              {serverError}
            </div>
          )}

          {errors.apiError && (
            <div className="alert alert-danger" role="alert">
              {errors.apiError}
            </div>
          )}

          <div className="mb-3">
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

          <div className="row">
            <div className="col-12 col-md-6 mb-3">
              <label htmlFor="minQuantity" className="form-label fw-semibold" style={{ color: "#263043" }}>
                <FaWeightHanging className="me-2" />
                Min Quantity (kg)
              </label>
              <input
                type="number"
                className="form-control rounded-3"
                value={minQuantity}
                onChange={(e) => setMinQuantity(e.target.value)}
                required
                placeholder="Enter minimum quantity"
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
              />
            </div>

            <div className="col-12 col-md-6 mb-3">
              <label htmlFor="maxQuantity" className="form-label fw-semibold" style={{ color: "#263043" }}>
                <FaWeightHanging className="me-2" />
                Max Quantity (kg)
              </label>
              <input
                type="number"
                className="form-control rounded-3"
                value={maxQuantity}
                onChange={(e) => setMaxQuantity(e.target.value)}
                required
                placeholder="Enter maximum quantity"
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
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="pricePerKg" className="form-label fw-semibold" style={{ color: "#263043" }}>
              <FaDollarSign className="me-2" />
              Price per kg
            </label>
            <input
              type="number"
              step="0.01"
              className="form-control rounded-3"
              value={pricePerKg}
              onChange={(e) => setPricePerKg(e.target.value)}
              required
              placeholder="Enter price per kg"
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
            />
          </div>

          <button
            type="submit"
            className="btn w-100 rounded-3 fw-bold"
            style={{
              background: "#263043",
              border: "none",
              fontSize: windowWidth < 768 ? "16px" : "18px",
              letterSpacing: 1,
              boxShadow: "0 4px 12px rgba(38, 48, 67, 0.3)",
              transition: "all 0.3s",
              color: "white",
              padding: windowWidth < 768 ? "10px 16px" : "12px 20px",
            }}
            onMouseOver={e => {
              e.target.style.background = "#1a2332";
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 20px rgba(38, 48, 67, 0.4)";
            }}
            onMouseOut={e => {
              e.target.style.background = "#263043";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 12px rgba(38, 48, 67, 0.3)";
            }}
          >
            <FaEdit className="me-2 mb-1" />
            Update Price Rule
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditPriceRuleForm;
