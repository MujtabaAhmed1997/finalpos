// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import axios from 'axios';
// import { validatePurchaseOrderDetail } from '../../controllers/POrderdetailsvalidator'; // Adjust the import path as needed

// function AddPurchaseOrderDetail() {
//   const { id: PurchaseOrderID } = useParams(); // Get PurchaseOrderID from URL
//   const [entries, setEntries] = useState([{
//     PurchaseOrderID: PurchaseOrderID || "", // Pre-fill PurchaseOrderID
//     ProductID: "",
//     VariationID: "",
//     Quantity: "",
//     UnitPrice: ""
//   }]);

//   const [products, setProducts] = useState([]);
//   const [variations, setVariations] = useState({});
//   const [errors, setErrors] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await axios.get('http://localhost:3001/api/products');
//         setProducts(response.data);
//       } catch (error) {
//         console.error('Error fetching products:', error);
//       }
//     };

//     fetchProducts();
//   }, []);

//   const handleInput = (index, event) => {
//     const { name, value } = event.target;
//     const newEntries = [...entries];
//     newEntries[index][name] = value;
//     setEntries(newEntries);

//     if (name === 'ProductID') {
//       fetchVariations(value, index);
//     }
//   };

//   const fetchVariations = async (productId, index) => {
//     try {
//       const response = await axios.get(`http://localhost:3001/api/products/${productId}/variations`);
//       setVariations(prev => ({ ...prev, [index]: response.data }));
//     } catch (error) {
//       console.error('Error fetching variations:', error);
//     }
//   };

//   const addEntry = () => {
//     setEntries([...entries, {
//       PurchaseOrderID: PurchaseOrderID || "", // Pre-fill PurchaseOrderID
//       ProductID: "",
//       VariationID: "",
//       Quantity: "",
//       UnitPrice: ""
//     }]);
//   };

//   const removeEntry = (index) => {
//     setEntries(entries.filter((_, i) => i !== index));
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     const validationErrors = entries.map(entry => validatePurchaseOrderDetail(entry));
//     const hasErrors = validationErrors.some(error => Object.keys(error).length > 0);
//     setErrors(validationErrors);

//     if (!hasErrors) {
//       setIsSubmitting(true);
//       console.log('Submitting entries:', entries); // Log the payload
//       axios.post('http://localhost:3001/api/purchaseordersdetails', { entries })
//         .then(res => {
//           navigate(`/purchaseorder/update/${PurchaseOrderID}`); // Navigate to purchaseOrderDetails page after successful submission
//           console.log(res);
//         })
//         .catch(err => {
//           console.error('Error adding purchase order details:', err);
//         })
//         .finally(() => {
//           setIsSubmitting(false);
//         });
//     }
//   };

