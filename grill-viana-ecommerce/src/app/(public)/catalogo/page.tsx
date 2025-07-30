"use client";

import * as React from "react";
import { useState, useMemo, useEffect } from "react";
import CatalogFilters, { Filters } from "@/app/(public)/catalogo/_components/catalogfilters";
import ProductCard, { Product } from "@/app/(public)/_components/productcard";
import Header from "../_components/header";
import CatalogContent from "./_components/catalogcontent";
import BackButton from "../_components/backbutton";

export default function CatalogPage() {
  const [filters, setFilters] = useState<Filters>({});
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("@/app/(public)/catalogo/data/products.json")
      .then((res) => res.json())
      .then((data: Product[]) => setProducts(data));
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (filters.category && p.category !== filters.category) return false;
      if (filters.minPrice != null && p.price < filters.minPrice) return false;
      if (filters.maxPrice != null && p.price > filters.maxPrice) return false;
      return true;
    });
  }, [products, filters]);

  return (
    <>
      <section className="bg-gray-100 h-[100vh]">
        <Header />
        <BackButton />
        <div className="w-full flex justify-center items-center my-8">
          <div className="flex w-[70%] flex-col text-center gap-3">
            <h1 className="text-3xl font-bold">
              Nosso <span className="text-red-800">Catálogo</span>
            </h1>
            <p className="text-base">
              Modelos para todos os estilos e espaços, da varanda ao quintal.{" "}
              <span className="font-semibold">
                Qualidade, praticidade e sabor reunidos em um só lugar
              </span>
              .
            </p>
          </div>
        </div>

        <div className="container mx-auto p-4">
          <CatalogFilters
            filters={filters}
            onFilterChange={(field, value) =>
              setFilters((prev) => ({ ...prev, [field]: value as any }))
            }
          />

        </div>
        <CatalogContent products={filteredProducts} />
      </section>
    </>
  );
}
