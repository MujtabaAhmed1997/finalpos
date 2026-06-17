import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signupvalidtion } from '../controllers/signupvalidation';
import { authAPI } from '../service/apiClient';
import { FaUserPlus, FaEye, FaEyeSlash } from 'react-icons/fa';
import './Signup.css';

function Signup() {
    const [values, setValues] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigate();

    const onhandleInput = (event) => {
        const { name, value } = event.target;
        setValues(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        if (serverError) {
            setServerError("");
        }
    };

    useEffect(() => {
        // Validate form inputs whenever values change
        setErrors(signupvalidtion(values));
    }, [values]);

    const onhandlesubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setServerError("");
        
        // Check if there are any validation errors
        if (Object.values(errors).every(error => error === '')) {
            try {
                const res = await authAPI.signup(values);
                navigation('/'); // Navigate to login page after successful signup
            } catch (err) {
                if (err.response && err.response.data.msg) {
                    setServerError(err.response.data.msg); // Display server error message
                } else {
                    setServerError("An error occurred. Please try again.");
                }
            }
        }
        setIsLoading(false);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="signup-page">
            <div className="signup-card">
                <div className="text-center mb-4">
                    <div className="signup-brand-icon">
                        <FaUserPlus size={28} />
                    </div>
                    <h3 className="fw-bold signup-title" style={{ color: "#263043" }}>
                        Create Account
                    </h3>
                    <p className="text-muted mb-0" style={{ fontSize: 15 }}>
                        Join us and start managing your inventory
                    </p>
                </div>

                <form onSubmit={onhandlesubmit}>
                    {serverError && (
                        <div className="alert alert-danger" role="alert">
                            {serverError}
                        </div>
                    )}

                    <div className="mb-3">
                        <label htmlFor="name" className="signup-label">
                            Full Name
                        </label>
                        <input
                            type="text"
                            className="form-control signup-input"
                            name="name"
                            placeholder="Enter your full name"
                            value={values.name}
                            onChange={onhandleInput}
                        />
                        {errors.name && (
                            <span className="text-danger small">{errors.name}</span>
                        )}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="email" className="signup-label">
                            Email Address
                        </label>
                        <input
                            type="email"
                            className="form-control signup-input"
                            name="email"
                            placeholder="Enter your email address"
                            value={values.email}
                            onChange={onhandleInput}
                        />
                        {errors.email && (
                            <span className="text-danger small">{errors.email}</span>
                        )}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="signup-label">
                            Password
                        </label>
                        <div className="signup-password-field">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control signup-input"
                                name="password"
                                placeholder="Create a strong password"
                                value={values.password}
                                onChange={onhandleInput}
                            />
                            <button
                                type="button"
                                className="signup-password-toggle"
                                onClick={togglePasswordVisibility}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        <small className="signup-password-hint">
                            Minimum 8 characters with <strong>one capital letter (A-Z)</strong>, lowercase, and a number.
                            Example: <strong>Pakbrotherz123</strong>
                        </small>
                        {errors.password && (
                            <span className="text-danger small d-block mt-1">{errors.password}</span>
                        )}
                    </div>

                    <div className="mb-4">
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="termsCheck"
                                style={{ borderColor: "#263043" }}
                            />
                            <label className="form-check-label" htmlFor="termsCheck" style={{ fontSize: 14, color: "#6c757d" }}>
                                I agree to the <Link to="/terms" style={{ color: "#263043" }}>Terms and Conditions</Link>
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn w-100 signup-submit mb-3"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Creating Account...
                            </span>
                        ) : (
                            <>
                                <FaUserPlus className="me-2 mb-1" />
                                Create Account
                            </>
                        )}
                    </button>

                    <hr className="my-4" />

                    <div className="text-center">
                        <p className="text-muted mb-2" style={{ fontSize: 14 }}>
                            Already have an account?
                        </p>
                        <Link 
                            to="/" 
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
                            Sign In
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Signup;