//   return (
//     <div className='d-flex vh-100 justify-content-center align-items-center' style={{ backgroundColor: '#263043' }}>
//       <div className='w-75 bg-white rounded p-3'>
//         <form onSubmit={handleSubmit}>
//           {entries.map((entry, index) => (
//             <div className='row' key={index}>
//               <div className='col-md-2 mb-3'>
//                 <label htmlFor={`PurchaseOrderID-${index}`}><strong>Purchase Order ID</strong></label>
//                 <input
//                   onChange={event => handleInput(index, event)}
//                   type='number'
//                   placeholder='Enter Purchase Order ID'
//                   className='form-control rounded-0'
//                   name='PurchaseOrderID'
//                   value={entry.PurchaseOrderID}
//                   id={`PurchaseOrderID-${index}`}
//                   readOnly
//                 />
//                 {errors[index] && errors[index].PurchaseOrderID && <span className='text-danger'>{errors[index].PurchaseOrderID}</span>}
//               </div>
//               <div className='col-md-2 mb-3'>
//                 <label htmlFor={`ProductID-${index}`}><strong>Product</strong></label>
//                 <select
//                   onChange={event => handleInput(index, event)}
//                   className='form-control rounded-0'
//                   name='ProductID'
//                   value={entry.ProductID}
//                   id={`ProductID-${index}`}
//                 >
//                   <option value="">Select a product</option>
//                   {products.map(product => (
//                     <option key={product.ProductID} value={product.ProductID}>
//                       {product.ProductName}
//                     </option>
//                   ))}
//                 </select>
//                 {errors[index] && errors[index].ProductID && <span className='text-danger'>{errors[index].ProductID}</span>}
//               </div>
//               <div className='col-md-2 mb-3'>
//                 <label htmlFor={`VariationID-${index}`}><strong>Variation</strong></label>
//                 <select
//                   onChange={event => handleInput(index, event)}
//                   className='form-control rounded-0'
//                   name='VariationID'
//                   value={entry.VariationID}
//                   id={`VariationID-${index}`}
//                   disabled={!entry.ProductID} // Disable dropdown if no product is selected
//                 >
//                   <option value="">Select a variation</option>
//                   {variations[index] && variations[index].map(variation => (
//                     <option key={variation.VariationID} value={variation.VariationID}>
//                       {variation.Size}
//                     </option>
//                   ))}
//                 </select>
//                 {errors[index] && errors[index].VariationID && <span className='text-danger'>{errors[index].VariationID}</span>}
//               </div>
//               <div className='col-md-2 mb-3'>
//                 <label htmlFor={`Quantity-${index}`}><strong>Quantity</strong></label>
//                 <input
//                   onChange={event => handleInput(index, event)}
//                   type='number'
//                   placeholder='Enter Quantity'
//                   className='form-control rounded-0'
//                   name='Quantity'
//                   value={entry.Quantity}
//                   id={`Quantity-${index}`}
//                 />
//                 {errors[index] && errors[index].Quantity && <span className='text-danger'>{errors[index].Quantity}</span>}
//               </div>
//               <div className='col-md-2 mb-3'>
//                 <label htmlFor={`UnitPrice-${index}`}><strong>Unit Price</strong></label>
//                 <input
//                   onChange={event => handleInput(index, event)}
//                   type='number'
//                   placeholder='Enter Unit Price'
//                   className='form-control rounded-0'
//                   name='UnitPrice'
//                   value={entry.UnitPrice}
//                   id={`UnitPrice-${index}`}
//                 />
//                 {errors[index] && errors[index].UnitPrice && <span className='text-danger'>{errors[index].UnitPrice}</span>}
//               </div>
//               <div className='col-md-2 mb-3 d-flex align-items-end'>
//                 <button type='button' className='btn btn-danger w-100 rounded-0' onClick={() => removeEntry(index)}>
//                   Remove
//                 </button>
//               </div>
//             </div>
//           ))}
//           <div className='row'>
//             <div className='col-md-12 mb-3'> {/* Added margin-bottom to create space */}
//               <button type='button' className='btn btn-primary w-100 rounded-0' onClick={addEntry}>
//                 Add Entry
//               </button>
//             </div>
//           </div>
//           <div className='row'>
//             <div className='col-md-12'>
//               <button type='submit' className='btn btn-success w-100 rounded-0' disabled={isSubmitting}>
//                 {isSubmitting ? 'Submitting...' : 'Submit'}
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default AddPurchaseOrderDetail;
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import axios from 'axios';
// import { validatePurchaseOrderDetail } from '../../controllers/POrderdetailsvalidator'; // Adjust the import path as needed

// function AddPurchaseOrderDetail() {
//   const { id: PurchaseOrderID } = useParams(); // Get PurchaseOrderID from URL
//   const [entries, setEntries] = useState([{
//     PurchaseOrderID: PurchaseOrderID || "", // Pre-fill PurchaseOrderID
//     ProductID: "",
//     VariationID: "",
//     Quantity: "",
//     UnitPrice: ""
//   }]);

//   const [products, setProducts] = useState([]);
//   const [variations, setVariations] = useState({});
//   const [errors, setErrors] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await axios.get('http://localhost:3001/api/products');
//         setProducts(response.data);
//       } catch (error) {
//         console.error('Error fetching products:', error);
//       }
//     };

//     fetchProducts();
//   }, []);

//   const handleInput = (index, event) => {
//     const { name, value } = event.target;
//     const newEntries = [...entries];
//     newEntries[index][name] = value;
//     setEntries(newEntries);

//     if (name === 'ProductID') {
//       fetchVariations(value, index);
//     }else if(name==="VariationID"){
//       fetchVariationDetails(value,index)
//     }
//   };

