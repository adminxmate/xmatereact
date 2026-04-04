import axios from "axios";

const apiurl = import.meta.env.VITE_API_URL;
// Ensure no redundant slashes: strip trailing / from apiurl if present.
const cleanApiUrl = apiurl?.endsWith("/") ? apiurl.slice(0, -1) : apiurl;

const API = axios.create({
  baseURL: `${cleanApiUrl}/api/v1`,
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
    const isAuthPath = originalRequest.url?.includes("/auth/");
    
    // Log for debugging
    if (error.response?.status === 401) {
      console.warn(`[API] 401 Unauthorized: ${originalRequest.url}`, {
        hasToken: !!localStorage.getItem("token"),
        isAuthPath
      });
    }

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthPath) {
      originalRequest._retry = true;

      // Only dispatch if not already refreshing
      if (!window.__is_auth_refreshing) {
        window.__is_auth_refreshing = true;
        window.dispatchEvent(new CustomEvent("open-login-modal", { detail: { reason: "auto" }}));
      }

      const newToken = await waitForToken();
      window.__is_auth_refreshing = false;

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
    const onLoginSuccess = () => {
      const token = localStorage.getItem("token");
      cleanup();
      resolve(token);
    };

    const cleanup = () => {
      window.removeEventListener("login-success", onLoginSuccess);
      window.removeEventListener("auth-state-changed", onAuthStateChange);
    };

    const onAuthStateChange = (e) => {
      if (e.detail?.loggedIn) {
        const token = localStorage.getItem("token");
        cleanup();
        resolve(token);
      }
    };

    window.addEventListener("login-success", onLoginSuccess);
    window.addEventListener("auth-state-changed", onAuthStateChange);
    
    // Safety timeout
    setTimeout(() => {
      cleanup();
      resolve(null);
    }, 60000); // 1 minute
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

export const getRealPedigree = async (horseId, gen = 3) => {
  try {
    const response = await API.get("/horses/real", {
      params: { horseid: horseId, gen },
    });
    return response.data;
  } catch (error) {
    console.error("Real pedigree fetch failed:", error);
    throw error;
  }
};

export const getHypotheticalPedigree = async (sireId, damId) => {
  try {
    const response = await API.get("/horses/hypo", {
      params: { sireid: sireId, damid: damId },
    });
    return response.data;
  } catch (error) {
    console.error("Hypothetical pedigree fetch failed:", error);
    throw error;
  }
};

export const getHorsePedigree = async (id) => {
  try {
    const response = await API.get(`/horses/${id}/pedigree`);
    return response.data;
  } catch (error) {
    console.error("Horse pedigree fetch failed:", error);
    throw error;
  }
};

export const createHorse = async (horseData) => {
  try {
    const response = await API.post("/horses", horseData);
    return response.data;
  } catch (error) {
    console.error("Create horse failed:", error);
    throw error;
  }
};

export const updateHorse = async (id, horseData) => {
  try {
    const response = await API.put(`/horses/${id}`, horseData);
    return response.data;
  } catch (error) {
    console.error("Update horse failed:", error);
    throw error;
  }
};

export const deleteHorse = async (id) => {
  try {
    const response = await API.delete(`/horses/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete horse failed:", error);
    throw error;
  }
};

export default API;
