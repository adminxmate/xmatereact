import axios from "axios";

const apiurl = import.meta.env.VITE_API_URL;

const API = axios.create({
  baseURL: `${apiurl}api/v1`,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
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

      window.dispatchEvent(new CustomEvent("open-login-modal"));

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
      const token = localStorage.getItem("token");
      window.removeEventListener("login-success", onLogin);
      resolve(token);
    };
    window.addEventListener("login-success", onLogin);
  });
}

export const searchHorses = async ({ query = "", page = 1, limit = 50 }) => {
  try {
    const response = await API.get("/horsesearch", {
      params: {
        search: query.trim(),
        page,
        limit,
      },
    });

    const payload = response.data;

    let horses = [];
    let lastPage = 1;

    if (payload?.data?.data) {
      horses = payload.data.data;
      lastPage = payload.data.last_page || payload.data.total_pages || 1;
    } else if (payload?.data && payload?.last_page) {
      horses = payload.data;
      lastPage = payload.last_page;
    } else if (payload?.data && Array.isArray(payload.data)) {
      horses = payload.data;
      lastPage = payload.last_page || payload.total_pages || 1;
    } else if (Array.isArray(payload)) {
      horses = payload;
      lastPage = 1;
    }

    const normalizedHorses = horses
      .map((horse) => {
        let year = null;
        const rawDate = horse.foaling_date || horse.foalingDate || horse.year || null;
        if (rawDate) {
          const d = new Date(rawDate);
          if (!isNaN(d.getTime())) {
            year = d.getFullYear();
          } else if (/^\d{4}$/.test(rawDate)) {
            year = parseInt(rawDate, 10);
          }
        }
        return {
          id: horse.id || horse._id,
          name: (horse.name || horse.horse_name || "").trim(),
          foalingYear: year,
        };
      })
      .filter((h) => h.name);

    return {
      data: normalizedHorses,
      lastPage,
      hasMore: page < lastPage,
    };
  } catch (error) {
    console.error("Horse search failed:", error);
    return {
      data: [],
      lastPage: 1,
      hasMore: false,
    };
  }
};

export const getDetailedHorses = async ({ page = 1, limit = 10, search = "" }) => {
  try {
    const response = await API.get("/horses", {
      params: { page, limit, search },
    });

    const payload = response.data;
    let horses = [];
    let lastPage = 1;

    if (payload?.data?.data) {
      horses = payload.data.data;
      lastPage = payload.data.last_page || 1;
    } else if (payload?.data) {
      horses = payload.data;
      lastPage = payload.last_page || payload.total_pages || 1;
    } else if (Array.isArray(payload)) {
      horses = payload;
      lastPage = 1;
    }

    return {
      data: horses,
      lastPage,
      hasMore: page < lastPage,
    };
  } catch (error) {
    console.error("Detailed horses fetch failed:", error);
    return { data: [], lastPage: 1, hasMore: false };
  }
};

export default API;
