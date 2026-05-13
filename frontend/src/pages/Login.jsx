import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../service/apiClient';
import Loginvalidation from '../controllers/loginvalidation';
import { FaSignInAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import './Login.css';

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

        try {
            if (Object.values(validationErrors).every(error => error === '')) {
                const response = await authAPI.login(values);
                if (response.data.message === 'Login successful') {
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                    navigation('/Homepage');
                } else {
                    setErrorMessage("Invalid email or password");
                }
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setErrorMessage(error.response?.data?.error || "An error occurred. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="login-page">
            <div className="login-card shadow-lg p-4 p-sm-5">
                <div className="text-center mb-4">
                    <div className="login-brand-icon" aria-hidden>
                        <FaSignInAlt size={22} />
                    </div>
                    <h1 className="h4 fw-bold mb-1" style={{ color: '#263043' }}>
                        Welcome back
                    </h1>
                    <p className="text-muted small mb-0">
                        Sign in to access your account
                    </p>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    {errorMessage && (
                        <div className="alert alert-danger py-2 small" role="alert">
                            {errorMessage}
                        </div>
                    )}

                    <div className="mb-3">
                        <label htmlFor="email" className="form-label login-label">
                            Email address
                        </label>
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            className="form-control login-input"
                            name="email"
                            placeholder="you@example.com"
                            value={values.email}
                            onChange={handleInput}
                        />
                        {errors.email && (
                            <span className="text-danger small d-block mt-1">{errors.email}</span>
                        )}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="form-label login-label">
                            Password
                        </label>
                        <div className="login-password-field">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                className="form-control login-input"
                                name="password"
                                placeholder="Enter your password"
                                value={values.password}
                                onChange={handleInput}
                            />
                            <button
                                type="button"
                                className="login-password-toggle"
                                onClick={() => setShowPassword((v) => !v)}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                tabIndex={0}
                            >
                                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                            </button>
                        </div>
                        {errors.password && (
                            <span className="text-danger small d-block mt-1">{errors.password}</span>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="btn w-100 login-submit mb-3"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="d-inline-flex align-items-center justify-content-center gap-2">
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                                Signing in…
                            </span>
                        ) : (
                            <span className="d-inline-flex align-items-center justify-content-center gap-2">
                                <FaSignInAlt />
                                Sign in
                            </span>
                        )}
                    </button>

                    <div className="text-center">
                        <Link
                            to="/forgot-password"
                            className="text-decoration-none small"
                            style={{ color: '#263043' }}
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <hr className="my-4 text-muted opacity-25" />

                    <div className="text-center">
                        <p className="text-muted small mb-2">Don&apos;t have an account?</p>
                        <Link
                            to="/signup"
                            className="btn btn-outline-secondary w-100 rounded-3"
                            style={{ borderColor: '#263043', color: '#263043' }}
                        >
                            Create account
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
