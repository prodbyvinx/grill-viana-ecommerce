import * as React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export type Filters = {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  type?: string;
  finalidade?: string;
};

interface CatalogFiltersProps {
  filters: Filters;
  onFilterChange: (field: keyof Filters, value?: string | number) => void;
}

const CatalogFilters: React.FC<CatalogFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  return (
    <div className="flex flex-wrap gap-4 mb-8">
      {/* Filtro de Material */}
      <div className="flex flex-col">
        <label htmlFor="minPrice" className="text-sm font-medium mb-1">
          Material
        </label>
        <Select
          value={filters.category ?? "all"}
          onValueChange={(val) =>
            onFilterChange("category", val === "all" ? undefined : val)
          }
        >
          <SelectTrigger className="w-48 bg-white">
            <SelectValue placeholder="Material" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="inox">Inox</SelectItem>
            <SelectItem value="aço">Aço Galvanizado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Filtro de Tipo */}
      <div className="flex flex-col">
        <label htmlFor="minPrice" className="text-sm font-medium mb-1">
          Tipo de Fundo
        </label>
        <Select
          value={filters.type ?? "all"}
          onValueChange={(val) =>
            onFilterChange("type", val === "all" ? undefined : val)
          }
        >
          <SelectTrigger className="w-48 bg-white">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="fechada">Fechada</SelectItem>
            <SelectItem value="aberta">Aberta</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Filtro de Finalidade */}
      <div className="flex flex-col">
        <label htmlFor="minPrice" className="text-sm font-medium mb-1">
          Finalidade
        </label>
        <Select
          value={filters.finalidade ?? "all"}
          onValueChange={(val) =>
            onFilterChange("finalidade", val === "all" ? undefined : val)
          }
        >
          
          <SelectTrigger className="w-48 bg-white">
            <SelectValue placeholder="Finalidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="casual">Casual</SelectItem>
            <SelectItem value="profissional">Profissional</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Filtro de Preço Mínimo */}
      <div className="flex flex-col">
        <label htmlFor="minPrice" className="text-sm font-medium mb-1">
          Preço Mínimo
        </label>
        <Input
          id="minPrice"
          type="number"
          placeholder="R$ 0,00"
          value={filters.minPrice ?? ""}
          onChange={(e) =>
            onFilterChange(
              "minPrice",
              e.target.value ? Number(e.target.value) : undefined
            )
          }
          className="w-32 bg-white"
        />
      </div>

      {/* Filtro de Preço Máximo */}
      <div className="flex flex-col">
        <label htmlFor="maxPrice" className="text-sm font-medium mb-1">
          Preço Máximo
        </label>
        <Input
          id="maxPrice"
          type="number"
          placeholder="R$ 0,00"
          value={filters.maxPrice ?? ""}
          onChange={(e) =>
            onFilterChange(
              "maxPrice",
              e.target.value ? Number(e.target.value) : undefined
            )
          }
          className="w-32 bg-white"
        />
      </div>
    </div>
  );
};

export default CatalogFilters;
