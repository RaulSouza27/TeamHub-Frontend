import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/layouts/RootLayout";
import { Login } from "./components/pages/Login";
import { Dashboard } from "./components/pages/Dashboard";
import { Admissao } from "./components/pages/Admissao";
import { Onboarding } from "./components/pages/Onboarding";
import { Comunicacao } from "./components/pages/Comunicacao";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Dashboard,
      },
      {
        path: "admissao",
        Component: Admissao,
      },
      {
        path: "onboarding",
        Component: Onboarding,
      },
      {
        path: "comunicacao",
        Component: Comunicacao,
      },
    ],
  },
]);
