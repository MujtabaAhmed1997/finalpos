// import axios from 'axios';
// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';

// function SaleOrderDetailList() {
//   const { id: saleorderid } = useParams();
//   const [details, setDetails] = useState([]);
//   const [products, setProducts] = useState({});
//   const [variations, setVariations] = useState({});
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchsaleorderdetails();
//   }, [saleorderid]);

//   const fetchsaleorderdetails = () => {
//     setLoading(true);
//     axios.get(`http://localhost:3001/api/salesordersdetails/salesOrder/${saleorderid}/details`)
//       .then(res => {
//         setDetails(res.data);
//         setLoading(false);
//       })
//       .catch(err => {
//         console.error('Error fetching sale order details:', err);
//         setLoading(false);
//       });
//   };

//   useEffect(() => {
//     if (details.length > 0) {
//       fetchProductDetails();
//       fetchVariationDetails();
//     }
//   }, [details]);

//   const fetchProductDetails = () => {
//     const productIds = details.map(detail => detail.ProductID);
//     const uniqueProductIds = [...new Set(productIds)];
//     console.log(uniqueProductIds);
//     const productDetailsPromises = uniqueProductIds.map(productId =>
//       axios.get(`http://localhost:3001/api/products/${productId}`)
//     );

//     Promise.all(productDetailsPromises)
//       .then(responses => {
//         const productMap = {};
//         responses.forEach(response => {
//           productMap[response.data.ProductID] = response.data.ProductName;
//           console.log(productMap);
//         });
//         setProducts(productMap);
//       })
//       .catch(err => {
//         console.error('Error fetching product details:', err);
//       });
//   };

//   const fetchVariationDetails = () => {
//     const variationIds = details.map(detail => detail.VariationID);
//     const uniqueVariationIds = [...new Set(variationIds)];

//     const variationDetailsPromises = uniqueVariationIds.map(variationId =>
//       axios.get(`http://localhost:3001/api/productVariations/${variationId}`)
//     );

//     Promise.all(variationDetailsPromises)
//       .then(responses => {
//         const variationMap = {};
//         responses.forEach(response => {
//           variationMap[response.data.VariationID] = response.data.Size; // Assuming 'Size' is the name attribute
//         });
//         setVariations(variationMap);
//         console.log(typeof(variations));
//       })
//       .catch(err => {
//         console.error('Error fetching variation details:', err);
//       });
//   };

//   return (
//     <div className='d-flex vh-100 justify-content-center align-items-center' style={{ backgroundColor: '#1d2634' }}>
//       <div className='w-100 w-md-50 bg-white rounded p-3'>
//         <h2>Sales Order Details</h2>
//         {loading ? (
//           <div className='text-center text-muted'>Loading...</div>
//         ) : (
//           <table className='table'>
//             <thead>
//               <tr>
//                 <th>ID</th>
//                 <th>Product Name</th>
//                 <th>Variation</th>
//                 <th>Quantity</th>
//                 <th>Unit Price</th>
//                 <th>Discount</th>

//               </tr>
//             </thead>
//             <tbody>
//               {details.map((detail, index) => (
//                 <tr key={index}>
//                   <td>{detail.PurchaseOrderDetailID}</td>
//                   <td>{products[detail.ProductID] || 'Loading...'}</td>
//                   <td>{variations[detail.VariationID] || 'Loading...'}</td>
//                   <td>{detail.Quantity}</td>
//                   <td>{detail.UnitPrice}</td>
//                   <td>{detail.Discount}</td>

//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// }

// export default SaleOrderDetailList;


import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function SaleOrderDetailList() {
  const { id: saleorderid } = useParams();
  const [details, setDetails] = useState([]);
  const [products, setProducts] = useState({});
  const [variations, setVariations] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSaleOrderDetails();
  }, [saleorderid]);

  const fetchSaleOrderDetails = () => {
    setLoading(true);
    axios.get(`http://localhost:3001/api/salesordersdetails/salesOrder/${saleorderid}/details`)
      .then(res => {
        setDetails(res.data.salesOrderDetails); // Assuming res.data is an array
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching sale order details:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (details.length > 0) {
      fetchProductDetails();
      fetchVariationDetails();
    }
  }, [details]);

  const fetchProductDetails = () => {
    const productIds = details.map(detail => detail.ProductID);
    const uniqueProductIds = [...new Set(productIds)];

    const productDetailsPromises = uniqueProductIds.map(productId =>
      axios.get(`http://localhost:3001/api/products/${productId}`)
    );

    Promise.all(productDetailsPromises)
      .then(responses => {
        const productMap = {};
        responses.forEach(response => {
          productMap[response.data.ProductID] = response.data.ProductName;
        });
        setProducts(productMap);
      })
      .catch(err => {
        console.error('Error fetching product details:', err);
      });
  };

  const fetchVariationDetails = () => {
    const variationIds = details.map(detail => detail.VariationID);
    const uniqueVariationIds = [...new Set(variationIds)];

    const variationDetailsPromises = uniqueVariationIds.map(variationId =>
      axios.get(`http://localhost:3001/api/productVariations/${variationId}`)
    );

    Promise.all(variationDetailsPromises)
      .then(responses => {
        const variationMap = {};
        responses.forEach(response => {
          variationMap[response.data.VariationID] = response.data.Size; // Assuming 'Size' is the name attribute
        });
        setVariations(variationMap);
      })
      .catch(err => {
        console.error('Error fetching variation details:', err);
      });
  };

  return (
    <div className='d-flex vh-100 justify-content-center align-items-center' style={{ backgroundColor: '#1d2634' }}>
      <div className='w-100 w-md-50 bg-white rounded p-3'>
        <h2>Sales Order Details</h2>
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
                <th>Discount</th>
              </tr>
            </thead>
            <tbody>
              {details.map((detail, index) => (
                <tr key={index}>
                  <td>{detail.SalesOrderDetailID}</td>
                  <td>{products[detail.ProductID] || 'Loading...'}</td>
                  <td>{variations[detail.VariationID] || 'Loading...'}</td>
                  <td>{detail.Quantity}</td>
                  <td>{detail.UnitPrice}</td>
                  <td>{detail.Discount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default SaleOrderDetailList;
