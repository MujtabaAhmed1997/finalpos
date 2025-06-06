// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import Loginvalidation from '../controllers/loginvalidation';

// function Login() {
//     const [values, setValues] = useState({
//         email: "",
//         password: ""
//     });

//     const [errors, setErrors] = useState({});
//     const [errorMessage, setErrorMessage] = useState(""); // State for displaying error message
//     const navigation = useNavigate();

//     const handleInput = (event) => {
//         setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
//     }

//     const handleSubmit = async (event) => {
//         event.preventDefault();
//         setErrors(Loginvalidation(values));

//         if (errors.email === '' && errors.password === '') {
//             try {
//                 const response = await axios.post('http://localhost:3001/login', values);
//                 if (response.data.message === 'Login successful') {
                  
//                     navigation('/Homepage');
//                 } else {
//                     setErrorMessage("Invalid email or password");
//                 }
//             } catch (error) {
//                 console.error('Error logging in:', error);
//                 setErrorMessage("An error occurred. Please try again later.");
//             }
//         }
//     }

//     return (
//         <div className='d-flex justify-content-center align-items-center  vh-100' style={{backgroundColor: '#1d2634'}}>
//             <div className='bg-white p-3 rounded w-25'>
//                 <h2>Sign-In</h2>
//                 <form onSubmit={handleSubmit}>
//                     <div className='mb-3'>
//                         <label htmlFor='email'><strong>Email</strong></label>
//                         <input onChange={handleInput} type='email' placeholder='Enter your email address' name='email' className='form-control rounded-0' />
//                         {errors.email && <span className='text-danger'>{errors.email}</span>}
//                     </div>
//                     <div className='mb-3'>
//                         <label htmlFor='password'><strong>Password</strong></label>
//                         <input onChange={handleInput} type='password' placeholder='Enter your password' className='form-control rounded-0' name='password' />
//                         {errors.password && <span className='text-danger'>{errors.password}</span>}
//                     </div>
//                     {errorMessage && <p className="text-danger">{errorMessage}</p>}
//                     <button type='submit' className='btn btn-success w-100 rounded-0'>Log in</button>
//                     <p>forgot password</p>
//                     <Link to='/signup' className='btn btn-danger w-100 rounded-0'>Create Account</Link>
//                 </form>
//             </div>
//         </div>
//     );
// }

// export default Login;




import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loginvalidation from '../controllers/loginvalidation';

function Login() {
    const [values, setValues] = useState({
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState(""); // State for displaying error message
    const navigation = useNavigate();

    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const validationErrors = Loginvalidation(values);
        setErrors(validationErrors);

        if (Object.values(validationErrors).every(error => error === '')) {
            try {
                const response = await axios.post('http://localhost:3001/api/users/login', values);
                if (response.data.message === 'Login successful') {
                    // Save the JWT token for authenticated requests
                    localStorage.setItem('authToken', response.data.token);
                    navigation('/Homepage');
                } else {
                    setErrorMessage("Invalid email or password");
                }
            } catch (error) {
                console.error('Error logging in:', error);
                setErrorMessage(error.response?.data?.error || "An error occurred. Please try again later.");
            }
        }
    }

    return (
        <div className='d-flex justify-content-center align-items-center  vh-100' style={{backgroundColor: '#1d2634'}}>
            <div className='bg-white p-3 rounded w-25'>
                <h2>Sign-In</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor='email'><strong>Email</strong></label>
                        <input onChange={handleInput} type='email' placeholder='Enter your email address' name='email' className='form-control rounded-0' />
                        {errors.email && <span className='text-danger'>{errors.email}</span>}
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='password'><strong>Password</strong></label>
                        <input onChange={handleInput} type='password' placeholder='Enter your password' className='form-control rounded-0' name='password' />
                        {errors.password && <span className='text-danger'>{errors.password}</span>}
                    </div>
                    {errorMessage && <p className="text-danger">{errorMessage}</p>}
                    <button type='submit' className='btn btn-success w-100 rounded-0'>Log in</button>
                    <p>forgot password</p>
                    <Link to='/signup' className='btn btn-danger w-100 rounded-0'>Create Account</Link>
                </form>
            </div>
        </div>
    );
}

export default Login;
