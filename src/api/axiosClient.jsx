import axios from "axios";
import queryString from "query-string";
import { ACCESS_TOKEN } from "../constant/constant";
const axiosClient = axios.create({
  baseURL: "http://167.172.77.23:8080/api",
  // baseURL: "http://localhost:8080/api",
  headers: {
    "content-type": "application/json",
  },
  paramsSerializer: (params) => queryString.stringify(params),
  body: (params) => JSON.stringify(params),
});
axiosClient.interceptors.request.use(async (config) => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN);
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  } else {
  }
  return config;
});

export default axiosClient;
