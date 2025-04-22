// src/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000', // or your deployed API URL
});

// Add JWT token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  console.log('Token:', token);
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Handle expired token or unauthorized access
API.interceptors.response.use(
  (response) => response, // If everything is fine, just return the response
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or unauthorized, clear the token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';  // Redirect to login page
    }
    return Promise.reject(error); // Handle other errors as usual
  }
);

export default API;
