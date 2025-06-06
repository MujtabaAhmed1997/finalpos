import React, { useState, useEffect } from 'react';
import {  useNavigate } from 'react-router-dom';
import {signupvalidtion} from '../../../controllers/signupvalidation';
import axios from 'axios';

function Addcomponent() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: ""
});
const [errors, setErrors] = useState({});
const navigation = useNavigate();

const onhandleInput = (event) => {
    setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
};

useEffect(() => {
    // Validate form inputs whenever values change
    setErrors(signupvalidtion(values));
}, [values]);

const onhandlesubmit = (event) => {
    event.preventDefault();
    // Check if there are any validation errors
    if (Object.values(errors).every(error => error === '')) {
        // If no errors, submit the form
        axios.post('http://localhost:3001/api/users/signup', values)
            .then(res => {
                navigation('/users');
                console.log(res);
            })
            .catch((
                err) =>{ 
                    setErrors(err);
                    console.log("email dp")
            });
    }
};
  return (
    <div
    className='d-flex vh-100 justify-content-center align-items-center'
    style={{ backgroundColor: '#263043' }}
  >  
      <div className='w-50    bg-white  rounded  p-3'>
      <form action='' onSubmit={onhandlesubmit}>
                    <div className='mb-3'>
                        <label htmlFor='name'><strong>Name</strong></label>
                        <input onChange={onhandleInput} type='text' placeholder='Enter your name here' className='form-control rounded-0' name='name' />
                        {errors.name && <span className='text-danger'>{errors.name}</span>}
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='email'><strong>Email</strong></label>
                        <input onChange={onhandleInput} type='email' placeholder='Enter your email address' className='form-control rounded-0' name='email' />
                        {errors.email && <span className='text-danger'>{errors.email}</span>}
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='password'><strong>Password</strong></label>
                        <input onChange={onhandleInput} type='password' placeholder='Enter your password' className='form-control rounded-0' name='password' />
                        {errors.password && <span className='text-danger'>{errors.password}</span>}
                    </div>
                    <button type='submit' className='btn btn-success w-100 rounded-0'>Submit</button>
                   
                </form>
      </div>
    </div>
  )
}

export default Addcomponent
