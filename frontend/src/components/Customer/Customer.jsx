import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

function CustomerComponent() {
  const [data, setData] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = () => {
    axios.get('http://localhost:3001/api/customers')
      .then(async (res) => {
        const customers = res.data;
        // Fetch last balance for each customer
        const customerDataWithBalances = await Promise.all(
          customers.map(async (customer) => {
            const lastBalance = await fetchLastBalance(customer.CustomerID);
            return { ...customer, AvailableBalance: lastBalance };
          })
        );
        setData(customerDataWithBalances);
      })
      .catch(err => console.log(err));
  };

  const fetchLastBalance = async (customerId) => {
    try {
      const res = await axios.get(`http://localhost:3001/api/customers/customerleisure/lastbalance/${customerId}`);
      return res.data.lastBalance;
    } catch (err) {
      console.error('Error fetching last balance:', err);
      return null;
    }
  };

  const handleDelete = (CustomerID) => {
    axios.delete(`http://localhost:3001/api/customers/${CustomerID}`)
      .then(res => {
        console.log('Customer deleted successfully');
        // Refresh the data after deletion
        fetchCustomers();
      })
      .catch(err => console.log(err));
  };

  return (
    <div
      className='d-flex vh-100 justify-content-center align-items-center'
      style={{ backgroundColor: '#1d2634' }}
    >
      <div className='w-100 w-md-50 bg-white rounded p-3'>
        <h2>Customers List</h2>
        <div>
          <Link to={'/customers/add'} className='btn btn-success'>Add +</Link>
        </div>
        <table className='table'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Available Balance</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((customer, index) => (
              <tr key={index}>
                <td>{customer.CustomerID}</td>
                <td>{customer.CustomerName}</td>
                <td>{customer.Phone}</td>
                <td>{customer.AvailableBalance !== null ? customer.AvailableBalance : 0}</td>
                <td>
                  <Link to={`/customers/update/${customer.CustomerID}`} className='btn btn-sm btn-primary mx-2'>Edit</Link>
                  <button onClick={() => handleDelete(customer.CustomerID)} className='btn btn-sm btn-danger'>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CustomerComponent;
