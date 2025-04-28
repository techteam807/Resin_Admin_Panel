import axios from "axios";


const axiosConfig = axios.create({
    // baseURL: import.meta.env.VITE_APP_BASE_URL,
    baseURL: "http://localhost:5000/",
    headers: {
      'Content-Type': 'application/json'
    }
  });

export default axiosConfig;