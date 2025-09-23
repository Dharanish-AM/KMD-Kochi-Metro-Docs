// utils/axiosInstance.js
import axios from "axios";
import { getToken } from "./token";
import apiurl from "../../../api";
const axiosInstance = axios.create({
  baseURL: "http://localhost:8000", // change to your API base
  // baseURL: apiurl,
});

// Add token automatically for each request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
