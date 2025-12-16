import axios from 'axios';

const apiurl = import.meta.env.VITE_API_URL;

export const verifyLogin = async (username, password) => {
  try {
    const response = await axios.post(`${apiurl}login`, { 
      username, 
      password 
    });

    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
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

export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/';
};