//   const fetchVariations = async (productId, index) => {
//     try {
//       const response = await axios.get(`http://localhost:3001/api/products/${productId}/variations`);
//       setVariations(prev => ({ ...prev, [index]: response.data }));
//     } catch (error) {
//       console.error('Error fetching variations:', error);
//     }
//   };

//   const fetchVariationDetails = async (variationId, index) => {
//     try {
//       const response = await axios.get(`http://localhost:3001/api/variations/${variationId}`);
//       const variation = response.data;
//       setEntries(prevEntries => {
//         const newEntries = [...prevEntries];
//         newEntries[index].UnitPrice = variation.Price; // Assuming 'price' is the attribute name
//         return newEntries;
//       });
//     } catch (error) {
//       console.error('Error fetching variation details:', error);
//     }
//   };

//   const addEntry = () => {
//     setEntries([...entries, {
//       PurchaseOrderID: PurchaseOrderID || "", // Pre-fill PurchaseOrderID
//       ProductID: "",
//       VariationID: "",
//       Quantity: "",
//       UnitPrice: ""
//     }]);
//   };

//   const removeEntry = (index) => {
//     setEntries(entries.filter((_, i) => i !== index));
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     const validationErrors = entries.map(entry => validatePurchaseOrderDetail(entry));
//     const hasErrors = validationErrors.some(error => Object.keys(error).length > 0);
//     setErrors(validationErrors);

//     if (!hasErrors) {
//       setIsSubmitting(true);
//       console.log('Submitting entries:', entries); // Log the payload

//       axios.post('http://localhost:3001/api/purchaseordersdetails', { entries })
//         .then(async res => {
//           // Create stock transactions
//           const stockTransactionPromises = entries.map(entry =>
//             axios.post('http://localhost:3001/api/stocktransaction', {
//               VariationID: entry.VariationID,
//               TransactionDate: new Date(),
//               Quantity: entry.Quantity,
//               TransactionType: 'IN'
//             })
//           );
//           await Promise.all(stockTransactionPromises);

//           navigate(`/purchaseorder/update/${PurchaseOrderID}`); // Navigate to purchaseOrderDetails page after successful submission
//           console.log(res);
//         })
//         .catch(err => {
//           console.error('Error adding purchase order details:', err);
//         })
//         .finally(() => {
//           setIsSubmitting(false);
//         });
//     }
//   };

