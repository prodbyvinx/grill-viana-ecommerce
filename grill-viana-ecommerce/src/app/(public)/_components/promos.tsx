import Link from "next/link";
import PromoCards from "./promo-cards";
import { getRandomActiveProducts } from "@/data/products";

export default async function Promos() {

  const randomProducts = await getRandomActiveProducts(4);

  return (
    <>
      <section className="bg-white h-auto w-full flex flex-col justify-center items-center">
        <h2 className="font-bold text-xl">
          Veja abaixo nossas <span className="text-red-800">Promoções</span>!
        </h2>
        <div className="mt-8 gap-20 flex items-center">
          <div className="w-70 cursor-pointer">
            <PromoCards products={randomProducts} />
          </div>
        </div>
        <Link
          className="my-8 bg-red-800 rounded-md hover:bg-red-700 transition-colors duration-300 px-4 py-2 text-center"
          href="/catalogo"
        >
          <span className="text-base font-medium text-white">
            Ver mais produtos
          </span>
        </Link>
      </section>
    </>
  );
}
