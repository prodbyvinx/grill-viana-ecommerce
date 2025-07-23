"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="flex ml-[5%] my-8 items-center gap-1 text-gray-800 hover:text-red-800 transition-all duration-[0.2s] font-medium text-base cursor-pointer"
    >
      <ChevronLeft size={20} />
      Voltar
    </button>
  );
}