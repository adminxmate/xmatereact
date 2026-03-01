import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// --- PRIVATE HELPERS ---
const saveAuthData = (data) => {
  if (data.token) {
    localStorage.setItem("token", data.token);
  }
  if (data.user) {
    localStorage.setItem("user", JSON.stringify(data.user));
  }
  window.dispatchEvent(
    new CustomEvent("auth-state-changed", { detail: { loggedIn: true } })
  );
};

// --- EXPORTED FUNCTIONS ---

export const verifyLogin = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}api/v1/auth/login`, {
      loginKey: email,
      password,
    });

    if (response.status === 200 && response.data.token) {
      saveAuthData(response.data);
      return { success: true, data: response.data };
    }
    return { success: false, message: response.data.message || "Invalid credentials" };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Login failed" };
  }
};

export const handleSSOCallback = async (code, provider = "google") => {
  try {
    const response = await axios.post(`${API_URL}api/v1/auth/${provider}/callback`, { code });

    if (response.status === 200 && response.data.token) {
      saveAuthData(response.data);
      return { success: true, data: response.data };
    }
    return { success: false, message: "SSO verification failed" };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "SSO Error" };
  }
};

export const loginWithSSO = (provider) => {
  window.location.href = `${API_URL}api/v1/auth/${provider}`;
};

export const registerUser = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}api/v1/auth/signup`, {
      username,
      email,
      password,
    });
    return { success: response.status === 201 || response.status === 200, data: response.data };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Registration failed" };
  }
};

export const requestPasswordReset = async (email) => {
  try {
    const response = await axios.post(
      `${API_URL}api/v1/auth/forgot-password`,
      { email },
      { headers: { "Content-Type": "application/json" } }
    );
    return {
      success: response.status === 200,
      message: response.data.message || "Check your email for reset link",
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to send reset link",
    };
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await axios.post(
      `${API_URL}api/v1/auth/reset-password`,
      { token, newPassword },
      { headers: { "Content-Type": "application/json" } }
    );
    return {
      success: response.status === 200,
      message: response.data.message || "Password reset successful",
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to reset password",
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
    return { valid: response.status === 200 && !!response.data.user, user: response.data.user };
  } catch {
    return { valid: false };
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.dispatchEvent(
    new CustomEvent("auth-state-changed", { detail: { loggedIn: false } })
  );
  window.location.href = "/";
};
