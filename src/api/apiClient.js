import axios from "axios";

export const BACKEND_URL = "http://localhost:3000";

const apiClient = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;