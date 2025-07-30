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
    <div className="flex flex-wrap gap-4 mb-8 ml-[5%]">
      {/* Filtro de Categoria */}
      <div className="flex items-end">
        <Select
          value={filters.category ?? "all"}
          onValueChange={(val) =>
            onFilterChange("category", val === "all" ? undefined : val)
          }
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="inox">Inox</SelectItem>
            <SelectItem value="aço">Aço Galvanizado</SelectItem>
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
          className="w-32"
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
          className="w-32"
        />
      </div>
    </div>
  );
};

export default CatalogFilters;
