import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

function PriceHistory() {
  const { id } = useParams();
  const [priceHistory, setPriceHistory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchPriceHistory(id);
    }
  }, [id]);

  const fetchPriceHistory = async (variationId) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/pricehistory/${variationId}`);
      setPriceHistory(response.data);
    } catch (error) {
      setError(error);
      console.error('Error fetching price history:', error);
    }
  };

  return (
    <div className='d-flex vh-100 justify-content-center align-items-center' style={{ backgroundColor: '#1d2634' }}>
      <div className='w-100 w-md-50 bg-white rounded p-3'>
        <h2>Price History</h2>
        {error && <p>Error fetching price history: {error.message}</p>}
        <table className='table'>
          <thead>
            <tr>
              <th>ID</th>
              <th>SKU</th>
              <th>Price Type</th>
              <th>Previous Price</th>
              <th>New Price</th>
              <th>Change Date</th>
            </tr>
          </thead>
          <tbody>
            {priceHistory.map((history, index) => (
              <tr key={index}>
                <td>{history.PriceHistoryID}</td>
                <td>{history.ProductVariation?.SKU}</td> {/* Display SKU */}
                <td>{history.PriceType}</td>
                <td>{history.PreviousPrice}</td>
                <td>{history.NewPrice}</td>
                <td>{new Date(history.ChangeDate).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          <Link to='/products' className='btn btn-primary'>Back to Products</Link>
        </div>
      </div>
    </div>
  );
}

export default PriceHistory;
