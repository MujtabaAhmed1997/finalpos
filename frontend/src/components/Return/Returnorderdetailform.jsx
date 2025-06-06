import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
//import axios from '../services/api'; // Use a separate file for API calls
import axios from 'axios';
import { ReturnOrderDetailValidator } from '../../controllers/rorderdetails';

function AddReturnOrderDetail() {
  const { id: ReturnOrderID } = useParams();  // Get ReturnOrderID from URL
  const [entries, setEntries] = useState([{
    ReturnOrderID: ReturnOrderID || "",
    ProductID: "",
    VariationID: "",
    Quantity: "",
    Reason: "", 
    UnitPrice: "",
    LooseQuantity: 0,
    UnitPerPackaging:""
  }]);

  const [products, setProducts] = useState([]);
  const [variations, setVariations] = useState({});
  const [errors, setErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleInput = (index, event) => {
    const { name, value } = event.target;
    const newEntries = [...entries];
    newEntries[index][name] = value;
    setEntries(newEntries);

    if (name === 'ProductID') {
      fetchVariations(value, index);
    } else if (name === 'VariationID') {
      fetchVariationDetails(value, index);
    }
  };

  const fetchVariations = async (productId, index) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/products/${productId}/variations`);
      setVariations(prev => ({ ...prev, [index]: response.data }));
    } catch (error) {
      console.error('Error fetching variations:', error);
    }
  };

  const fetchVariationDetails = async (variationId, index) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/productVariations/${variationId}`);
      const variation = response.data;
      setEntries(prevEntries => {
        const newEntries = [...prevEntries];
        newEntries[index].UnitPrice = variation.SellingPrice;
        newEntries[index].LooseQuantity = variation.LooseQuantity || 0; // Set Loose Quantity
        newEntries[index].UnitPerPackaging = variation.UnitsPerPackage|| 1; // Default to 1 if not provided
        console.log(variation.UnitsPerPackage);
        console.log (newEntries);

        return newEntries;
      });
    } catch (error) {
      console.error('Error fetching variation details:', error);
    }
  };

  const addEntry = () => {
    setEntries([...entries, {
      ReturnOrderID: ReturnOrderID || "",
      ProductID: "",
      VariationID: "",
      Quantity: "",
      Reason: "", 
      UnitPrice: "",
      LooseQuantity: 0,
      UnitPerPackaging:""

    }]);
  };

  const removeEntry = (index) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const validationErrors = entries.map(entry => ReturnOrderDetailValidator(entry));
//     const hasErrors = validationErrors.some(error => Object.keys(error).length > 0);
//     setErrors(validationErrors);

//     if (!hasErrors) {
//       setIsSubmitting(true);

//       try {
//         await axios.post('http://localhost:3001/api/returnordersdetails', { entries });
//         navigate(`/returnorder/update/${ReturnOrderID}`);
//       } catch (err) {
//         console.error('Error adding return order details:', err);
//       } finally {
//         setIsSubmitting(false);
//       }
//     }
//   };

