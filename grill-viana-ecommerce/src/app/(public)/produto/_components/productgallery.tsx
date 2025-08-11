"use client";
import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

interface Img { id: string; url: string; alt?: string | null }
export default function ProductGallery({ images }: { images: Img[] }) {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 4000 })]);

  if (!images?.length) return <div className="aspect-[1/1] bg-muted rounded-2xl" />;

  return (
    <div className="space-y-3">
      <div ref={emblaRef} className="overflow-hidden rounded-2xl border">
        <div className="flex">
          {images.map((img) => (
            <div key={img.id} className="min-w-0 flex-[0_0_100%]">
              <div className="relative aspect-square w-full">
                <Image src={img.url} alt={img.alt ?? "Produto Grill Viana"} fill className="object-contain" sizes="(min-width: 1024px) 50vw, 100vw" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {images.slice(0, 5).map((img) => (
          <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden border">
            <Image src={img.url} alt={img.alt ?? "Miniatura"} fill className="object-cover" sizes="140px" />
          </div>
        ))}
      </div>
    </div>
  );
}