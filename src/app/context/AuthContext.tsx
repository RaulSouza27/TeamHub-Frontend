import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { loginService, logoutService } from "../services/auth";

export type UserRole = "colaborador" | "rh" | "gestor";

export interface User {
  id: string;
  name: string;
  username: string;
  email?: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Função auxiliar para decodificar o payload do JWT
function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = parseJwt(token);
      if (decoded) {
        setUser({
          id: "1", // Id genérico por enquanto
          name: decoded.sub || "Usuário",
          username: decoded.sub,
          role: (decoded.access_level || "colaborador") as UserRole,
        });
      }
    }
  }, []);

  const login = async (username: string, password: string) => {
    // O loginService lança erros caso não seja 200, que serão pegos pela tela de Login
    await loginService(username, password);

    // Decodifica o token salvo no localStorage para pegar os dados reais
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = parseJwt(token);
      if (decoded) {
        setUser({
          id: "1",
          name: decoded.sub || username,
          username: decoded.sub || username,
          role: (decoded.access_level || "colaborador") as UserRole, 
        });
      }
    }
  };

  const logout = () => {
    logoutService();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
