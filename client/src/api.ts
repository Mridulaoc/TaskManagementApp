import axios from "axios";

const adminApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/admin`,
  withCredentials: true,
});

const userApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}`,
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
  const token = localStorage.getItem("jwtToken");
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
