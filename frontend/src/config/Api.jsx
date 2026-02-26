import axios from 'axios';

const axiosInstance = axios.create({
 baseURL: "https://navkalpana-ricr-nk-0024.onrender.com",
  withCredentials: true,
 // 🔥 Required for rememberMe cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;