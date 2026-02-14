import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api"
export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState(""); // Estado para mensagens de erro
  const [isLoggingIn, setIsLoggingIn] = useState(false); // Estado de loading


  const navigate = useNavigate();
  const { login } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoggingIn(true);

    try {
      

      const response = await api.
        post("/login", { email, senha });

        console.log("email:", email);
        console.log("senha:", senha);

        const data = response.data;

      // Chama o login do contexto
      login(data.user, data.token);

      // Redireciona para o dashboard
      navigate("/dashboard");

    } catch (err) {
      console.error("Erro no login:", err);

      // O Axios coloca a resposta do erro dentro de err.response
      if (err.response && err.response.data) {
        // Pega a mensagem exata que o Spring mandou (ex: "Credenciais inválidas")
        setError(err.response.data.message || "Acesso negado.");
      } else {
        setError("Falha na conexão com o servidor.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6 border border-gray-200">

        {/* Cabeçalho do Card */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Stock Manager</h1>
          <p className="text-gray-500 mt-2">Faça login para gerenciar seu estoque</p>
        </div>

        {/* Mensagem de Erro (só aparece se houver erro) */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Campo E-mail */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="admin@exemplo.com"
              required
            />
          </div>

          {/* Campo Senha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Botão de Submit */}
          <button
            type="submit"
            disabled={isLoggingIn}
            className={`w-full py-2.5 rounded-lg text-white font-semibold shadow-md transition-all duration-200
              ${isLoggingIn
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
              }`}
          >
            {isLoggingIn ? "Entrando..." : "Acessar Sistema"}
          </button>
        </form>

        <div className="text-center mt-4">
          <a href="#" className="text-sm text-blue-600 hover:underline">
            Esqueceu sua senha?
          </a>
        </div>
      </div>
    </div>
  );
}