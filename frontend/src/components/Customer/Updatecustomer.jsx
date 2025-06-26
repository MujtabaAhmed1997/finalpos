// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// function UpdateCustomer() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [customer, setCustomer] = useState({
//     CustomerName: '',
//     Address: '',
//     Phone: '',
//     Email: '',
//     AvailableBalance: ''
//   });

//   useEffect(() => {
//     axios.get(`http://localhost:3001/api/customers/${id}`)
//       .then(res => setCustomer(res.data))
//       .catch(err => console.log(err));
//   }, [id]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setCustomer(prevState => ({
//       ...prevState,
//       [name]: value
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     axios.put(`http://localhost:3001/api/customers/${id}`, customer)
//       .then(res => {
//         console.log(res);
//         navigate('/customers');
//       })
//       .catch(err => console.log(err));
//   };

//   return (
//     <div className='d-flex vh-100 justify-content-center align-items-center'>
//       <div className='w-100 w-md-50 bg-white rounded p-3'>
//         <h2>Update Customer</h2>
//         <form onSubmit={handleSubmit}>
//           <div className='mb-3'>
//             <label htmlFor='CustomerName' className='form-label'>Customer Name</label>
//             <input
//               type='text'
//               className='form-control'
//               id='CustomerName'
//               name='CustomerName'
//               value={customer.CustomerName}
//               onChange={handleInputChange}
//             />
//           </div>
//           <div className='mb-3'>
//             <label htmlFor='Address' className='form-label'>Address</label>
//             <input
//               type='text'
//               className='form-control'
//               id='Address'
//               name='Address'
//               value={customer.Address}
//               onChange={handleInputChange}
//             />
//           </div>
//           <div className='mb-3'>
//             <label htmlFor='Phone' className='form-label'>Phone</label>
//             <input
//               type='text'
//               className='form-control'
//               id='Phone'
//               name='Phone'
//               value={customer.Phone}
//               onChange={handleInputChange}
//             />
//           </div>
//           <div className='mb-3'>
//             <label htmlFor='Email' className='form-label'>Email</label>
//             <input
//               type='email'
//               className='form-control'
//               id='Email'
//               name='Email'
//               value={customer.Email}
//               onChange={handleInputChange}
//             />
//           </div>
//           <div className='mb-3'>
//             <label htmlFor='AvailableBalance' className='form-label'>Available Balance</label>
//             <input
//               type='number'
//               step='0.01'
//               className='form-control'
//               id='AvailableBalance'
//               name='AvailableBalance'
//               value={customer.AvailableBalance}
//               onChange={handleInputChange}
//             />
//           </div>
//           <button type='submit' className='btn btn-primary'>Update Customer</button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default UpdateCustomer;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function UpdateCustomer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState({
    CustomerName: "",
    Address: "",
    Phone: "",
    Email: "",
    AvailableBalance: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:3001/api/customers/${id}`)
      .then((res) => setCustomer(res.data))
      .catch((err) => {
        console.error(err);
        setApiError("Failed to load customer");
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3001/api/customers/${id}`, customer);
      navigate("/customers");
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else if (err.response?.data?.message) {
        setApiError(err.response.data.message);
      } else {
        setApiError("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <div className="row w-100">
        <div className="col-12 col-md-8 col-lg-6 mx-auto bg-white rounded p-4 shadow">
          <h2 className="text-center mb-4">Update Customer</h2>
          {apiError && <div className="alert alert-danger">{apiError}</div>}
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="CustomerName" className="form-label">
                Customer Name
              </label>
              <input
                type="text"
                className={`form-control ${
                  errors.CustomerName ? "is-invalid" : ""
                }`}
                id="CustomerName"
                name="CustomerName"
                value={customer.CustomerName}
                onChange={handleInputChange}
              />
              {errors.CustomerName && (
                <div className="invalid-feedback">{errors.CustomerName}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="Address" className="form-label">
                Address
              </label>
              <input
                type="text"
                className="form-control"
                id="Address"
                name="Address"
                value={customer.Address}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="Phone" className="form-label">
                Phone
              </label>
              <input
                type="text"
                className={`form-control ${errors.Phone ? "is-invalid" : ""}`}
                id="Phone"
                name="Phone"
                value={customer.Phone}
                onChange={handleInputChange}
              />
              {errors.Phone && (
                <div className="invalid-feedback">{errors.Phone}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="Email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className={`form-control ${errors.Email ? "is-invalid" : ""}`}
                id="Email"
                name="Email"
                value={customer.Email}
                onChange={handleInputChange}
              />
              {errors.Email && (
                <div className="invalid-feedback">{errors.Email}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="AvailableBalance" className="form-label">
                Available Balance
              </label>
              <input
                type="number"
                step="0.01"
                className={`form-control ${
                  errors.AvailableBalance ? "is-invalid" : ""
                }`}
                id="AvailableBalance"
                name="AvailableBalance"
                value={customer.AvailableBalance}
                onChange={handleInputChange}
              />
              {errors.AvailableBalance && (
                <div className="invalid-feedback">
                  {errors.AvailableBalance}
                </div>
              )}
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Update Customer
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateCustomer;
