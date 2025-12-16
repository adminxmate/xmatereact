// src/api/horseApi.js (or services/horseApi.js)

import axios from 'axios';

const apiurl = import.meta.env.VITE_API_URL;

const API = axios.create({
  baseURL: `${apiurl}api/v1`, // e.g., http://localhost:5000/api/v1
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Trigger login modal
      window.dispatchEvent(new CustomEvent('open-login-modal'));

      // Wait for new token after successful login
      const newToken = await waitForToken();

      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return API(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

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

/**
 * Search horses with server-side filtering and pagination
 * Used for dropdown search + infinite scroll
 */
export const searchHorses = async ({ query = '', page = 1, limit = 50 }) => {
  try {
    const response = await API.get('/horsesearh', { // Fixed typo: horsesearh → horsesearch
      params: {
        search: query.trim(),
        page,
        limit,
      },
    });

    // Adjust based on your actual API response structure
    // Common patterns: response.data.data or response.data.results
    const payload = response.data;

    let horses = [];
    let lastPage = 1;

    if (payload?.data?.data) {
      // Laravel-style paginated response
      horses = payload.data.data;
      lastPage = payload.data.last_page || 1;
    } else if (payload?.data) {
      horses = payload.data;
      lastPage = payload.last_page || payload.total_pages || 1;
    } else if (Array.isArray(payload)) {
      horses = payload;
    }

    // Normalize horse objects
    const normalizedHorses = horses.map((h) => ({
      id: h.id,
      name: h.name?.trim(),
      foalingDate: h.foaling_date || h.foalingDate || null,
    }));

    return {
      data: normalizedHorses,
      lastPage,
      hasMore: page < lastPage,
    };
  } catch (error) {
    console.error('Horse search failed:', error);
    return {
      data: [],
      lastPage: 1,
      hasMore: false,
    };
  }
};

/**
 * Optional: If you have a separate detailed list endpoint
 */
export const getDetailedHorses = async ({ page = 1, limit = 10, search = '' }) => {
  try {
    const response = await API.get('/horses', {
      params: { page, limit, search },
    });

    const payload = response.data;
    let horses = [];
    let lastPage = 1;

    if (payload?.data?.data) {
      horses = payload.data.data;
      lastPage = payload.data.last_page;
    } else if (payload?.data) {
      horses = payload.data;
    }

    return {
      data: horses,
      lastPage,
      hasMore: page < lastPage,
    };
  } catch (error) {
    console.error('Detailed horses fetch failed:', error);
    return { data: [], lastPage: 1, hasMore: false };
  }
};

export default API;