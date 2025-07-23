"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react";
import { useState } from "react";

const filters = {
  material: ["Inox", "Aço", "Ferro"],
  tipo: ["Aberta", "Fechada", "Maleta"],
  finalidade: ["Camping", "Churrasco", "Casa"],
  grelhas: ["1", "2", "3+"],
};

export default function CatalogFilters() {
  const [selected, setSelected] = useState({
    material: "",
    tipo: "",
    finalidade: "",
    grelhas: "",
  });

  const handleSelect = (key: keyof typeof selected, value: string) => {
    setSelected({ ...selected, [key]: value });
  };

  return (
    <div className="flex ml-[5%] flex-wrap gap-4 mb-6">
      {Object.entries(filters).map(([key, options]) => (
        <DropdownMenu key={key}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="text-sm font-medium bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200"
            >
              {key === "grelhas" ? "Qtd. de Grelhas" : capitalize(key)}{" "}
              <ChevronUp className="ml-1 w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {options.map((option) => (
              <DropdownMenuItem
                key={option}
                onClick={() => handleSelect(key as keyof typeof selected, option)}
              >
                {option}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ))}
    </div>
  );
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
