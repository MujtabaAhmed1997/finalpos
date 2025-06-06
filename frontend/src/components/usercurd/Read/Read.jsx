import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Read() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:3001/api/usercurd/read/${id}`)
      .then(res => {
        console.log(res);
        setProducts(res.data);
      })
      .catch(err => console.log(err));
  }, [id]);

  return (
    <div className='d-flex vh-100 bg-dark justify-content-center align-items-center'>
      <div className='w-100 w-md-50 bg-white rounded p-3'>
        {products.length > 0 ? (
          <>
            <h2>{products[0].name}</h2>
            <table className='table'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                 <th>CreatedAt</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={index}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.email}</td>
                    <td>{product.role}</td>
                    <td>{product.createdAt}</td>
                    <td>
                      <Link to={'/users'} className='btn btn-sm btn-info'>Back</Link>
                      <Link to={`/users/update/${product.id}`} className='btn btn-sm btn-primary mx-2'>Edit</Link>
                    </td>
                  </tr>
                ))}
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

export default Read;
