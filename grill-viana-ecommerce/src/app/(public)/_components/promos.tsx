import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import CardPromo from "./productcard";
import ProductCard from "./productcard";

export default function Promos() {
  return (
    <>
      <section className="bg-gray-100 h-auto w-full flex flex-col justify-center items-center">
        <h2 className="font-bold text-xl">
          Veja abaixo nossas <span className="text-red-800">Promoções</span>!
        </h2>
        <div className="mt-8 gap-20 flex items-center">
          <div className="w-70 cursor-pointer">
            <ProductCard
              product={{
                id: 1,
                name: "Churrasqueira Inox 60cm",
                description: "Ideal para momentos em família",
                image: "/images/i60_capa.png",
                price: 299.9,
              }}
            />
          </div>
          <div className="w-70 cursor-pointer">
            <ProductCard
              product={{
                id: 1,
                name: "Churrasqueira Inox 60cm",
                description: "Ideal para momentos em família",
                image: "/images/i60_capa.png",
                price: 299.9,
              }}
            />
          </div>
          <div className="w-70 cursor-pointer">
            <ProductCard
              product={{
                id: 1,
                name: "Churrasqueira Inox 60cm",
                description: "Ideal para momentos em família",
                image: "/images/i60_capa.png",
                price: 299.9,
              }}
            />
          </div>
          <div className="w-70 cursor-pointer">
            <ProductCard
              product={{
                id: 1,
                name: "Churrasqueira Inox 60cm",
                description: "Ideal para momentos em família",
                image: "/images/i60_capa.png",
                price: 299.9,
              }}
            />
          </div>
        </div>
        <div className="m-8">
          <Button className="bg-red-700 w-auto h-auto rounded-md hover:bg-red-800 cursor-pointer">
            <span className="text-base">Ver mais promoções!</span>
          </Button>
        </div>
      </section>
    </>
  );
}
