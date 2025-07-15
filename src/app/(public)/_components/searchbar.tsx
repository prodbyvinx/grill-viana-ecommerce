"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Search } from "lucide-react";

export default function SearchBar() {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Buscando por: ${value}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full max-w-md flex items-center"
    >
      <Input
        type="text"
        placeholder="Buscar..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pr-20 pl-4 h-12 rounded-full bg-white text-gray-900 border border-gray-200 appearance-none focus:outline-none"
      />

      {value && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setValue("")}
          className="absolute right-16 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-black"
        >
          <X size={16} />
        </Button>
      )}

      <Button
        type="submit"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 h-12 w-12 bg-red-800 hover:bg-red-700 cursor-pointer text-white rounded-full"
      >
        <Search size={16} />
      </Button>
    </form>
  );
}
