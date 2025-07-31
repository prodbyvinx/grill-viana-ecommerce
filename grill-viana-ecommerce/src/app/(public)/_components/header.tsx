"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, User, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchBar from "./searchbar";

export default function Header() {
  return (
    <header className="w-full bg-gray-50 px-6 py-4">
      <div className="max-w-[93%] mx-auto flex items-center justify-between gap-6">
        {/* 1. Logo + Barra de busca */}
        <div className="flex items-center gap-6 flex-1 min-w-[200px] flex-shrink-0">
          <Link href="/">
            <Image
              src="/images/black-logo.png"
              width={150}
              height={150}
              alt="Logo Grill Viana"
              priority
              quality={100}
            />
          </Link>
          <div className="relative w-full max-w-md">
            <SearchBar />
          </div>
        </div>

        {/* 2. Navegação central */}
        <nav className="hidden lg:flex items-center gap-10 flex-shrink-0 ">
          <Link
            href="/catalogo"
            className="text-md text-gray-700 hover:text-red-800 transition-all duration-[0.2s] font-medium"
          >
            Catálogo
          </Link>
          <Link
            href="/faq"
            className="text-md text-gray-700 hover:text-red-800 transition-all duration-[0.2s] font-medium"
          >
            FAQ
          </Link>
          <Link
            href="/contato"
            className="text-md text-gray-700 hover:text-red-800 transition-all duration-[0.2s] font-medium"
          >
            Contato
          </Link>
          <Link
            href="/sobre"
            className="text-md text-gray-700 hover:text-red-800 transition-all duration-[0.2s] font-medium"
          >
            Sobre a Loja
          </Link>
        </nav>

        {/* 3. Ícones */}
        <div className="flex items-center gap-4">
          <Button
            variant="link"
            className="text-gray-700 hover:text-red-800 transition-all duration-[0.2s] cursor-pointer"
          >
            <ShoppingCart size={24} strokeWidth={1.5} />
          </Button>
          <Button
            variant="link"
            className="text-gray-700 hover:text-red-800 transition-all duration-[0.2s] cursor-pointer"
          >
            <User size={24} strokeWidth={1.5} />
          </Button>
        </div>
      </div>
    </header>
  );
}
