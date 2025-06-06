// import axios from 'axios';
// import React, { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';

// function StockDetail() {
//   const { variationID } = useParams();
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     fetchStockDetails();
//   }, []);

//   const fetchStockDetails = () => {
//     axios.get(`http://localhost:3001/api/stocktransaction/stock/${variationID}`)
//       .then(res => setData(res.data))
//       .catch(err => console.log(err));
//   };

//   return (
//     <div className='d-flex vh-100 justify-content-center align-items-center' style={{ backgroundColor: '#1d2634' }}>
//       <div className='w-100 w-md-50 bg-white rounded p-3'>
//         <h2>Stock Detail</h2>
//         <table className='table'>
//           <thead>
//             <tr>
//               <th>Product Name</th>
//               <th>SKU</th>
//               <th>Quantity</th>
//               <th>Transaction Type</th>
//               <th>Transaction Date</th>

//             </tr>
//           </thead>
//           <tbody>
//             {data.map((transaction, index) => (
//               <tr key={index}>
//                 <td>{transaction.ProductVariation.Product.ProductName}</td>
//                 <td>{transaction.ProductVariation.SKU}</td>
//                 <td>{transaction.Quantity}</td>
//                 <td>{transaction.TransactionType}</td>
//                 <td>{new Date(transaction.TransactionDate).toLocaleDateString()}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         <Link to="/stocks" className="btn btn-primary">Back to Stock List</Link>
//       </div>
//     </div>
//   );
// }

// export default StockDetail;

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function StockDetail() {
  const { variationID } = useParams();
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchStockDetails();
  }, []);

  const fetchStockDetails = () => {
    axios.get(`http://localhost:3001/api/stocktransaction/stock/${variationID}`)
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  };

  const handleClick = (event) => {
    setCurrentPage(Number(event.target.id));
  };

  // Logic for displaying current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Logic for displaying page numbers
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(data.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className='d-flex vh-100 justify-content-center align-items-center' style={{ backgroundColor: '#1d2634' }}>
      <div className='w-100 w-md-50 bg-white rounded p-3'>
        <h2>Stock Detail</h2>
        <div style={{ maxHeight: '400px', overflowY: 'scroll' }}>
          <table className='table'>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>SKU</th>
                <th>Quantity</th>
                <th>Transaction Type</th>
                <th>Transaction Date</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((transaction, index) => (
                <tr key={index}>
                  <td>{transaction.ProductVariation.Product.ProductName}</td>
                  <td>{transaction.ProductVariation.SKU}</td>
                  <td>{transaction.Quantity}</td>
                  <td>{transaction.TransactionType}</td>
                  <td>{new Date(transaction.TransactionDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='pagination'>
          {pageNumbers.map(number => (
            <button
              key={number}
              id={number}
              onClick={handleClick}
              className={`btn ${currentPage === number ? 'btn-primary' : 'btn-secondary'} mx-1`}
            >
              {number}
            </button>
          ))}
        </div>
        <Link to="/stocks" className="btn btn-primary mt-3">Back to Stock List</Link>
      </div>
    </div>
  );
}

export default StockDetail;
