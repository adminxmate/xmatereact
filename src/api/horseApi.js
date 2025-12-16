import axios from 'axios';

const apiurl = import.meta.env.VITE_API_URL;

const API = axios.create({
  baseURL: `${apiurl}api/v1`,
});

// --- AUTHENTICATION INTERCEPTORS ---

// 1. Request Interceptor: Attach token to every call
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 2. Response Interceptor: Catch 401s and trigger UI Modal
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the server returns 401, we trigger the login flow
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Notify the UI (LoginModal.jsx) to show up
      window.dispatchEvent(new CustomEvent('open-login-modal'));

      // Wait for the 'login-success' event before continuing
      const newToken = await waitForToken();
      
      if (newToken) {
        // Update headers with the fresh token and retry the original call
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return API(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

// Helper to pause execution until the user completes the Tailwind login form
function waitForToken() {
  return new Promise((resolve) => {
    const onLogin = () => {
      const token = localStorage.getItem('token');
      window.removeEventListener('login-success', onLogin);
      resolve(token);
    };
    window.addEventListener('login-success', onLogin);
  });
}

// --- HORSE API FUNCTIONS ---

/**
 * Searches for horses with pagination (Interceptors handle 401 automatically)
 */
export const searchHorses = async (query = '', page = 1) => {
  try {
    const response = await API.get('/horses/search', {
      params: { search: query, page, limit: 50 }
    });
    
    // Flatten the data structure based on your typical API response
    const results = response.data?.data?.data || response.data?.data || [];
    
    return {
      data: results.map(h => ({
        id: h.id,
        name: h.name,
        foaling_date: h.foaling_date || h.foalingDate // Handles both naming conventions
      })),
      lastPage: response.data?.data?.last_page || 1
    };
  } catch (error) {
    console.error("Search Error:", error);
    return { data: [], lastPage: 1 };
  }
};

/**
 * Gets a detailed list of horses with filtering
 */
export const getDetailedHorses = async (params = {}) => {
  try {
    const response = await API.get('/horses', {
      params: { 
        limit: params.limit || 10,
        page: params.page || 1,
        search: params.search || '', 
      }
    });

    const rawData = response.data;
    // Normalized extraction logic
    const results = rawData?.data?.data || rawData?.data || rawData || [];
    const totalPages = rawData?.data?.last_page || 1;
    
    return {
      data: results,
      lastPage: totalPages || 1
    };
  } catch (error) {
    console.error("Detailed Fetch Error:", error);
    return { data: [], lastPage: 1 };
  }
};

export default API;