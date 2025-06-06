import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function PurchaseOrderDetailList() {
  const { id: purchaseOrderId } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPurchaseOrderDetails();
  }, [purchaseOrderId]);

  const fetchPurchaseOrderDetails = () => {
    setLoading(true);
    axios.get(`http://localhost:3001/api/purchaseordersdetails/purchaseOrder/${purchaseOrderId}/details`)
      .then(res => {
        setDetails(res.data.OrderDetails);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching purchase order details:', err);
        setLoading(false);
      });
  };

  const handleBackClick = () => {
    navigate(-1); // This will navigate to the previous page
  };

  return (
    <div className='d-flex vh-100 justify-content-center align-items-center' style={{ backgroundColor: '#1d2634' }}>
      <div className='w-100 w-md-50 bg-white rounded p-3'>
        <h2>Purchase Order Details</h2>
        <button className="btn btn-secondary mb-3" onClick={handleBackClick}>
          Back
        </button>
        {loading ? (
          <div className='text-center text-muted'>Loading...</div>
        ) : (
          <table className='table'>
            <thead>
              <tr>
                <th>ID</th>
                <th>Product Name</th>
                <th>Variation</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {details.map((detail, index) => (
                <tr key={index}>
                  <td>{detail.PurchaseOrderDetailID}</td>
                  <td>{detail.Product?.ProductName || 'N/A'}</td>
                  <td>{detail.ProductVariation?.Size || 'N/A'}</td>
                  <td>{detail.Quantity}</td>
                  <td>{detail.UnitPrice}</td>
                  <td>{detail.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default PurchaseOrderDetailList;
