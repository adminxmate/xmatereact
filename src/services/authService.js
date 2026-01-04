import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const verifyLogin = async (email, password) => {
  try {
    const response = await axios.post(
      `${API_URL}api/v1/auth/login`,
      {
        loginKey: email,
        password,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const data = response.data;

    if (response.status === 200 && data.token) {
      localStorage.setItem("token", data.token);

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      return { success: true, data };
    } else {
      return {
        success: false,
        message: data.message || "Invalid credentials. Please try again.",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Invalid credentials",
    };
  }
};

export const verifyToken = async () => {
  const token = localStorage.getItem("token");
  if (!token) return { valid: false };

  try {
    const response = await axios.get(`${API_URL}api/v1/auth/userprofile`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 200 && response.data.user) {
      return { valid: true, user: response.data.user };
    } else {
      return { valid: false };
    }
  } catch {
    return { valid: false };
  }
};

// Logout
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  console.log("User after removal:", localStorage.getItem("user"));
  window.dispatchEvent(new CustomEvent("auth-state-changed", { detail: { loggedIn: false } }));
  window.location.href = "/";
};
