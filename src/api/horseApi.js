import axios from 'axios';

const API = axios.create({
  baseURL: 'https://haves.co.in/api/v1',
});

export const searchHorses = async (query = '', page = 1) => {
  try {
    const response = await API.get('/horses', {
      params: { search: query, page, limit: 50 }
    });
    const results = response.data?.data?.data || response.data?.data || [];
    return {
      data: results.map(h => ({
        id: h.id,
        name: h.name,
        foaling_date: h.foaling_date
      })),
      lastPage: response.data?.data?.last_page || 1
    };
  } catch (error) {
    return { data: [], lastPage: 1 };
  }
};

export const getDetailedHorses = async (params = {}) => {
  try {
    const response = await API.get('/horses', {
      params: { 
        limit: params.limit || 10,
        page: params.page || 1,
        search: params.search || '', 
      }
    });
    console.log(response);
    const rawData = response.data;
    const results = rawData?.data?.data || rawData?.data || rawData || [];
    const totalPages = rawData?.data?.last_page || 1;
    return {
      data: results,
      lastPage: totalPages || 1
    };
  } catch (error) {
    console.error("API Error:", error);
    return { data: [], lastPage: 1 };
  }
};