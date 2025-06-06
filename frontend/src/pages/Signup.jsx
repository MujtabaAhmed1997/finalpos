// import React from 'react'
// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom'
// import signupvalidtion from '../controllers/signupvalidation';
//  import axios from 'axios';
// function Signup() {
//     const [values,setvalues]=useState({
//         name:"",
//         email:"",
//         password:""
//     });
//  const [errors,setErrors]=useState({});
//     const onhandleInput=(event)=>{
//         setvalues(prev=>({...prev,[event.target.name]:[event.target.value]}))
//     }    
//     const navigation=useNavigate();
//     const onhandlesubmit=(event)=>{
//         event.preventDefault();
//         setErrors(signupvalidtion(values));
//         // if(errors.name===''&&errors.email===''&&errors.password===''){
//         //     axios.post('http://localhost:3001/signup',values)
//         //     .then( res=>{
//         //         navigation('/')    
//         //     console.log(res)}
//         // ).catch(err=> console.log(err));
//         // }
//         useEffect(() => {
//             if (errors.name === '' && errors.email === '' && errors.password === '') {
//                 axios.post('http://localhost:3001/signup', values)
//                     .then(res => {
//                         navigation('/')
//                         console.log(res);
//                     })
//                     .catch(err => console.log(err));
//             }
//         }, [errors])
//     }
//   return (
//     <div className='d-flex justify-content-center align-items-center bg-primary vh-100'  >
//     <div className='bg-white p-3 rounded w-25'>
//         <h2>Sign-Up</h2> 
//   <form action='' onSubmit={onhandlesubmit}>
//   <div className='mb-3'>
//         <label htmlFor='name'><strong>Name</strong></label>
//         <input onChange={onhandleInput} type='text' placeholder='Enter your name here' className='form-control rounded-0' name='name' />
//         {errors.name&&<span className='text-danger' >{errors.name}</span>}

//     </div>
//     <div className='mb-3'>
//         <label htmlFor='email'><strong>Email</strong></label>
//         <input onChange={onhandleInput}  type='email' placeholder='Enter your email address' className='form-control rounded-0' name='email'/>
//         {errors.email&&<span className='text-danger' >{errors.email}</span>}

//     </div>
//     <div className='mb-3'>
//         <label htmlFor='password'><strong>Password</strong></label>
//         <input onChange={onhandleInput}  type='password' placeholder='Enter your password' className='form-control rounded-0' name='password' />
//         {errors.password&&<span className='text-danger' >{errors.password}</span>}

//     </div>
//     <button type='submit' className='btn btn-success w-100 rounded-0' >Sign Up</button>
//     <p>You agree to our terms and condition</p>
//     {/* <Link to='/' className='btn btn-danger w-100 rounded-0 bg-light' >Log in</Link> */}
//     <Link to='/' className='btn btn-danger w-100 rounded-0 '>Log in</Link>
  
//   </form>
//   </div>
// </div>
//   )
// }

// export default Signup
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import {signupvalidtion} from '../controllers/signupvalidation';
// import axios from 'axios';

// function Signup() {
//     const [values, setValues] = useState({
//         name: "",
//         email: "",
//         password: ""
//     });
//     const [errors, setErrors] = useState({});
//     const navigation = useNavigate();

//     const onhandleInput = (event) => {
//         setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
//     };

//     useEffect(() => {
//         // Validate form inputs whenever values change
//         setErrors(signupvalidtion(values));
//     }, [values]);

//     const onhandlesubmit = (event) => {
//         event.preventDefault();
//         // Check if there are any validation errors
//         if (Object.values(errors).every(error => error === '')) {
//             // If no errors, submit the form
//             axios.post('http://localhost:3001/signup', values)
//                 .then(res => {
//                     navigation('/');
//                     console.log(res);
//                 })
//                 .catch((
//                     err) =>{ 
//                         setErrors(err);
//                         console.log("email dp")
//                 });
//         }
//     };

//     return (
//         <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
//             <div className='bg-white p-3 rounded w-25'>
//                 <h2>Sign-Up</h2>
//                 <form action='' onSubmit={onhandlesubmit}>
//                     <div className='mb-3'>
//                         <label htmlFor='name'><strong>Name</strong></label>
//                         <input onChange={onhandleInput} type='text' placeholder='Enter your name here' className='form-control rounded-0' name='name' />
//                         {errors.name && <span className='text-danger'>{errors.name}</span>}
//                     </div>
//                     <div className='mb-3'>
//                         <label htmlFor='email'><strong>Email</strong></label>
//                         <input onChange={onhandleInput} type='email' placeholder='Enter your email address' className='form-control rounded-0' name='email' />
//                         {errors.email && <span className='text-danger'>{errors.email}</span>}
//                     </div>
//                     <div className='mb-3'>
//                         <label htmlFor='password'><strong>Password</strong></label>
//                         <input onChange={onhandleInput} type='password' placeholder='Enter your password' className='form-control rounded-0' name='password' />
//                         {errors.password && <span className='text-danger'>{errors.password}</span>}
//                     </div>
//                     <button type='submit' className='btn btn-success w-100 rounded-0'>Sign Up</button>
//                     <p>You agree to our terms and condition</p>
//                     <Link to='/' className='btn btn-danger w-100 rounded-0 '>Log in</Link>
//                 </form>
//             </div>
//         </div>
//     );
// }

// export default Signup;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signupvalidtion } from '../controllers/signupvalidation';
import axios from 'axios';

function Signup() {
    const [values, setValues] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState(""); // State to handle server errors
    const navigation = useNavigate();

    const onhandleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    };

    useEffect(() => {
        // Validate form inputs whenever values change
        setErrors(signupvalidtion(values));
    }, [values]);

    const onhandlesubmit = async (event) => {
        event.preventDefault();
        // Check if there are any validation errors
        if (Object.values(errors).every(error => error === '')) {
            try {
                const res = await axios.post('http://localhost:3001/signup', values);
                navigation('/'); // Navigate to login page after successful signup
            } catch (err) {
                if (err.response && err.response.data.msg) {
                    setServerError(err.response.data.msg); // Display server error message
                } else {
                    setServerError("An error occurred. Please try again.");
                }
            }
        }
    };

    return (
        <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
            <div className='bg-white p-3 rounded w-25'>
                <h2>Sign-Up</h2>
                <form onSubmit={onhandlesubmit}>
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
                    {serverError && <p className='text-danger'>{serverError}</p>}
                    <button type='submit' className='btn btn-success w-100 rounded-0'>Sign Up</button>
                    <p>You agree to our terms and condition</p>
                    <Link to='/' className='btn btn-danger w-100 rounded-0 '>Log in</Link>
                </form>
            </div>
        </div>
    );
}

export default Signup;

