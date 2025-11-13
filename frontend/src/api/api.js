import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

if (!BACKEND_URL) {
  throw new Error("VITE_BACKEND_URL is not defined in environment variables!");
}


// Create an Axios instance
const api = axios.create({
  baseURL: `${BACKEND_URL}/api`, // automatically adds /api to all requests
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
