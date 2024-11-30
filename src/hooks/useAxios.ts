import axios from "axios";
import { API_LINK } from "./useEnv";

const axiosInstance = axios.create({
  baseURL: API_LINK,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const useAxios = () => {
  return axiosInstance;
};
