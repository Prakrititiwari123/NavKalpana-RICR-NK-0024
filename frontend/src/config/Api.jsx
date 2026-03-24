import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: "http://localhost:4500",  // ✅ Complete URL
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;