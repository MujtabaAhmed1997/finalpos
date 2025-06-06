import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function Update() {
    const { id } = useParams();
    const [values, setValues] = useState({ name: "", email: "", role: "" });
    const navigate = useNavigate();

    const onhandleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const onhandlesubmit = (event) => {
        event.preventDefault();
        axios.put(`http://localhost:3001/api/usercurd/update/${id}`, values)
            .then(res => {
                navigate('/users');
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            });
    };

    useEffect(() => {
        axios.get(`http://localhost:3001/api/usercurd/read/${id}`)
            .then(res => {
                console.log(res);
                setValues(v => ({
                    ...v,
                    name: res.data[0].name,
                    email: res.data[0].email,
                    role: res.data[0].role
                }));
            })
            .catch(err => console.log(err));
    }, [id]);

    return (
        <div className='d-flex vh-100 justify-content-center align-items-center' style={{ backgroundColor: '#263043' }}>
            <div className='w-50 bg-white rounded p-3'>
                <form onSubmit={onhandlesubmit}>
                    <div className='mb-3'>
                        <label htmlFor='name'><strong>Name</strong></label>
                        <input onChange={onhandleInput} type='text' placeholder='Enter your name here' className='form-control rounded-0' name='name' value={values.name} />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='email'><strong>Email</strong></label>
                        <input onChange={onhandleInput} type='email' placeholder='Enter your email address' className='form-control rounded-0' name='email' value={values.email} />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='role'><strong>Role</strong></label>
                        <input onChange={onhandleInput} type='text' placeholder='Enter your role' className='form-control rounded-0' name='role' value={values.role} />
                    </div>
                    <button type='submit' className='btn btn-success w-100 rounded-0'>Submit</button>
                </form>
            </div>
        </div>
    );
}

export default Update;
