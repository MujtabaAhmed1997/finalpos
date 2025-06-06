// // PriceRuleList.jsx
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Table, Button } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';

// const PriceRuleList = () => {
//   const [priceRules, setPriceRules] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchPriceRules = async () => {
//       try {
//         const response = await axios.get('http://localhost:3001/api/pricerule');
//         // Assuming your API returns an array of price rules with each having a 'variation' object
//         setPriceRules(response.data);
//       } catch (err) {
//         setError('Failed to fetch price rules');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPriceRules();
//   }, []);

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this price rule?')) {
//       try {
//         await axios.delete(`http://localhost:3001/api/pricerule/${id}`);
//         setPriceRules(priceRules.filter((rule) => rule.id !== id));
//       } catch (err) {
//         setError('Failed to delete price rule');
//       }
//     }
//   };

//   const handleEdit = (id) => {
//     navigate(`/pricerule/edit/${id}`);
//   };

//   // Add Price Rule Handler
//   const handleAdd = () => {
//     navigate('/pricerule/add');
//   };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div>
//       <h2>Price Rules</h2>
//       <Button variant="success" onClick={handleAdd} style={{ marginBottom: '10px' }}>
//         Add Price Rule
//       </Button>
//       <Table striped bordered hover>
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Variation SKU</th>
//             <th>Min Quantity (kg)</th>
//             <th>Max Quantity (kg)</th>
//             <th>Price per kg</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {priceRules.map((rule) => (
//             <tr key={rule.id}>
//               <td>{rule.id}</td>
//               <td>{rule.ProductVariation.SKU}</td> {/* Displaying variation SKU instead of VariationID */}
//               <td>{rule.min_quantity}</td>
//               <td>{rule.max_quantity}</td>
//               <td>{rule.price_per_kg}</td>
//               <td>
//                 <Button variant="primary" onClick={() => handleEdit(rule.id)}>Edit</Button>{' '}
//                 <Button variant="danger" onClick={() => handleDelete(rule.id)}>Delete</Button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>
//     </div>
//   );
// };

// export default PriceRuleList;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Pagination, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const PriceRuleList = () => {
  const [priceRules, setPriceRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10); // Default items per page
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPriceRules = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/pricerule?page=${currentPage}&limit=${limit}`
        );
        setPriceRules(response.data.data);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        setError("Failed to fetch price rules");
      } finally {
        setLoading(false);
      }
    };

    fetchPriceRules();
  }, [currentPage, limit]); // Refetch data when page or limit changes

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this price rule?")) {
      try {
        await axios.delete(`http://localhost:3001/api/pricerule/${id}`);
        setPriceRules(priceRules.filter((rule) => rule.id !== id));
      } catch (err) {
        setError("Failed to delete price rule");
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/pricerule/edit/${id}`);
  };

  const handleAdd = () => {
    navigate("/pricerule/add");
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleLimitChange = (e) => {
    setLimit(parseInt(e.target.value));
    setCurrentPage(1); // Reset to first page when limit changes
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Price Rules</h2>
      <Button
        variant="success"
        onClick={handleAdd}
        style={{ marginBottom: "10px" }}
      >
        Add Price Rule
      </Button>

      {/* Dropdown to change items per page */}
      <Form.Group controlId="itemsPerPage">
        <Form.Label>Items per page:</Form.Label>
        <Form.Control
          as="select"
          value={limit}
          onChange={handleLimitChange}
          style={{ width: "120px", marginBottom: "10px" }}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </Form.Control>
      </Form.Group>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Variation SKU</th>
            <th>Min Quantity (kg)</th>
            <th>Max Quantity (kg)</th>
            <th>Price per kg</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {priceRules.map((rule) => (
            <tr key={rule.id}>
              <td>{rule.id}</td>
              <td>{rule.ProductVariation?.SKU || "N/A"}</td>{" "}
              {/* Handle potential null values */}
              <td>{rule.min_quantity}</td>
              <td>{rule.max_quantity}</td>
              <td>{rule.price_per_kg}</td>
              <td>
                <Button variant="primary" onClick={() => handleEdit(rule.id)}>
                  Edit
                </Button>{" "}
                <Button variant="danger" onClick={() => handleDelete(rule.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination Controls */}
      <Pagination>
        <Pagination.Prev
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        />
        {[...Array(totalPages)].map((_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        />
      </Pagination>
    </div>
  );
};

export default PriceRuleList;
