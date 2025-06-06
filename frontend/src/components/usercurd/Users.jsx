import axios from 'axios'
import {Link, useNavigate} from 'react-router-dom';
import React, { useState } from 'react'
//import './Productcomp.css'
import { useEffect } from 'react'
function Users() {
    const [data,setData]=useState([]);
    const navigate = useNavigate();
  
   useEffect(
      ()=>{
          axios.get('http://localhost:3001/api/usercurd/getproducts')
          .then(res =>setData(res.data))
          .catch(err => console.log(err));
      },[]
   )
   const handledelete=(id)=>{
    axios.delete(`http://localhost:3001/api/usercurd/delete/${id}`)
    .then(res =>{
      navigate(0);
    })
    .catch(err => console.log(err));
  }
  
  
    return (
      <div
      className='d-flex vh-100 justify-content-center align-items-center'
      style={{ backgroundColor: '#1d2634' }}
    >      <div className=' w-100 w-md-50   bg-white  rounded  p-3 '>
          <h2>Users List</h2>
          <div>
            <Link to={'/users/add'} className=' btn btn-success '>Add +</Link>
          </div>
          <table className=' table '>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
             
                <th>Action</th>
  
              </tr>
            </thead>
            <tbody>
              {data.map((usertable,index)=>{
                return <tr key={index}>
                  <td>{usertable.id}</td>
                  <td>{usertable.name}</td>
                  <td>{usertable.email}</td>
                  
  
                   <td>
                    <Link to={`/users/read/${usertable.id}`} className=' btn  btn-sm  btn-info '>Read</Link>
                    <Link to={`/users/update/${usertable.id}`} className='btn  btn-sm   btn-primary mx-2  '>Edit</Link>
                    <button onClick={()=>{handledelete(usertable.id)}} className='btn  btn-sm   btn-danger '>Delete</button>
  
                    </td>                
  
                </tr>
              })}
            </tbody>
          </table>
        </div>
        
      </div>
    )
  
  }

export default Users
