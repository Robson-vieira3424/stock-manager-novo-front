import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Login from "@/pages/login/Login"
import PrivateRoutes from "./private"
import DefaultLayout from "../layouts/defaultLayout"
import RotaProtegida from "../componentsRob/RotaProtegida/RotaProtegida"

import DashboardPage from "@/pages/protected/dashboard/Dashboard"
import ComputadoresPage from "@/pages/protected/computadores/Computadores"
import MovimentacoesPage from "@/pages/protected/movimentacoes/Movimentacoes"
import MapeamentoPage from "@/pages/protected/mapeamento/Mapeamento"
import ManutencaoPage from "@/pages/protected/manutencao/Manutencao"
import EstoquePage from "@/pages/protected/estoque/Estoque"
import DetalhesSecretaria from "@/pages/protected/detalheSec/DetalhesSec"
import FeedbackPage from "@/pages/protected/feedback/Feedback"
import ConfiguracoesPage from "@/pages/protected/configuracoes/ConfiguracoesPage"

const TODOS = ["ROLE_ADMIN", "ROLE_ESTOQUISTA", "ROLE_TECNICO", "ROLE_SUPERVISOR"];
const SO_ADMIN = ["ROLE_ADMIN"];
const ESTOQUE = ["ROLE_ADMIN", "ROLE_ESTOQUISTA"];
const MANUTENCAO = ["ROLE_ADMIN", "ROLE_TECNICO"];

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
      // ── Todos os perfis ──────────────────────────────
      {
        path: "/dashboard",
        element: <DashboardPage />,
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
        path: "/feedbacks",
        element: <FeedbackPage />,
      },

      // ── Admin + Estoquista ───────────────────────────
      {
        path: "/produtos",
        element: (
          <RotaProtegida permissoesPermitidas={ESTOQUE}>
            <EstoquePage />
          </RotaProtegida>
        ),
      },
      {
        path: "/movimentacoes",
        element: (
          <RotaProtegida permissoesPermitidas={ESTOQUE}>
            <MovimentacoesPage />
          </RotaProtegida>
        ),
      },

      // ── Admin + Técnico ──────────────────────────────
      {
        path: "/manutencao",
        element: (
          <RotaProtegida permissoesPermitidas={MANUTENCAO}>
            <ManutencaoPage />
          </RotaProtegida>
        ),
      },
      {
        path: "/computadores",
        element: (
          <RotaProtegida permissoesPermitidas={MANUTENCAO}>
            <ComputadoresPage />
          </RotaProtegida>
        ),
      },

      // ── Só Admin ────────────────────────────────────
      {
        path: "/configuracoes",
        element: (
          <RotaProtegida permissoesPermitidas={SO_ADMIN}>
            <ConfiguracoesPage />
          </RotaProtegida>
        ),
      },

      // ── Sem acesso ───────────────────────────────────
      {
        path: "/sem-acesso",
        element: (
          <div className="h-full flex flex-col items-center justify-center gap-3">
            <h1 className="text-3xl font-bold text-gray-800">Acesso Negado</h1>
            <p className="text-gray-500">Você não tem permissão para acessar esta página.</p>
            <a href="/dashboard" className="text-blue-600 hover:underline text-sm">
              Voltar ao Dashboard
            </a>
          </div>
        ),
      },
    ],
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
  },
]);

const Routers = () => <RouterProvider router={router} />;

export default Routers;