//   return (
//     <div className='d-flex vh-100 justify-content-center align-items-center' style={{ backgroundColor: '#263043' }}>
//       <div className='w-75 bg-white rounded p-3'>
//         <form onSubmit={handleSubmit}>
//           {entries.map((entry, index) => (
//             <div className='row' key={index}>
//               <div className='col-md-2 mb-3'>
//                 <label htmlFor={`PurchaseOrderID-${index}`}><strong>Purchase Order ID</strong></label>
//                 <input
//                   onChange={event => handleInput(index, event)}
//                   type='number'
//                   placeholder='Enter Purchase Order ID'
//                   className='form-control rounded-0'
//                   name='PurchaseOrderID'
//                   value={entry.PurchaseOrderID}
//                   id={`PurchaseOrderID-${index}`}
//                   readOnly
//                 />
//                 {errors[index] && errors[index].PurchaseOrderID && <span className='text-danger'>{errors[index].PurchaseOrderID}</span>}
//               </div>
//               <div className='col-md-2 mb-3'>
//                 <label htmlFor={`ProductID-${index}`}><strong>Product</strong></label>
//                 <select
//                   onChange={event => handleInput(index, event)}
//                   className='form-control rounded-0'
//                   name='ProductID'
//                   value={entry.ProductID}
//                   id={`ProductID-${index}`}
//                 >
//                   <option value="">Select a product</option>
//                   {products.map(product => (
//                     <option key={product.ProductID} value={product.ProductID}>
//                       {product.ProductName}
//                     </option>
//                   ))}
//                 </select>
//                 {errors[index] && errors[index].ProductID && <span className='text-danger'>{errors[index].ProductID}</span>}
//               </div>
//               <div className='col-md-2 mb-3'>
//                 <label htmlFor={`VariationID-${index}`}><strong>Variation</strong></label>
//                 <select
//                   onChange={event => handleInput(index, event)}
//                   className='form-control rounded-0'
//                   name='VariationID'
//                   value={entry.VariationID}
//                   id={`VariationID-${index}`}
//                   disabled={!entry.ProductID} // Disable dropdown if no product is selected
//                 >
//                   <option value="">Select a variation</option>
//                   {variations[index] && variations[index].map(variation => (
//                     <option key={variation.VariationID} value={variation.VariationID}>
//                       {variation.Size}
//                     </option>
//                   ))}
//                 </select>
//                 {errors[index] && errors[index].VariationID && <span className='text-danger'>{errors[index].VariationID}</span>}
//               </div>
//               <div className='col-md-2 mb-3'>
//                 <label htmlFor={`Quantity-${index}`}><strong>Quantity</strong></label>
//                 <input
//                   onChange={event => handleInput(index, event)}
//                   type='number'
//                   placeholder='Enter Quantity'
//                   className='form-control rounded-0'
//                   name='Quantity'
//                   value={entry.Quantity}
//                   id={`Quantity-${index}`}
//                 />
//                 {errors[index] && errors[index].Quantity && <span className='text-danger'>{errors[index].Quantity}</span>}
//               </div>
//               <div className='col-md-2 mb-3'>
//                 <label htmlFor={`UnitPrice-${index}`}><strong>Unit Price</strong></label>
//                 <input
//                   onChange={event => handleInput(index, event)}
//                   type='number'
//                   placeholder='Enter Unit Price'
//                   className='form-control rounded-0'
//                   name='UnitPrice'
//                   value={entry.UnitPrice}
//                   id={`UnitPrice-${index}`}
//                 />
//                 {errors[index] && errors[index].UnitPrice && <span className='text-danger'>{errors[index].UnitPrice}</span>}
//               </div>
//               <div className='col-md-2 mb-3 d-flex align-items-end'>
//                 <button type='button' className='btn btn-danger w-100 rounded-0' onClick={() => removeEntry(index)}>
//                   Remove
//                 </button>
//               </div>
//             </div>
//           ))}
//           <div className='row'>
//             <div className='col-md-12 mb-3'> {/* Added margin-bottom to create space */}
//               <button type='button' className='btn btn-primary w-100 rounded-0' onClick={addEntry}>
//                 Add Entry
//               </button>
//             </div>
//           </div>
//           <div className='row'>
//             <div className='col-md-12'>
//               <button type='submit' className='btn btn-success w-100 rounded-0' disabled={isSubmitting}>
//                 {isSubmitting ? 'Submitting...' : 'Submit'}
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default AddPurchaseOrderDetail;

// //27-12-2024
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import axios from 'axios';
// import { validatePurchaseOrderDetail } from '../../controllers/POrderdetailsvalidator'; // Adjust the import path as needed

// function AddPurchaseOrderDetail() {
//   const { id: PurchaseOrderID } = useParams(); // Get PurchaseOrderID from URL
//   const [entries, setEntries] = useState([{
//     PurchaseOrderID: PurchaseOrderID || "", // Pre-fill PurchaseOrderID
//     ProductID: "",
//     VariationID: "",
//     Quantity: "",
//     UnitPrice: ""
//   }]);

//   const [products, setProducts] = useState([]);
//   const [variations, setVariations] = useState({});
//   const [errors, setErrors] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await axios.get('http://localhost:3001/api/products');
//         setProducts(response.data);
//       } catch (error) {
//         console.error('Error fetching products:', error);
//       }
//     };

//     fetchProducts();
//   }, []);

//   const handleInput = (index, event) => {
//     const { name, value } = event.target;
//     const newEntries = [...entries];
//     newEntries[index][name] = value;
//     setEntries(newEntries);

//     if (name === 'ProductID') {
//       fetchVariations(value, index);
//     }
//     // else if (name === 'VariationID') {
//     //   fetchVariationDetails(value, index);
//     // }
//   };

//   const fetchVariations = async (productId, index) => {
//     try {
//       const response = await axios.get(`http://localhost:3001/api/products/${productId}/variations`);
//       setVariations(prev => ({ ...prev, [index]: response.data }));
//     } catch (error) {
//       console.error('Error fetching variations:', error);
//     }
//   };

