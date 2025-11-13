import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;