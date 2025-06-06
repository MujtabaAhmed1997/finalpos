// import React from 'react'

// function Readsupplier() {
//   return (
//     <div>
      
//     </div>
//   )
// }

// export default Readsupplier
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function Readsupplier() {
  const { id } = useParams();
  const [supplier, setSupplier] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3001/api/suppliers/${id}`)
      .then(res => {
        console.log(res);
        setSupplier(res.data);
      })
      .catch(err => console.log(err));
  }, [id]);

  return (
    <div className='d-flex vh-100 bg-dark justify-content-center align-items-center'>
      <div className='w-100 w-md-50 bg-white rounded p-3'>
        {supplier ? (
          <>
            <h2>{supplier.SupplierName}</h2>
            <table className='table'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Contact Name</th>
                  <th>Address</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{supplier.SupplierID}</td>
                  <td>{supplier.SupplierName}</td>
                  <td>{supplier.ContactName}</td>
                  <td>{supplier.Address}</td>
                  <td>{supplier.Phone}</td>
                  <td>{supplier.Email}</td>
                  <td>
                    <Link to='/suppliers' className='btn btn-sm btn-info'>Back</Link>
                    <Link to={`/suppliers/update/${supplier.SupplierID}`} className='btn btn-sm btn-primary mx-2'>Edit</Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default Readsupplier ;
