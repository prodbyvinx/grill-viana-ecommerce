"use client";

import Image from "next/image";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Star } from "lucide-react";

export default function RatingsCarousel() {
  return (
    <>
      <section className="flex justify-center mb-8 bg-white">
        <div className="w-full h-80 flex justify-center items-center">
          <Carousel
            className="w-[80%]"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent>
              <CarouselItem className="basis-1/3">
                <Card>
                  <CardHeader>
                    <CardTitle>00/00/0000</CardTitle>
                    <CardDescription className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Comprei para usar nos churrascos de fim de semana e
                      adorei! Vou comprar mais vezes, atendimento excelente e
                      produto de qualidade!
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Image
                      src="/images/pessoa1.jpeg"
                      width={50}
                      height={50}
                      alt="Picture of the author"
                      className="rounded-full mr-3"
                    />
                    <div>
                      <p className="font-semibold">Nome Sobrenome</p>
                      <p className="text-sm">Cidade, ST</p>
                    </div>
                  </CardFooter>
                </Card>
              </CarouselItem>
              <CarouselItem className="basis-1/3">
                <Card>
                  <CardHeader>
                    <CardTitle>00/00/0000</CardTitle>
                    <CardDescription className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Comprei para usar nos churrascos de fim de semana e
                      adorei! Vou comprar mais vezes, atendimento excelente e
                      produto de qualidade!
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Image
                      src="/images/pessoa1.jpeg"
                      width={50}
                      height={50}
                      alt="Picture of the author"
                      className="rounded-full mr-3"
                    />
                    <div>
                      <p className="font-semibold">Nome Sobrenome</p>
                      <p className="text-sm">Cidade, ST</p>
                    </div>
                  </CardFooter>
                </Card>
              </CarouselItem>
              <CarouselItem className="basis-1/3">
                <Card>
                  <CardHeader>
                    <CardTitle>00/00/0000</CardTitle>
                    <CardDescription className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Comprei para usar nos churrascos de fim de semana e
                      adorei! Vou comprar mais vezes, atendimento excelente e
                      produto de qualidade!
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Image
                      src="/images/pessoa1.jpeg"
                      width={50}
                      height={50}
                      alt="Picture of the author"
                      className="rounded-full mr-3"
                    />
                    <div>
                      <p className="font-semibold">Nome Sobrenome</p>
                      <p className="text-sm">Cidade, ST</p>
                    </div>
                  </CardFooter>
                </Card>
              </CarouselItem>
              <CarouselItem className="basis-1/3">
                <Card>
                  <CardHeader>
                    <CardTitle>00/00/0000</CardTitle>
                    <CardDescription className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Comprei para usar nos churrascos de fim de semana e
                      adorei! Vou comprar mais vezes, atendimento excelente e
                      produto de qualidade!
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Image
                      src="/images/pessoa1.jpeg"
                      width={50}
                      height={50}
                      alt="Picture of the author"
                      className="rounded-full mr-3"
                    />
                    <div>
                      <p className="font-semibold">Nome Sobrenome</p>
                      <p className="text-sm">Cidade, ST</p>
                    </div>
                  </CardFooter>
                </Card>
              </CarouselItem>
              <CarouselItem className="basis-1/3">
                <Card>
                  <CardHeader>
                    <CardTitle>00/00/0000</CardTitle>
                    <CardDescription className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Comprei para usar nos churrascos de fim de semana e
                      adorei! Vou comprar mais vezes, atendimento excelente e
                      produto de qualidade!
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Image
                      src="/images/pessoa1.jpeg"
                      width={50}
                      height={50}
                      alt="Picture of the author"
                      className="rounded-full mr-3"
                    />
                    <div>
                      <p className="font-semibold">Nome Sobrenome</p>
                      <p className="text-sm">Cidade, ST</p>
                    </div>
                  </CardFooter>
                </Card>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="text-black border-none" />
            <CarouselNext className="text-black border-none" />
          </Carousel>
        </div>
      </section>
    </>
  );
}
