import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://haves.co.in/api/v1',
  headers: { 'Content-Type': 'application/json' }
});

export const getHorses = async (search = '', page = 1) => {
  // Assuming the API supports pagination via 'page' and 'limit'
  const response = await apiClient.get(`/horses`, {
    params: {
      search: search,
      page: page,
      limit: 50
    }
  });
  return response.data; 
};