import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './supplier.css';

function SupplierComponent() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = () => {
    axios.get('http://localhost:3001/api/suppliers')
    .then(res => setData(res.data))
    .catch(err => console.log(err));
  }
  const handleDelete = (SupplierID) => {
    axios.delete(`http://localhost:3001/api/suppliers/${SupplierID}`)
      .then(res => {
        console.log('Supplier deleted successfully');
        // Refresh the data after deletion
        fetchSuppliers();
      })
      .catch(err => console.log(err));
  };


  return (
    <div
      className='d-flex vh-100 justify-content-center align-items-center'
      style={{ backgroundColor: '#1d2634' }}
    >
      <div className='w-100 w-md-50 bg-white rounded p-3'>
        <h2>Suppliers List</h2>
        <div>
          <Link to={'/suppliers/add'} className='btn btn-success'>Add +</Link>
        </div>
        <table className='table'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((suppliers, index) => {
              return (
                <tr key={index}>
                  <td>{suppliers.SupplierID}</td>
                  <td>{suppliers.SupplierName}</td>
                  <td>{suppliers.Phone}</td>
                  <td>
                    <Link to={`/suppliers/read/${suppliers.SupplierID}`} className='btn btn-sm btn-info'>Read</Link>
                    <Link to={`/suppliers/update/${suppliers.SupplierID}`} className='btn btn-sm btn-primary mx-2'>Edit</Link>
                    <button onClick={() => handleDelete(suppliers.SupplierID)} className='btn btn-sm btn-danger'>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SupplierComponent;
