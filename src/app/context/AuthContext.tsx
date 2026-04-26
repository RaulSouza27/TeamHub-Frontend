import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "colaborador" | "rh" | "gestor";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // Simulação de autenticação - em produção, conectar com API real
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock de usuários para demonstração
    const mockUsers: Record<string, User> = {
      "colaborador@teamhub.com": {
        id: "1",
        name: "João Silva",
        email: "colaborador@teamhub.com",
        role: "colaborador",
      },
      "rh@teamhub.com": {
        id: "2",
        name: "Maria Santos",
        email: "rh@teamhub.com",
        role: "rh",
      },
      "gestor@teamhub.com": {
        id: "3",
        name: "Carlos Oliveira",
        email: "gestor@teamhub.com",
        role: "gestor",
      },
    };

    const foundUser = mockUsers[email];
    if (foundUser && password === "123456") {
      setUser(foundUser);
    } else {
      throw new Error("Credenciais inválidas");
    }
  };

  const logout = () => {
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
