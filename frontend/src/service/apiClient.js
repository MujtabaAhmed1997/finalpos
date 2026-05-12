import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://pakbrotherz.com/api';

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid, clear storage and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

// Auth endpoints
export const authAPI = {
    login: (credentials) => apiClient.post('/users/login', credentials),
    signup: (userData) => apiClient.post('/users/signup', userData),
};

// Generic GET request
export const get = (endpoint, config = {}) => apiClient.get(endpoint, config);

// Generic POST request
export const post = (endpoint, data, config = {}) => apiClient.post(endpoint, data, config);

// Generic PUT request
export const put = (endpoint, data, config = {}) => apiClient.put(endpoint, data, config);

// Generic DELETE request
export const delete_ = (endpoint, config = {}) => apiClient.delete(endpoint, config);

// Export the main client for advanced usage
export default apiClient;