//   // const fetchVariationDetails = async (variationId, index) => {
//   //   try {
//   //     const response = await axios.get(`http://localhost:3001/api/productVariations/${variationId}`);
//   //     const variation = response.data;
//   //     setEntries(prevEntries => {
//   //       const newEntries = [...prevEntries];
//   //       // newEntries[index].UnitPrice = variation.Price; // Assuming 'price' is the attribute name
//   //       return newEntries;
//   //     });
//   //   } catch (error) {
//   //     console.error('Error fetching variation details:', error);
//   //   }
//   // };

//   const addEntry = () => {
//     setEntries([...entries, {
//       PurchaseOrderID: PurchaseOrderID || "", // Pre-fill PurchaseOrderID
//       ProductID: "",
//       VariationID: "",
//       Quantity: "",
//       UnitPrice: ""
//     }]);
//   };

//   const removeEntry = (index) => {
//     setEntries(entries.filter((_, i) => i !== index));
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     const validationErrors = entries.map(entry => validatePurchaseOrderDetail(entry));
//     const hasErrors = validationErrors.some(error => Object.keys(error).length > 0);
//     setErrors(validationErrors);

//     if (!hasErrors) {
//       setIsSubmitting(true);
//       console.log("Submitting entries:", entries); // Log the payload

//       //batch
//       // Step 1: Create Batches for Each Entry
//       const batchPromises = entries.map((entry) =>
//         axios.post("http://localhost:3001/api/batch/create", {
//           ProductID: entry.ProductID,
//           VariationID: entry.VariationID,
//           // BatchNumber: generateBatchNumber(), // You can create a batch number logic
//           // ManufacturingDate: entry.ManufacturingDate,
//           // ExpirationDate: entry.ExpirationDate,
//           CostPricePerUnit: entry.UnitPrice,
//           Quantity: entry.Quantity,
//         })
//       );
//        // Step 2: Wait for all batches to be created
//     Promise.all(batchPromises)
//       .then(async (batchResponses) => {
//         // After batch creation, submit purchase order details
//         const batchIds = batchResponses.map(response => response.data.BatchID); // Get the BatchIDs returned from the batch creation API

//         // Add BatchID to each entry
//         const entriesWithBatchIds = entries.map((entry, index) => ({
//           ...entry,
//           BatchID: batchIds[index] // Add the corresponding BatchID to the entry
//         }));

//       axios
//         .post("http://localhost:3001/api/purchaseordersdetails", { entriesWithBatchIds })//enteries previous code
//         .then(async (res) => {
//           // Create stock transactions
//           const stockTransactionPromises = entriesWithBatchIds.map((entry) =>  //enteries
//             axios.post("http://localhost:3001/api/stocktransaction", {
//               VariationID: entry.VariationID,
//               TransactionDate: new Date(),
//               Quantity: entry.Quantity,
//               TransactionType: "IN",
//               UnitType: "Container",
//               BuyingPrice: entry.UnitPrice,
//                BatchID: entry.BatchID  // Pass BatchID in the stock transaction

//             })
//           );
//           await Promise.all(stockTransactionPromises);

//           navigate(`/purchaseorder/update/${PurchaseOrderID}`); // Navigate to purchaseOrderDetails page after successful submission
//           console.log(res);
//         })
//         .catch((err) => {
//           console.error("Error adding purchase order details:", err);
//         })
//         .finally(() => {
//           setIsSubmitting(false);
//         });
//     };

