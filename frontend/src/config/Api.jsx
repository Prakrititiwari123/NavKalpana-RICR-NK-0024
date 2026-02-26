import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:4500",
  withCredentials: true,
});

const getAccessToken = () => {
  const rawToken =
    localStorage.getItem("accessToken") || localStorage.getItem("fitai_token");
  if (!rawToken) return null;

  try {
    const parsed = JSON.parse(rawToken);
    return typeof parsed === "string" ? parsed : rawToken;
  } catch {
    return rawToken;
  }
};

axiosInstance.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
