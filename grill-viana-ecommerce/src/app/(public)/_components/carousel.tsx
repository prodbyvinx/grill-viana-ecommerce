"use client";

import { Card, CardContent } from "@/components/ui/card";

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
              <CarouselItem>...</CarouselItem>
              <CarouselItem>...</CarouselItem>
              <CarouselItem>...</CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="bg-red-800 text-white border-none"/>
            <CarouselNext className="bg-red-800 text-white border-none"/>
          </Carousel>
        </div>
      </section>
    </>
  );
}
