import axios from 'axios';

const apiurl = import.meta.env.VITE_API_URL;

/**
 * Pure login function using base axios to avoid interceptor loops
 */
export const verifyLogin = async (username, password) => {
  try {
    // We use a fresh axios call here, NOT your custom API instance
    const response = await axios.post(`${apiurl}login`, { 
      username, 
      password 
    });

    if (response.data.token) {
      // 1. Save the new token for future requests
      localStorage.setItem('token', response.data.token);
      
      // 2. Dispatch the success event to the API interceptor
      window.dispatchEvent(new CustomEvent('login-success'));
      
      return { success: true, user: response.data.user };
    }
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || "Invalid credentials" 
    };
  }
};

/**
 * Cleanly remove token and refresh the page or redirect
 */
export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/'; // Simple redirect to home
};