const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = entries.map(entry => ReturnOrderDetailValidator(entry));
    const hasErrors = validationErrors.some(error => Object.keys(error).length > 0);
    setErrors(validationErrors);
  
    if (!hasErrors) {
      setIsSubmitting(true);
  
      try {
        // Create StockTransactions for each entry
        for (const entry of entries) {
            if(entry.Quantity>0){
          const stockTransaction = {
            VariationID: entry.VariationID,
            TransactionDate: new Date(),
            Quantity: entry.Quantity,
            UnitType: 'Container', // Adjust according to your logic
            TransactionType: 'IN' // Or any other type depending on your requirements
          };
          await axios.post('http://localhost:3001/api/stocktransaction', stockTransaction);
        }
          console.log("bff")
          console.log(entry.LooseQuantity);
          if (entry.LooseQuantity > 0) {
            console.log("aff")

            const looseStockTransaction = {
              VariationID: entry.VariationID,
              TransactionDate: new Date(),
              Quantity: entry.LooseQuantity,
              UnitType: 'L',
              TransactionType: 'IN'
            };
            await axios.post('http://localhost:3001/api/stocktransaction', looseStockTransaction);
          }
        }
        console.log(entries);
        await axios.post('http://localhost:3001/api/returnordersdetails', { entries });
        navigate(`/updatereturnorder/${ReturnOrderID}`);
        
        
      } catch (err) {
        console.error('Error adding return order details:', err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
//   return (
//     <div className='d-flex vh-100 justify-content-center align-items-center' style={{ backgroundColor: '#263043' }}>
//       <div className='w-75 bg-white rounded p-3 overflow-auto' style={{ maxHeight: '90vh' }}>
//         <form onSubmit={handleSubmit}>
//           {entries.map((entry, index) => (
//             <div className='row' key={index}>
//               {/* Product Selection */}
//               <div className='col-md-3 mb-3'>
//                 <label htmlFor={`ProductID-${index}`}>Product</label>
//                 <select
//                   name='ProductID'
//                   id={`ProductID-${index}`}
//                   className='form-control'
//                   value={entry.ProductID}
//                   onChange={event => handleInput(index, event)}
//                 >
//                   <option value=''>Select Product</option>
//                   {products.map(product => (
//                     <option key={product.ProductID} value={product.ProductID}>{product.ProductName}</option>
//                   ))}
//                 </select>
//                 {errors[index]?.ProductID && <span className='text-danger'>{errors[index].ProductID}</span>}
//               </div>

//               {/* Variation Selection */}
//               <div className='col-md-3 mb-3'>
//                 <label htmlFor={`VariationID-${index}`}>Variation</label>
//                 <select
//                   name='VariationID'
//                   id={`VariationID-${index}`}
//                   className='form-control'
//                   value={entry.VariationID}
//                   onChange={event => handleInput(index, event)}
//                   disabled={!entry.ProductID}  // Disable if no product is selected
//                 >
//                   <option value=''>Select Variation</option>
//                   {(variations[index] || []).map(variation => (
//                     <option key={variation.VariationID} value={variation.VariationID}>{variation.SKU}</option>
//                   ))}
//                 </select>
//                 {errors[index]?.VariationID && <span className='text-danger'>{errors[index].VariationID}</span>}
//               </div>

//               {/* Reason for Return */}
//               <div className='col-md-2 mb-3'>
//                 <label htmlFor={`Reason-${index}`}>Reason for Return</label>
//                 <input
//                   type='text'
//                   name='Reason'
//                   id={`Reason-${index}`}
//                   className='form-control'
//                   value={entry.Reason}
//                   onChange={event => handleInput(index, event)}
//                 />
//                 {errors[index]?.Reason && <span className='text-danger'>{errors[index].Reason}</span>}
//               </div>

//               {/* Quantity */}
//               <div className='col-md-2 mb-3'>
//                 <label htmlFor={`Quantity-${index}`}>Quantity</label>
//                 <input
//                   type='number'
//                   name='Quantity'
//                   id={`Quantity-${index}`}
//                   className='form-control'
//                   value={entry.Quantity}
//                   onChange={event => handleInput(index, event)}
//                 />
//                 {errors[index]?.Quantity && <span className='text-danger'>{errors[index].Quantity}</span>}
//               </div>

//               {/* Unit Price */}
//               <div className='col-md-2 mb-3'>
//                 <label htmlFor={`UnitPrice-${index}`}>Unit Price</label>
//                 <input
//                   type='number'
//                   name='UnitPrice'
//                   id={`UnitPrice-${index}`}
//                   className='form-control'
//                   value={entry.UnitPrice}
//                   readOnly
//                 />
//               </div>

//               {/* Loose Quantity */}
//               <div className='col-md-2 mb-3'>
//                 <label htmlFor={`LooseQuantity-${index}`}>Loose Quantity</label>
//                 <input
//                   type='number'
//                   name='LooseQuantity'
//                   id={`LooseQuantity-${index}`}
//                   className='form-control'
//                   value={entry.LooseQuantity}
//                   onChange={event => handleInput(index, event)}
//                   disabled={!entry.ProductID || !entry.VariationID}
                  
//                 />
//               </div>

//               {/* Remove Entry */}
//               <div className='col-md-2 mb-3 d-flex align-items-end'>
//                 <button
//                   type='button'
//                   className='btn btn-danger w-100'
//                   onClick={() => removeEntry(index)}
//                 >
//                   Remove
//                 </button>
//               </div>
//             </div>
//           ))}

//           {/* Add Entry */}
//           <button type='button' className='btn btn-primary w-100 mb-3' onClick={addEntry}>Add Entry</button>

//           {/* Submit */}
//           <button type='submit' className='btn btn-success w-100' disabled={isSubmitting}>
//             {isSubmitting ? 'Submitting...' : 'Submit'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );


return (
    <div className='d-flex vh-100 justify-content-center align-items-center' style={{ backgroundColor: '#263043' }}>
      <div className='w-75 bg-white rounded p-3 overflow-auto' style={{ maxHeight: '90vh' }}>
        <form onSubmit={handleSubmit}>
          {entries.map((entry, index) => (
            <div className='row' key={index}>
              {/* Product Selection */}
              <div className='col-md-3 mb-3'>
                <label htmlFor={`ProductID-${index}`}>Product</label>
                <select
                  name='ProductID'
                  id={`ProductID-${index}`}
                  className='form-control'
                  value={entry.ProductID}
                  onChange={event => handleInput(index, event)}
                >
                  <option value=''>Select Product</option>
                  {products.map(product => (
                    <option key={product.ProductID} value={product.ProductID}>{product.ProductName}</option>
                  ))}
                </select>
                {errors[index]?.ProductID && <span className='text-danger'>{errors[index].ProductID}</span>}
              </div>
  
              {/* Variation Selection */}
              <div className='col-md-3 mb-3'>
                <label htmlFor={`VariationID-${index}`}>Variation</label>
                <select
                  name='VariationID'
                  id={`VariationID-${index}`}
                  className='form-control'
                  value={entry.VariationID}
                  onChange={event => handleInput(index, event)}
                  disabled={!entry.ProductID}  // Disable if no product is selected
                >
                  <option value=''>Select Variation</option>
                  {(variations[index] || []).map(variation => (
                    <option key={variation.VariationID} value={variation.VariationID}>{variation.SKU}</option>
                  ))}
                </select>
                {errors[index]?.VariationID && <span className='text-danger'>{errors[index].VariationID}</span>}
              </div>
  
              {/* Reason for Return */}
              <div className='col-md-2 mb-3'>
                <label htmlFor={`Reason-${index}`}>Reason for Return</label>
                <input
                  type='text'
                  name='Reason'
                  id={`Reason-${index}`}
                  className='form-control'
                  value={entry.Reason}
                  onChange={event => handleInput(index, event)}
                />
                {errors[index]?.Reason && <span className='text-danger'>{errors[index].Reason}</span>}
              </div>
  
              {/* Quantity */}
              <div className='col-md-2 mb-3'>
                <label htmlFor={`Quantity-${index}`}>Quantity</label>
                <input
                  type='number'
                  name='Quantity'
                  id={`Quantity-${index}`}
                  className='form-control'
                  value={entry.Quantity}
                  onChange={event => handleInput(index, event)}
                />
                {errors[index]?.Quantity && <span className='text-danger'>{errors[index].Quantity}</span>}
              </div>
  
              {/* Unit Price */}
              <div className='col-md-2 mb-3'>
                <label htmlFor={`UnitPrice-${index}`}>Unit Price</label>
                <input
                  type='number'
                  name='UnitPrice'
                  id={`UnitPrice-${index}`}
                  className='form-control'
                  value={entry.UnitPrice}
                  readOnly
                />
              </div>
  
              {/* Loose Quantity */}
              {entry.UnitPerPackaging > 1 && (
                <div className='col-md-2 mb-3'>
                  <label htmlFor={`LooseQuantity-${index}`}>Loose Quantity</label>
                  <input
                    type='number'
                    name='LooseQuantity'
                    id={`LooseQuantity-${index}`}
                    className='form-control'
                    value={entry.LooseQuantity}
                    onChange={event => handleInput(index, event)}
                    disabled={!entry.ProductID || !entry.VariationID}
                  />
                </div>
              )}
  
              {/* Remove Entry */}
              <div className='col-md-2 mb-3 d-flex align-items-end'>
                <button
                  type='button'
                  className='btn btn-danger w-100'
                  onClick={() => removeEntry(index)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
  
          {/* Add Entry */}
          <button type='button' className='btn btn-primary w-100 mb-3' onClick={addEntry}>Add Entry</button>
  
          {/* Submit */}
          <button type='submit' className='btn btn-success w-100' disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
  
}

export default AddReturnOrderDetail;
