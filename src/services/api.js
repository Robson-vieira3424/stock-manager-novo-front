import axios from "axios";
import Cookies from "js-cookie"; // Importe o js-cookie para manter compatibilidade com seu AuthContext

const api = axios.create({
  baseURL: "http://localhost:8080", 
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptador para injetar o Token
api.interceptors.request.use((config) => {
  // Pega o token do Cookie (mesmo lugar onde o AuthContext salvou)
  const token = Cookies.get("token"); 
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;