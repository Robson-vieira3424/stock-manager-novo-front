import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Login from "@/pages/login/Login"
import PrivateRoutes from "./private"
import DefaultLayout from "../layouts/defaultLayout" // Importe o layout que você criou

// Páginas
import DashboardPage from "@/pages/protected/dashboard/Dashboard"
import ComputadoresPage from "@/pages/protected/computadores/Computadores"
import MovimentacoesPage from "@/pages/protected/movimentacoes/Movimentacoes"
import MapeamentoPage from "@/pages/protected/mapeamento/Mapeamento"
import ManutencaoPage from "@/pages/protected/manutencao/Manutencao"
import EstoquePage from "@/pages/protected/estoque/Estoque"
import DetalhesSecretaria from "@/pages/protected/detalheSec/DetalhesSec"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    element: (
      <PrivateRoutes>
        <DefaultLayout /> 
      </PrivateRoutes>
    ),
    children: [
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/computadores",
        element: <ComputadoresPage />,
      },
      {
        path: "/movimentacoes",
        element: <MovimentacoesPage />,
      },
      {
        path: "/mapeamento",
        element: <MapeamentoPage />,
      },
      {
        path: "/mapeamento/:id", 
        element: <DetalhesSecretaria />,
      },
      {
        path: "/manutencao",
        element: <ManutencaoPage />,
      },
      {
        path: "/produtos",
        element: <EstoquePage />, // Notei que no path era produtos e o comp era Estoque
      },
    ]
  },
  {
    path: "*",
    element: (
      <div className="h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-gray-800">404</h1>
        <p className="text-gray-600">Página não encontrada</p>
        <a href="/" className="mt-4 text-blue-600 hover:underline">Voltar ao início</a>
      </div>
    ),
  }
]);

const Routers = () => {
  return <RouterProvider router={router} />;
};

export default Routers;