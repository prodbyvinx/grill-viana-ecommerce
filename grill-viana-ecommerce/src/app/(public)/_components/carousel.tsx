"use client";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function PicCarousel() {
  return (
    <>
      <section className="flex justify-center">
        <div className="w-full h-100 bg-gray-400 flex justify-center items-center">
          <Carousel className="w-[80%]"
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 4000,
              }),
            ]}
          >
            <CarouselContent>
              <CarouselItem><Image src="/images/i60_capa.png" alt="Churrasqueira Inox 60cm" width={300} height={300} /></CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="bg-red-800 text-white border-none"/>
            <CarouselNext className="bg-red-800 text-white border-none"/>
          </Carousel>
        </div>
      </section>
    </>
  );
}
