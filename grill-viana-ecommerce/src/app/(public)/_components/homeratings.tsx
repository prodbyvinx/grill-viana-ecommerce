"use client";

import RatingsCarousel from "./ratingscarousel";

export default function HomeRatings() {
  return (
    <>
      <section className="bg-white">
        <div className="text-center p-8">
          <h1 className="font-extrabold text-3xl mb-3">
            <span className="text-red-800">Avaliações </span>dos Clientes
          </h1>
          <p className="text-base">
            Veja o que nossos clientes estão dizendo sobre a <br /> experiência com <span className="font-semibold">nosso produto</span>!
          </p>
        </div>
        <div>
            <RatingsCarousel />
        </div>
      </section>
    </>
  );
}