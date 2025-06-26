"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, User, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="w-full bg-gray-100 px-6 py-4">
      <div className="max-w-[80%] mx-auto flex items-center justify-between gap-6">
        {/* 1. Logo + Barra de busca */}
        <div className="flex items-center gap-4 flex-1 min-w-[200px]">
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
            <input
              type="search"
              placeholder="Pesquisar"
              className="w-full h-12 pl-4 pr-10 py-2 font-medium rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <button className="absolute h-12 w-12 top-1/2 right-0 -translate-y-1/2 bg-[#a30d0d] hover:bg-red-800 p-2 rounded-full flex items-center justify-center">
              <Search className="text-white h-6" />
            </button>
          </div>
        </div>

        {/* 2. Navegação central */}
        <nav className="hidden lg:flex items-center gap-10 flex-shrink-0">
          <Link href="/catalogo" className="text-lg text-gray-700 font-medium">Catálogo</Link>
          <Link href="/faq" className="text-lg text-gray-700 font-medium">FAQ</Link>
          <Link href="/contato" className="text-lg text-gray-700 font-medium">Contato</Link>
          <Link href="/sobre" className="text-lg text-gray-700 font-medium">Sobre a Loja</Link>
        </nav>

        {/* 3. Ícones */}
        <div className="flex items-center gap-4">
          <Button variant="link" className="text-gray-700">
            <ShoppingCart size={28}/>
          </Button>
          <Button variant="link" className="text-gray-700">
            <User size={28}/>
          </Button>
        </div>
      </div>
    </header>
  );
}
