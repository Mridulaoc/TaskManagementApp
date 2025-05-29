import axios from "axios";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://tasktribe.livewave.ru";
const adminApi = axios.create({
  baseURL: `${API_BASE_URL}/admin`,
  withCredentials: true,
});

const userApi = axios.create({
  baseURL: `${API_BASE_URL}`,
  withCredentials: true,
});
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

userApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("userToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// const generalErrorInterceptor = (error: unknown) => {};

// adminApi.interceptors.response.use(
//   (response) => response,
//   generalErrorInterceptor
// );

// userApi.interceptors.response.use(
//   (response) => response,
//   generalErrorInterceptor
// );

export { adminApi, userApi };