//   return (
//     <div className='d-flex vh-100 justify-content-center align-items-center' style={{ backgroundColor: '#263043' }}>
//       <div className='w-75 bg-white rounded p-3 overflow-auto'  style={{ maxHeight: '90vh' }}>
//         <form onSubmit={handleSubmit}>
//           {entries.map((entry, index) => (
//             <div className='row' key={index}>
//               <div className='col-md-2 mb-3'>
//                 <label htmlFor={`PurchaseOrderID-${index}`}><strong>Purchase Order ID</strong></label>
//                 <input
//                   onChange={event => handleInput(index, event)}
//                   type='number'
//                   placeholder='Enter Purchase Order ID'
//                   className='form-control rounded-0'
//                   name='PurchaseOrderID'
//                   value={entry.PurchaseOrderID}
//                   id={`PurchaseOrderID-${index}`}
//                   readOnly
//                 />
//                 {errors[index] && errors[index].PurchaseOrderID && <span className='text-danger'>{errors[index].PurchaseOrderID}</span>}
//               </div>
//               <div className='col-md-2 mb-3'>
//                 <label htmlFor={`ProductID-${index}`}><strong>Product</strong></label>
//                 <select
//                   onChange={event => handleInput(index, event)}
//                   className='form-control rounded-0'
//                   name='ProductID'
//                   value={entry.ProductID}
//                   id={`ProductID-${index}`}
//                 >
//                   <option value="">Select a product</option>
//                   {products.map(product => (
//                     <option key={product.ProductID} value={product.ProductID}>
//                       {product.ProductName}
//                     </option>
//                   ))}
//                 </select>
//                 {errors[index] && errors[index].ProductID && <span className='text-danger'>{errors[index].ProductID}</span>}
//               </div>
//               <div className='col-md-2 mb-3'>
//                 <label htmlFor={`VariationID-${index}`}><strong>Variation</strong></label>
//                 <select
//                   onChange={event => handleInput(index, event)}
//                   className='form-control rounded-0'
//                   name='VariationID'
//                   value={entry.VariationID}
//                   id={`VariationID-${index}`}
//                   disabled={!entry.ProductID} // Disable dropdown if no product is selected
//                 >
//                   <option value="">Select a variation</option>
//                   {variations[index] && variations[index].map(variation => (
//                     <option key={variation.VariationID} value={variation.VariationID}>
//                       {variation.Size}
//                     </option>
//                   ))}
//                 </select>
//                 {errors[index] && errors[index].VariationID && <span className='text-danger'>{errors[index].VariationID}</span>}
//               </div>
//               <div className='col-md-2 mb-3'>
//                 <label htmlFor={`Quantity-${index}`}><strong>Quantity</strong></label>
//                 <input
//                   onChange={event => handleInput(index, event)}
//                   type='number'
//                   placeholder='Enter Quantity'
//                   className='form-control rounded-0'
//                   name='Quantity'
//                   value={entry.Quantity}
//                   id={`Quantity-${index}`}
//                 />
//                 {errors[index] && errors[index].Quantity && <span className='text-danger'>{errors[index].Quantity}</span>}
//               </div>
//               <div className='col-md-2 mb-3'>
//                 <label htmlFor={`UnitPrice-${index}`}><strong>Unit Price</strong></label>
//                 <input
//                   onChange={event => handleInput(index, event)}
//                   type='number'
//                   placeholder='Enter Unit Price'
//                   className='form-control rounded-0'
//                   name='UnitPrice'
//                   value={entry.UnitPrice}
//                   id={`UnitPrice-${index}`}
//                 />
//                 {errors[index] && errors[index].UnitPrice && <span className='text-danger'>{errors[index].UnitPrice}</span>}
//               </div>
//               <div className='col-md-2 mb-3 d-flex align-items-end'>
//                 <button type='button' className='btn btn-danger w-100 rounded-0' onClick={() => removeEntry(index)}>
//                   Remove
//                 </button>
//               </div>
//             </div>
//           ))}
//           <div className='row'>
//             <div className='col-md-12 mb-3'> {/* Added margin-bottom to create space */}
//               <button type='button' className='btn btn-primary w-100 rounded-0' onClick={addEntry}>
//                 Add Entry
//               </button>
//             </div>
//           </div>
//           <div className='row'>
//             <div className='col-md-12'>
//               <button type='submit' className='btn btn-success w-100 rounded-0' disabled={isSubmitting}>
//                 {isSubmitting ? 'Submitting...' : 'Submit'}
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
// }

// export default AddPurchaseOrderDetail;

//gptsol

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import CreatableSelect from "react-select/creatable";

import { validatePurchaseOrderDetail } from "../../controllers/POrderdetailsvalidator"; // Adjust the import path as needed

