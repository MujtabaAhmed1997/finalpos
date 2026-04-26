import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../service/apiClient';
import Loginvalidation from '../controllers/loginvalidation';
import { FaSignInAlt, FaEye, FaEyeSlash } from 'react-icons/fa';

function Login() {
    const [values, setValues] = useState({
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigate();

    const handleInput = (event) => {
        const { name, value } = event.target;
        setValues(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        if (errorMessage) {
            setErrorMessage("");
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setErrorMessage("");
        
        const validationErrors = Loginvalidation(values);
        setErrors(validationErrors);

        if (Object.values(validationErrors).every(error => error === '')) {
            try {
                const response = await authAPI.login(values);
                if (response.data.message === 'Login successful') {
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                    navigation('/Homepage');
                } else {
                    setErrorMessage("Invalid email or password");
                }
            } catch (error) {
                console.error('Error logging in:', error);
                setErrorMessage(error.response?.data?.error || "An error occurred. Please try again later.");
            }
        }
        setIsLoading(false);
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div
            className="d-flex vh-100 justify-content-center align-items-center"
            style={{
                backgroundColor: "#263043",
            }}
        >
            <div
                className="rounded-4 shadow-lg p-5"
                style={{
                    minWidth: 400,
                    maxWidth: 450,
                    width: "100%",
                    border: "1px solid #404040",
                    background: "rgba(255,255,255,0.95)",
                    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
                }}
            >
                <div className="text-center mb-4">
                    <FaSignInAlt size={40} color="#263043" />
                    <h3 className="fw-bold mt-2" style={{ color: "#263043" }}>
                        Welcome Back
                    </h3>
                    <p className="text-muted" style={{ fontSize: 15 }}>
                        Sign in to access your account
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    {errorMessage && (
                        <div className="alert alert-danger" role="alert">
                            {errorMessage}
                        </div>
                    )}

                    <div className="mb-3">
                        <label htmlFor="email" className="form-label fw-semibold" style={{ color: "#263043" }}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            className="form-control rounded-3"
                            name="email"
                            placeholder="Enter your email address"
                            value={values.email}
                            onChange={handleInput}
                            style={{
                                background: "#f8f9fa",
                                border: "1px solid #dee2e6",
                                transition: "all 0.2s",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                            }}
                            onFocus={e => {
                                e.target.style.borderColor = "#263043";
                                e.target.style.boxShadow = "0 0 0 0.2rem rgba(38, 48, 67, 0.25)";
                            }}
                            onBlur={e => {
                                e.target.style.borderColor = "#dee2e6";
                                e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
                            }}
                        />
                        {errors.email && (
                            <span className="text-danger small">{errors.email}</span>
                        )}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="form-label fw-semibold" style={{ color: "#263043" }}>
                            Password
                        </label>
                        <div className="position-relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control rounded-3"
                                name="password"
                                placeholder="Enter your password"
                                value={values.password}
                                onChange={handleInput}
                                style={{
                                    background: "#f8f9fa",
                                    border: "1px solid #dee2e6",
                                    transition: "all 0.2s",
                                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                    paddingRight: "40px"
                                }}
                                onFocus={e => {
                                    e.target.style.borderColor = "#263043";
                                    e.target.style.boxShadow = "0 0 0 0.2rem rgba(38, 48, 67, 0.25)";
                                }}
                                onBlur={e => {
                                    e.target.style.borderColor = "#dee2e6";
                                    e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
                                }}
                            />
                            <button
                                type="button"
                                className="btn position-absolute"
                                style={{
                                    right: "10px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    background: "none",
                                    border: "none",
                                    color: "#6c757d"
                                }}
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {errors.password && (
                            <span className="text-danger small">{errors.password}</span>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="btn w-100 rounded-3 fw-bold mb-3"
                        disabled={isLoading}
                        style={{
                            background: "#263043",
                            border: "none",
                            fontSize: 18,
                            letterSpacing: 1,
                            boxShadow: "0 4px 12px rgba(38, 48, 67, 0.3)",
                            transition: "all 0.3s",
                            color: "white",
                        }}
                        onMouseOver={e => {
                            if (!isLoading) {
                                e.target.style.background = "#1a2332";
                                e.target.style.transform = "translateY(-2px)";
                                e.target.style.boxShadow = "0 6px 20px rgba(38, 48, 67, 0.4)";
                            }
                        }}
                        onMouseOut={e => {
                            if (!isLoading) {
                                e.target.style.background = "#263043";
                                e.target.style.transform = "translateY(0)";
                                e.target.style.boxShadow = "0 4px 12px rgba(38, 48, 67, 0.3)";
                            }
                        }}
                    >
                        {isLoading ? (
                            <span>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Signing In...
                            </span>
                        ) : (
                            <>
                                <FaSignInAlt className="me-2 mb-1" />
                                Sign In
                            </>
                        )}
                    </button>

                    <div className="text-center">
                        <Link 
                            to="/forgot-password" 
                            className="text-decoration-none"
                            style={{ color: "#263043", fontSize: 14 }}
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    <hr className="my-4" />

                    <div className="text-center">
                        <p className="text-muted mb-2" style={{ fontSize: 14 }}>
                            Don't have an account?
                        </p>
                        <Link 
                            to="/signup" 
                            className="btn btn-outline-secondary w-100 rounded-3"
                            style={{
                                borderColor: "#263043",
                                color: "#263043",
                                transition: "all 0.3s"
                            }}
                            onMouseOver={e => {
                                e.target.style.background = "#263043";
                                e.target.style.color = "white";
                            }}
                            onMouseOut={e => {
                                e.target.style.background = "transparent";
                                e.target.style.color = "#263043";
                            }}
                        >
                            Create Account
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
