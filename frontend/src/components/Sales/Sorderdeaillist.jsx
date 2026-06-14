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
import { Link, useParams } from 'react-router-dom';
import './Sorderdeaillist.css';
import { get } from "../../service/apiClient";

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
    get(`/salesordersdetails/salesOrder/${saleorderid}/details`)
      .then(res => {
        // Ensure we always set an array, even if the response is unexpected
        const detailsData = res.data?.OrderDetails || res.data?.salesOrderDetails || res.data || [];
        console.log(detailsData,"detailsData");
        setDetails(Array.isArray(detailsData) ? detailsData : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching sale order details:', err);
        setDetails([]); // Set empty array on error
        setLoading(false);
      });
  };

  // Removed useEffect since we don't need separate API calls anymore
  // The product and variation data comes with the main response

  // Since the API already includes Product and ProductVariation data, we don't need separate API calls
  const fetchProductDetails = () => {
    // This function is no longer needed as data comes with the main response
  };

  const fetchVariationDetails = () => {
    // This function is no longer needed as data comes with the main response
  };

  // Helper function to get a more descriptive variation name
  const getVariationDisplayName = (variation) => {
    if (!variation) return 'N/A';
    
    const { Size, Color, SKU } = variation;
    let displayName = Size;
    
    // If Size is a number, we can map it to descriptive names
    if (Size === '1') displayName = 'Small';
    else if (Size === '2') displayName = 'Medium';
    else if (Size === '3') displayName = 'Large';
    else if (Size === '4') displayName = 'Extra Large';
    
    // Add color if available
    if (Color) {
      displayName += ` (${Color})`;
    }
    
    // Add SKU if available
    if (SKU) {
      displayName += ` - SKU: ${SKU}`;
    }
    
    return displayName;
  };

  return (
    <div className='sales-order-detail-container sales-order-detail-list'>
      <div className='container-fluid'>
        <div className='row justify-content-center'>
          <div className='col-12 col-lg-10 col-xl-8'>
            <div className='card sales-order-card'>
              <div className='card-header sales-order-header'>
                <div className='d-flex justify-content-between align-items-center'>
                  <h2 className='mb-0 sales-order-title'>
                    <i className='fas fa-list-alt me-2'></i>
                    Sales Order Details
                  </h2>
                  <div className='d-flex align-items-center gap-2 flex-wrap'>
                    <div className='badge order-badge fs-6 px-3 py-2'>
                      Order #{saleorderid}
                    </div>
                    <Link to={`/salesorderdetail/${saleorderid}`} className='btn btn-sm btn-primary'>Add Items</Link>
                    <Link to={`/salesorder/update/${saleorderid}`} className='btn btn-sm btn-success'>Payment</Link>
                    <Link to={`/salesorder/receipt/${saleorderid}`} className='btn btn-sm btn-outline-secondary'>Receipt</Link>
                  </div>
                </div>
              </div>
              
              <div className='card-body p-0'>
                {loading ? (
                  <div className='loading-container'>
                    <div className='text-center'>
                      <div className='spinner-border loading-spinner text-primary mb-3' role='status'>
                        <span className='visually-hidden'>Loading...</span>
                      </div>
                      <p className='text-muted mb-0'>Loading sales order details...</p>
                    </div>
                  </div>
                ) : (
                  <div className='table-responsive'>
                    <table className='table table-hover mb-0 sales-table'>
                      <thead>
                        <tr>
                          <th>
                            <i className='fas fa-hashtag me-1'></i>ID
                          </th>
                          <th>
                            <i className='fas fa-boxes me-1'></i>Batch
                          </th>
                          <th>
                            <i className='fas fa-box me-1'></i>Product Name
                          </th>
                          <th>
                            <i className='fas fa-tags me-1'></i>Variation
                          </th>
                          <th>
                            <i className='fas fa-sort-numeric-up me-1'></i>Quantity
                          </th>
                          <th>
                            <i className='fas fa-dollar-sign me-1'></i>Unit Price
                          </th>
                          <th>
                            <i className='fas fa-percentage me-1'></i>Discount
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {details && details.length > 0 ? (
                          details.map((detail, index) => (
                            <tr key={index}>
                              <td>
                                <span className='badge id-badge'>{detail.SalesOrderDetailID}</span>
                              </td>
                              <td>
                                {detail.BatchID ? (
                                  <span className='badge batch-badge'>{detail.BatchID.join(', ')}</span>
                                ) : (
                                  <span className='text-muted'>N/A</span>
                                )}
                              </td>
                              <td className='fw-semibold'>
                                {detail.Product?.ProductName || 'N/A'}
                              </td>
                              <td>
                                <span className='badge variation-badge' title={getVariationDisplayName(detail.ProductVariation)}>
                                  {getVariationDisplayName(detail.ProductVariation)}
                                </span>
                              </td>
                              <td>
                                <span className='badge quantity-badge'>{detail.Quantity}</span>
                              </td>
                              <td>
                                <span className='price-text text-success'>${detail.UnitPrice}</span>
                              </td>
                              <td>
                                {detail.Discount > 0 ? (
                                  <span className='discount-text text-danger'>-${detail.Discount}</span>
                                ) : (
                                  <span className='text-muted'>$0</span>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="7" className='empty-state'>
                              <div className='d-flex flex-column align-items-center'>
                                <i className='fas fa-inbox fa-3x empty-state-icon'></i>
                                <h5 className='empty-state-title'>No Details Found</h5>
                                <p className='empty-state-text'>No sales order details are available for this order.</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              
              {details && details.length > 0 && (
                <div className='card-footer sales-order-footer'>
                  <div className='row'>
                    <div className='col-md-6'>
                      <small className='footer-text'>
                        <i className='fas fa-info-circle me-1'></i>
                        Total Items: <strong>{details.length}</strong>
                      </small>
                    </div>
                    <div className='col-md-6 text-end'>
                      <small className='footer-text'>
                        <i className='fas fa-clock me-1'></i>
                        Last Updated: <strong>{new Date().toLocaleDateString()}</strong>
                      </small>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SaleOrderDetailList;