function AddPurchaseOrderDetail() {
  const { id: PurchaseOrderID } = useParams(); // Get PurchaseOrderID from URL
  const [entries, setEntries] = useState([
    {
      PurchaseOrderID: PurchaseOrderID || "", // Pre-fill PurchaseOrderID
      ProductID: "",
      VariationID: "",
      Quantity: "",
      UnitPrice: "",
    },
  ]);

  const [products, setProducts] = useState([]);
  const [variations, setVariations] = useState([]);
  const [errors, setErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleInput = (index, event) => {
    const { name, value } = event.target;
    const newEntries = [...entries];
    newEntries[index][name] = value;
    setEntries(newEntries);

    if (name === "ProductID") {
      fetchVariations(value, index);
    }
  };

  // const fetchVariations = async (productId, index) => {
  //   try {
  //     const response = await axios.get(
  //       `http://localhost:3001/api/products/${productId}/variations`
  //     );
  //     setVariations((prev) => ({ ...prev, [index]: response.data }));
  //   } catch (error) {
  //     console.error("Error fetching variations:", error);
  //   }
  // };
  const fetchVariations = async (productId) => {
  try {
    const response = await axios.get(
      `http://localhost:3001/api/products/${productId}/variations`
    );
    console.log("response: ",response.data)
    setVariations(response.data); // Set variations directly as an array
  } catch (error) {
    console.error("Error fetching variations:", error);
  }
};


  const addEntry = () => {
    setEntries([
      ...entries,
      {
        PurchaseOrderID: PurchaseOrderID || "", // Pre-fill PurchaseOrderID
        ProductID: "",
        VariationID: "",
        Quantity: "",
        UnitPrice: "",
      },
    ]);
  };

  const removeEntry = (index) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = entries.map((entry) =>
      validatePurchaseOrderDetail(entry)
    );
    const hasErrors = validationErrors.some(
      (error) => Object.keys(error).length > 0
    );
    setErrors(validationErrors);

    if (!hasErrors) {
      setIsSubmitting(true);

      try {
        // Create Batches
        const batchPromises = entries.map((entry) =>
          axios.post("http://localhost:3001/api/batch/create", {
            ProductID: entry.ProductID,
            VariationID: entry.VariationID,
            CostPricePerUnit: entry.UnitPrice,
            Quantity: entry.Quantity,
          })
        );
        const batchResponses = await Promise.all(batchPromises);
        console.log("batch response", batchResponses);
        // Add BatchIDs to Entries
        const batchIds = batchResponses.map((response) => {
          // console.log("batchID",response.data.batch)
          return response.data.batch.BatchID;
        });

        const entriesWithBatchIds = entries.map((entry, index) => ({
          ...entry,
          BatchID: batchIds[index],
        }));
        console.log("batch with ids", entriesWithBatchIds);
        // Add Purchase Order Details
        await axios.post("http://localhost:3001/api/purchaseordersdetails", {
          entries: entriesWithBatchIds,
        });

        // Create Stock Transactions
        const stockTransactionPromises = entriesWithBatchIds.map((entry) =>
          axios.post("http://localhost:3001/api/stocktransaction", {
            VariationID: entry.VariationID,
            TransactionDate: new Date(),
            Quantity: entry.Quantity,
            RemainingQuantity: entry.Quantity,
            TransactionType: "IN",
            UnitType: "Container",
            BuyingPrice: entry.UnitPrice,
            BatchID: entry.BatchID,
          })
        );
        await Promise.all(stockTransactionPromises);

        navigate(`/purchaseorder/update/${PurchaseOrderID}`); // Navigate after success
      } catch (error) {
        console.error("Error during submission:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  console.log("variations: ", variations);

  return (
    <div
      className="d-flex vh-100 justify-content-center align-items-center"
      style={{ backgroundColor: "#263043" }}
    >
      <div className="w-75 bg-white rounded p-3">
        <form onSubmit={handleSubmit}>
          {entries.map((entry, index) => (
            <div className="row" key={index}>
              <div className="col-md-2 mb-3">
                <label>
                  <strong>Purchase Order ID</strong>
                </label>
                <input
                  type="number"
                  className="form-control rounded-0"
                  value={entry.PurchaseOrderID}
                  readOnly
                />
                {errors[index]?.PurchaseOrderID && (
                  <span className="text-danger">
                    {errors[index].PurchaseOrderID}
                  </span>
                )}
              </div>
              <div className="col-md-2 mb-3">
                <label>
                  <strong>Product</strong>
                </label>
                {/* <CreatableSelect
                  options={products}
                  // onChange={handleCustomerChange}
                  className="basic-single"
                  classNamePrefix="select"
                  isClearable
                  isSearchable
                  name="ProductID"
                  value={products.find(
                    (option) => option.value === products.ProductID
                  )}
                /> */}
                <CreatableSelect
                  // styles={{ zIndex: "999999" }}
                  options={products.map((product) => ({
                    value: product.ProductID,
                    label: product.ProductName, // ✅ Display ProductName
                  }))}
                  className="basic-single"
                  classNamePrefix="select"
                  isClearable
                  isSearchable
                  name="ProductID"
                  value={products
                    .map((product) => ({
                      value: product.ProductID,
                      label: product.ProductName,
                    }))
                    .find((option) => option.value === entry.ProductID)} // ✅ Correct selection
                  onChange={(selectedOption) =>
                    handleInput(index, {
                      target: {
                        name: "ProductID",
                        value: selectedOption ? selectedOption.value : "",
                      },
                    })
                  }
                />

                {/* <select
                  onChange={(event) => handleInput(index, event)}
                  className="form-control rounded-0"
                  name="ProductID"
                  value={entry.ProductID}
                >
                  <option value="">Select a product</option>
                  {products.map((product) => (
                    <option key={product.ProductID} value={product.ProductID}>
                      {product.ProductName}
                    </option>
                  ))}
                </select> */}
                {errors[index]?.ProductID && (
                  <span className="text-danger">{errors[index].ProductID}</span>
                )}
              </div>
              <div className="col-md-2 mb-3">
                <label>
                  <strong>Variation</strong>
                </label>
                <CreatableSelect
                  // styles={{ zIndex: "999999" }}
                  options={
                    variations.length > 0 &&
                    variations.map((variation) => ({
                      value: variation.VariationID,
                      label: variation.SKU, // ✅ Display ProductName
                    }))
                  }
                  className="basic-single"
                  classNamePrefix="select"
                  isClearable
                  isSearchable
                  name="VariationID"
                  value={
                    variations.length > 0 &&
                    variations
                      .map((variation) => ({
                        value: variation.VariationID,
                        label: variation.SKU,
                      }))
                      .find((option) => option.value === entry.VariationID)
                  }
                  onChange={(selectedOption) =>
                    handleInput(index, {
                      target: {
                        name: "VariationID",
                        value: selectedOption ? selectedOption.value : "",
                      },
                    })
                  }
                />
                {/* <select
                  onChange={(event) => handleInput(index, event)}
                  className="form-control rounded-0"
                  name="VariationID"
                  value={entry.VariationID}
                >
                  <option value="">Select a variation</option>
                  {(variations[index] || []).map((variation) => (
                    <option
                      key={variation.VariationID}
                      value={variation.VariationID}
                    >
                      {variation.SKU}
                    </option>
                  ))}
                </select> */}
                {errors[index]?.VariationID && (
                  <span className="text-danger">
                    {errors[index].VariationID}
                  </span>
                )}
              </div>
              <div className="col-md-2 mb-3">
                <label>
                  <strong>Quantity</strong>
                </label>
                <input
                  type="number"
                  className="form-control rounded-0"
                  name="Quantity"
                  value={entry.Quantity}
                  onChange={(event) => handleInput(index, event)}
                />
                {errors[index]?.Quantity && (
                  <span className="text-danger">{errors[index].Quantity}</span>
                )}
              </div>
              <div className="col-md-2 mb-3">
                <label>
                  <strong>Unit Price</strong>
                </label>
                <input
                  type="number"
                  className="form-control rounded-0"
                  name="UnitPrice"
                  value={entry.UnitPrice}
                  onChange={(event) => handleInput(index, event)}
                />
                {errors[index]?.UnitPrice && (
                  <span className="text-danger">{errors[index].UnitPrice}</span>
                )}
              </div>
              <div className="col-md-2 mb-3 d-flex align-items-end">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => removeEntry(index)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button type="button" className="btn btn-primary" onClick={addEntry}>
            Add Entry
          </button>
          <button
            type="submit"
            className="btn btn-success"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddPurchaseOrderDetail;
