import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: "http://localhost:4500",
  withCredentials: true,
 // 🔥 Required for rememberMe cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;