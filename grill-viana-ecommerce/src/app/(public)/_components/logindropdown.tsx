"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import Image from "next/image";
import { User as UserIcon } from "lucide-react";

// -- Auth Context -----------------------------------------------------
interface AuthContextValue {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

// -- User Profile Dropdown --------------------------------------------
export function UserProfileDropdown() {
  const { isAuthenticated, login } = useAuth();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="link" className="relative cursor-pointer w-auto hover:text-red-800">
          <UserIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-4 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 mb-2">
            {/* logotipo da empresa */}
            <Image src="/images/black-circle-logo.png" alt="Logo" width={48} height={48} />
          </div>
          <p className="text-gray-800 text-sm mb-4">
            {isAuthenticated ? "Meu Perfil" : "Perfil sem conta"}
          </p>
          {!isAuthenticated && (
            <>
              <Link
                href="/login"
                className="w-full flex items-center justify-center h-8 text-base font-medium bg-red-800 text-white hover:bg-red-700 py-2 rounded-md mb-2 cursor-pointer"
              >
                Iniciar sessão
              </Link>
              <Link
                href="/register"
                className="w-full flex items-center justify-center h-8 text-base font-medium  bg-white text-red-800 border-red-800 border-2 hover:bg-red-800 hover:text-white rounded-md cursor-pointer"
              >
                Criar conta
              </Link>
            </>
          )}
          {isAuthenticated && (
            <>
              {/* Aqui você pode adicionar links de perfil e botão de logout */}
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}