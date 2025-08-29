import ProductControls from "../_components/productcontrols";
import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatBRL } from "@/lib/money";
import { getStaticImagesForId } from "@/lib/images";
import { Star } from "lucide-react";
import BackButton from "../../_components/backbutton";
import Header from "../../_components/header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductReviews from "../_components/productreviews";

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
      reviews: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          rating: true,
          text: true,
          createdAt: true,
          user: { select: { name: true } }, // <- sem image
        },
      },
    },
  });

  if (!product || !product.isActive) {
    notFound();
    return null;
  }

  const price = formatBRL(product.priceCents);
  const images = getStaticImagesForId(product.id);
  const stars = Math.max(0, Math.min(5, product.rating ?? 0));

  return (
    <>
      <Header />
      <BackButton />
      <main className="container mx-[5%] mt-16 py-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="relative aspect-square w-[80%] overflow-hidden rounded-2xl border bg-background ">
          <Image
            src={images[0]}
            alt={product.name}
            fill
            sizes="(max-width:1024px) 40vw, 90vw"
            className="object-contain"
            priority
          />
        </div>

        <section className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-semibold">{product.name}</h1>
            <h2 className="text-sm">cód. {product.sku ?? "-"}</h2>
            <div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < stars ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                  />
                ))}
                {!!product.ratingCount && (
                  <span className="text-sm text-slate-500 ml-1">({product.ratingCount})</span>
                )}
              </div>
            </div>

            <div>
              <Tabs defaultValue="sobre" className="w-auto rounded-lg">
                <TabsList className="w-full">
                  <TabsTrigger value="sobre" className="cursor-pointer">Sobre</TabsTrigger>
                  <TabsTrigger value="medidas" className="cursor-pointer">Medidas</TabsTrigger>
                  <TabsTrigger value="especificacoes" className="cursor-pointer">Especificações</TabsTrigger>
                </TabsList>
                <TabsContent value="sobre">Lorem ipsum…</TabsContent>
                <TabsContent value="medidas">Lorem ipsum…</TabsContent>
                <TabsContent value="especificacoes">Lorem ipsum…</TabsContent>
              </Tabs>
            </div>

            <h1 className="text-2xl font-semibold">{price}</h1>
            <ProductControls
              productId={product.id}
              unitPriceCents={product.priceCents}
              stockTotal={product.stockTotal}
            />
          </div>
        </section>

        <section>
          <ProductReviews reviews={product.reviews} productId={product.id} />
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
