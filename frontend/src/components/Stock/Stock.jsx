import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function StockComponent() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchAggregatedStock();
  }, []);

  const fetchAggregatedStock = async() => {
    // axios.get('http://localhost:3001/api/stocktransaction/stock/aggregated')
      axios.get(`http://localhost:3001/api/stocktransaction/stk/all`)
.then(res =>{ setData(res.data)
console.log(res.data);}
)

.catch(err => console.log(err));
  };

  return (
    <div
      className='d-flex vh-100 justify-content-center align-items-center'
      style={{ backgroundColor: '#1d2634' }}
    >
      <div className='w-100 w-md-50 bg-white rounded p-3'>
        <h2>Stock</h2>
        <table className='table'>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>SKU</th>
              <th>Packed Stock </th>
              <th>Loose Stock</th>

              <th>Action</th>

            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.ProductName}</td>
                <td>{item.SKU}</td>
                <td>{item.ContainerStock}</td>
                <td>{item.LooseStock}</td>

                <td>
                  <Link to={`/stock/read/${item.VariationID}`} className='btn btn-sm btn-info'>Read</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StockComponent;

// import axios from 'axios';
// import React, { useEffect, useState } from 'react';

// function Stock() {
//   const [stockData, setStockData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     async function fetchAggregatedStock() {
//       try {
//         const response = await axios.get('http://localhost:3001/api/stocktransaction/stock/aggregater');
//         setStockData(response.data);
//       } catch (error) {
//         setError('Error fetching aggregated stock.');
//         console.error('Error fetching aggregated stock:', error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchAggregatedStock();
//   }, []);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;

//   return (
//     <div>
//       <h1>Stock Data</h1>
//       <table>
//         <thead>
//           <tr>
//             <th>Variation ID</th>
//             <th>SKU</th>
//             <th>Product Name</th>
//             <th>Container Quantity</th>
//             <th>Sack Quantity</th>
//             <th>Loose L Quantity</th>
//             <th>Loose Kg Quantity</th>
//           </tr>
//         </thead>
//         <tbody>
//           {stockData.map((item) => (
//             <tr key={item.VariationID}>
//               <td>{item.VariationID}</td>
//               <td>{item.SKU}</td>
//               <td>{item.ProductName}</td>
//               <td>{item.TotalContainerQuantity > 0 ? item.TotalContainerQuantity : '-'}</td>
//               <td>{item.TotalSackQuantity > 0 ? item.TotalSackQuantity : '-'}</td>
//               <td>{item.TotalLooseLQuantity > 0 ? item.TotalLooseLQuantity : '-'}</td>
//               <td>{item.TotalLooseKgQuantity > 0 ? item.TotalLooseKgQuantity : '-'}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default Stock;
