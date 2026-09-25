import axios from "axios";
export const BACKEND_URL = "https://hr-portal-backend-1-wm96.onrender.com";
const apiClient = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default apiClient;
