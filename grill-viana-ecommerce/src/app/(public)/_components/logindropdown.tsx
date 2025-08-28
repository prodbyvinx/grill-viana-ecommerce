"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import Image from "next/image";
import { User as UserIcon, Loader2 } from "lucide-react";

// ----------------- Auth Context (encapsula NextAuth) -----------------
interface AuthContextValue {
  isAuthenticated: boolean;
  loading: boolean;
  user: {
    id?: string | number;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
  } | null;
  login: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isAuthenticated = status === "authenticated";
  const loading = status === "loading";
  const user = (session?.user as any) ?? null;

  const login = () => router.push("/login");

  // ⬇️ ALTERE AQUI
  const logout = async () => {
    try {
      // 1) encerra sessão do NextAuth sem redirecionar automaticamente
      await signOut({ redirect: false });

      // 2) “guestiza” o carrinho no backend (troca/limpa cookie cartId)
      await fetch("/api/cart/on-logout", { method: "POST", cache: "no-store" });
    } catch (e) {
      // opcional: log/telemetria
      console.error("Erro no logout/on-logout:", e);
    } finally {
      // 3) agora sim, redireciona e dá refresh no cache do app router
      router.push("/");
      router.refresh();
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

// ---------------------- User Profile Dropdown ------------------------
export function UserProfileDropdown() {
  const { isAuthenticated, loading, user, login, logout } = useAuth();
  const [leaving] = React.useState(false);

  const logoutAction = async () => {
  try {
    await signOut({ redirect: false });                // encerra a sessão
    await fetch("/api/cart/on-logout", { method: "POST", cache: "no-store" }); // troca cookie
  } finally {
    router.push("/");
    router.refresh();
  }
};

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="link"
          className="relative cursor-pointer w-auto hover:text-red-800"
          aria-label="Conta do usuário"
        >
          <UserIcon />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-56 p-4 bg-white rounded-lg shadow-md"
        align="end"
      >
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 mb-2">
            {/* logotipo/placeholder de avatar */}
            <Image
              src={user?.image || "/images/black-circle-logo.png"}
              alt="Avatar/Logo"
              width={48}
              height={48}
              className="rounded-full object-cover"
            />
          </div>

          {loading && (
            <div className="flex items-center gap-2 py-2 text-sm text-gray-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              Carregando...
            </div>
          )}

          {!loading && !isAuthenticated && (
            <>
              <p className="text-gray-800 text-sm mb-4">Perfil sem conta</p>

              <Link
                href="/login"
                className="w-full flex items-center justify-center h-9 text-base font-medium bg-red-800 text-white hover:bg-red-700 rounded-md mb-2 transition-colors"
              >
                Iniciar sessão
              </Link>

              <Link
                href="/register"
                className="w-full flex items-center justify-center h-9 text-base font-medium bg-white text-red-800 border-2 border-red-800 hover:bg-red-800 hover:text-white rounded-md transition-colors"
              >
                Criar conta
              </Link>
            </>
          )}

          {!loading && isAuthenticated && (
            <>
              <div className="text-center mb-3">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name ?? "Minha conta"}
                </p>
                {user?.email && (
                  <p className="text-xs text-gray-500">{user.email}</p>
                )}
              </div>

              <div className="w-full space-y-2">
                <Link
                  href="/profile"
                  className="block w-full text-center text-sm py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Meu perfil
                </Link>
                <Link
                  href="/orders"
                  className="block w-full text-center text-sm py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Meus pedidos
                </Link>
                <Button
                  onClick={logoutAction}
                  disabled={leaving}
                  className="w-full h-9 bg-red-800 text-white hover:bg-red-700 rounded-md transition-colors cursor-pointer"
                >
                  {leaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sair"}
                </Button>
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}