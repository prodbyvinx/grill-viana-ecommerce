import ProductCard from "./productcard";
import Link from "next/link";

export default function Promos() {
  return (
    <>
      <section className="bg-white h-auto w-full flex flex-col justify-center items-center">
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
        <div className="my-8 bg-red-800 rounded-md hover:bg-red-900 transition-colors duration-300 px-4 py-2 text-center">
          <Link className="cursor-pointer" href="/catalogo">
            <span className="text-base font-medium text-white">Ver mais produtos</span>
          </Link>
        </div>
      </section>
    </>
  );
}
