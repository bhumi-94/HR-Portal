import axios from "axios";
export const BACKEND_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/api\/?$/, "") ||
  "https://hr-portal-backend-3.onrender.com";
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
  (error) => Promise.reject(error),
);
export default apiClient;

//------ Code that needed to check locally ------//
// import axios from "axios";
// export const BACKEND_URL = (
//   "http://localhost:3000/api"
// ).replace(/\/api\/?$/, "");
// const apiClient = axios.create({
//   baseURL: "http://localhost:3000/api",
// });
// apiClient.interceptors.request.use(
//   (config) => {
//     const token =
//       localStorage.getItem("token") ||
//       sessionStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );
// export default apiClient;
