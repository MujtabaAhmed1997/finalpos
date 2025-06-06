import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


function PriceRuleForm() {
  const [minQuantity, setMinQuantity] = useState('');
  const [maxQuantity, setMaxQuantity] = useState('');
  const [pricePerKg, setPricePerKg] = useState('');
  const [variations, setVariations] = useState([]); // State to store fetched variations
  const [selectedVariation, setSelectedVariation] = useState(''); // State for the selected variation ID
  const navigate = useNavigate();

  // Fetch variations from the API
  useEffect(() => {
    const fetchVariations = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/productVariations');
        setVariations(response.data); // Assuming response.data is an array of variations
      } catch (error) {
        console.error('Error fetching variations:', error);
        alert('Failed to fetch variations.');
      }
    };

    fetchVariations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const priceRuleData = {
      VariationID: selectedVariation, // The ID of the selected variation
      min_quantity: minQuantity,
      max_quantity: maxQuantity,
      price_per_kg: pricePerKg,
    };
    console.log(priceRuleData);

    try {
      await axios.post('http://localhost:3001/api/pricerule', priceRuleData);
      navigate('/pricerule/show');

    } catch (error) {
      console.error('Error adding price rule:', error);
      alert('Failed to add price rule.');
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <h2>Add Price Rule</h2>
          <Form onSubmit={handleSubmit}>
            {/* Variation Dropdown */}
            <Form.Group controlId="variationSelect">
              <Form.Label>Variation</Form.Label>
              <Form.Control
                as="select"
                value={selectedVariation}
                onChange={(e) => setSelectedVariation(e.target.value)}
                required
              >
                <option value="">Select Variation</option>
                {variations.map((variation) => (
                  <option key={variation.VariationID} value={variation.VariationID}>
                    {variation.SKU} {/* Show the name of the variation */}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            {/* Min Quantity */}
            <Form.Group controlId="minQuantity">
              <Form.Label>Min Quantity (kg)</Form.Label>
              <Form.Control
                type="number"
                value={minQuantity}
                onChange={(e) => setMinQuantity(e.target.value)}
                required
              />
            </Form.Group>

            {/* Max Quantity */}
            <Form.Group controlId="maxQuantity">
              <Form.Label>Max Quantity (kg)</Form.Label>
              <Form.Control
                type="number"
                value={maxQuantity}
                onChange={(e) => setMaxQuantity(e.target.value)}
                required
              />
            </Form.Group>

            {/* Price per kg */}
            <Form.Group controlId="pricePerKg">
              <Form.Label>Price per kg</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={pricePerKg}
                onChange={(e) => setPricePerKg(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Add Price Rule
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default PriceRuleForm;
