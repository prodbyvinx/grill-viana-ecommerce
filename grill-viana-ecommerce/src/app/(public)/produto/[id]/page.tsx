// src/app/(public)/produto/[id]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BuyButton from "../../_components/buybutton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatBRL } from "@/lib/money";

export const revalidate = 60;

async function getProductByIdParam(idParam: string) {
  const id = Number(idParam);
  if (!Number.isFinite(id)) return null;
  return prisma.product.findUnique({
    where: { id },
    include: { images: { orderBy: { position: "asc" } } },
  });
}

export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  const product = await getProductByIdParam(params.id);
  if (!product) return { title: "Produto não encontrado | Grill Viana" };

  const title = `${product.name} | Grill Viana`;
  const description = product.description.slice(0, 160);

  return {
    title,
    description,
    alternates: { canonical: `/produto/${product.id}` },
  };
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProductByIdParam(params.id);

  if (!product || !product.isActive) {
    notFound();
    return null; // <- satisfaz o TS/VSCode
  }

  const price = formatBRL(product.priceCents);

  return (
    <main className="container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-2 gap-8">

      <section className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="default">
              {product.stockTotal > 0 ? "Em estoque" : "Sob encomenda"}
            </Badge>
            {product.material && <Badge variant="outline">{product.material}</Badge>}
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold">{product.name}</h1>
          <p className="text-3xl md:text-4xl font-bold">{price}</p>
        </div>

        <BuyButton
          productId={product.id}            // usa o ID numérico
          disabled={product.stockTotal <= 0}
        />

        <Separator />

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>Descrição</h2>
          <p>{product.description}</p>
        </div>
      </section>
    </main>
  );
}

export async function generateStaticParams() {
  const items = await prisma.product.findMany({
    where: { isActive: true },
    select: { id: true },
    take: 100,
    orderBy: { createdAt: "desc" },
  });
  // rota recebe string; converta
  return items.map(p => ({ id: String(p.id) }));
}
