import axios from "axios";
import Cookies from "js-cookie"; // Importe o js-cookie para manter compatibilidade com seu AuthContext
/*
const api = axios.create({
  baseURL: "http://localhost:8080", 
  headers: {
    "Content-Type": "application/json",
  },
});
*/
/*
const api = axios.create({
  baseURL: "https://stock-manager-19c3.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});
*/
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("token");
      localStorage.removeItem("user_data");

      toast.error("Sua sessão expirou. Redirecionando para o login...", {
        duration: 3000,
      });

      setTimeout(() => {
        window.location.href = "/";
      }, 3000); // aguarda o toast antes de redirecionar
    }

    return Promise.reject(error);
  }
);
api.interceptors.request.use((config) => {
  const token = Cookies.get("token"); 
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
