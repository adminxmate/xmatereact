import axios from 'axios';

const API = axios.create({
  baseURL: 'https://haves.co.in/api/v1',
});

export const fetchHorses = async (params = {}) => {
  try {
    const response = await API.get('/horses', {
      params: {
        limit: params.limit || 10,
        page: params.page || 1,
        search: params.search || '',
      }
    });

    // Handle nested response structures common in Laravel/PHP APIs
    const rawData = response.data;
    const results = rawData?.data?.data || rawData?.data || rawData || [];
    const totalPages = rawData?.data?.last_page || 1;

    return { 
      data: Array.isArray(results) ? results : [], 
      lastPage: totalPages 
    };
  } catch (error) {
    console.error("API Error:", error);
    return { data: [], lastPage: 1 };
  }
};