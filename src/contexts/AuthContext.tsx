import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Cookies from "js-cookie";

// Defina a tipagem do seu Usuário (ajuste conforme o que sua API retorna)
interface User {
  id?: string;
  email: string;
  nome?: string;
  role?: string;
}

// Tipagem das funções e dados disponíveis no contexto
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Component
export const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Para não renderizar a tela antes de checar o token

  // Ao carregar a página, verifica se já existe token e restaura a sessão
  useEffect(() => {
    const token = Cookies.get("token");
    const storedUser = localStorage.getItem("user_data");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    
    setLoading(false);
  }, []);

  // Função de Login
  const login = (userData: User, token: string) => {
    Cookies.set("token", token, { expires: 1 }); // Expira em 1 dia
    localStorage.setItem("user_data", JSON.stringify(userData)); // Salva dados não sensíveis
    
    setUser(userData);
    setIsAuthenticated(true);
  };

  // Função de Logout
  const logout = () => {
    Cookies.remove("token");
    localStorage.removeItem("user_data");
    
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = "/"; // Força o redirecionamento
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para facilitar o uso
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um ContextProvider");
  }
  return context;
};