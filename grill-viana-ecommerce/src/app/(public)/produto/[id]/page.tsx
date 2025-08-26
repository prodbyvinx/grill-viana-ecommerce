import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import BuyButton from "../../_components/buybutton";
import { Badge } from "@/components/ui/badge";
import { formatBRL } from "@/lib/money";
import { getStaticImagesForId } from "@/lib/images";
import { Star } from "lucide-react";
import BackButton from "../../_components/backbutton";
import Header from "../../_components/header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const revalidate = 60;

async function unwrapParams<T>(p: T | Promise<T>): Promise<T> {
  return typeof (p as any)?.then === "function" ? await (p as any) : (p as T);
}

export default async function ProductPage(
  props: { params: { id: string } } | { params: Promise<{ id: string }> }
) {
  const { id } = await unwrapParams((props as any).params);

  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
    select: {
      id: true,
      name: true,
      sku: true,
      description: true,
      priceCents: true,
      stockTotal: true,
      material: true,
      isActive: true,
      rating: true,
      ratingCount: true,
    },
  });

  if (!product || !product.isActive) {
    notFound();
    return null;
  }

  const price = formatBRL(product.priceCents);
  const images = getStaticImagesForId(product.id);
  const stars = Math.max(0, Math.min(5, product.rating ?? 0));

  console.log(product.sku);

  return (
    <>
      <Header />
      <BackButton />
      <main className="container mx-[5%] mt-16 py-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl border bg-background">
          <Image
            src={images[0]}
            alt={product.name}
            fill
            sizes="(min-width:1024px) 40vw, 90vw"
            className="object-contain"
            priority
          />
        </div>

        <section className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-semibold">
              {product.name}
            </h1>
            <h2 className="text-sm">cód. {product.sku ?? "-"}</h2>
            <div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < stars
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                {!!product.ratingCount && (
                  <span className="text-sm text-slate-500 ml-1">
                    ({product.ratingCount})
                  </span>
                )}
              </div>
            </div>
            <div>
              <Tabs defaultValue="sobre" className="w-auto rounded-lg">
                <TabsList className="w-full">
                  <TabsTrigger value="sobre">Sobre</TabsTrigger>
                  <TabsTrigger value="medidas">Medidas</TabsTrigger>
                  <TabsTrigger value="especificacoes">
                    Especificações
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="sobre">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Natus dignissimos officia obcaecati tempore veritatis voluptas
                  tenetur ad aliquam ea maxime voluptates, assumenda
                  consequuntur ipsa veniam architecto distinctio illo placeat
                  nostrum!
                </TabsContent>
                <TabsContent value="medidas">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus
                  dignissimos officia obcaecati tempore veritatis voluptas
                  tenetur ad aliquam ea maxime voluptates, assumenda
                  consequuntur ipsa veniam architecto distinctio illo placeat
                  nostrum!
                </TabsContent>
                <TabsContent value="especificacoes">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus
                  dignissimos officia obcaecati tempore veritatis voluptas
                  tenetur ad aliquam ea maxime voluptates, assumenda
                  consequuntur ipsa veniam architecto distinctio illo placeat
                  nostrum!
                </TabsContent>
              </Tabs>
            </div>
            <div className="py-4">
              <Select defaultValue="1">
                <SelectTrigger className="w-auto">
                  <SelectValue placeholder="Quantidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-3xl md:text-4xl font-bold text-red-800">
              {price} <span className="text-base text-black">à vista</span>
            </p>
            <p>em até 10x sem juros!</p>
          </div>

          <BuyButton
            productId={product.id}
            disabled={product.stockTotal <= 0}
            unitPriceCents={product.priceCents}
          />
        </section>
      </main>
    </>
  );
}

export async function generateStaticParams() {
  const items = await prisma.product.findMany({
    where: { isActive: true },
    select: { id: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return items.map((p) => ({ id: String(p.id) }));
}