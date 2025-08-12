import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getTopProductSlugs } from "@/lib/db/product";
import { formatBRL } from "@/lib/money";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Truck, ShieldCheck, CreditCard } from "lucide-react";
import ProductGallery from "../_components/productgallery";
import BuyButton from "@/app/(public)/_components/buybutton";

export const revalidate = 60; // ISR: revalida a cada 60s

export async function generateStaticParams() {
  // Pré-renderiza páginas mais acessadas
  return getTopProductSlugs(100);
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "Produto não encontrado | Grill Viana" };

  const title = `${product.name} | Grill Viana`;
  const description = product.description.slice(0, 160);
  const images = product.images?.length ? [{ url: product.images[0].url }] : [];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images,
      type: "product",
    },
    alternates: { canonical: `/produto/${product.slug}` },
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product || !product.active) return notFound();

  const price = formatBRL(product.priceCents);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.sku,
    productID: product.id,
    material: product.material,
    width: product.widthCm ? `${product.widthCm} cm` : undefined,
    height: product.heightCm ? `${product.heightCm} cm` : undefined,
    depth: product.depthCm ? `${product.depthCm} cm` : undefined,
    image: product.images.map((i) => i.url),
    category: "Churrasqueiras",
    additionalProperty: product.ncm ? [{ "@type": "PropertyValue", name: "NCM", value: product.ncm }] : [],
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      price: (product.priceCents / 100).toFixed(2),
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `https://www.grillviana.com.br/produto/${product.slug}`,
    },
  } as const;

  return (
    <main className="container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Galeria de imagens */}
      <section>
        <ProductGallery images={product.images} />
      </section>

      {/* Detalhes */}
      <section className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {product.stock > 0 ? (
              <Badge variant="default">Em estoque</Badge>
            ) : (
              <Badge variant="secondary">Sob encomenda</Badge>
            )}
            {product.material && <Badge variant="outline">{product.material}</Badge>}
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">{product.name}</h1>
          <p className="text-3xl md:text-4xl font-bold">{price}</p>
          {product.ncm && (
            <p className="text-sm text-muted-foreground">NCM {product.ncm}</p>
          )}
        </div>

        <BuyButton productId={product.id as unknown as number} />

        <Separator />

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>Descrição</h2>
          <p>{product.description}</p>
          <ul>
            {product.widthCm && <li>Largura: {product.widthCm} cm</li>}
            {product.depthCm && <li>Comprimento: {product.depthCm} cm</li>}
            {product.heightCm && <li>Altura: {product.heightCm} cm</li>}
            {typeof product.stock === "number" && <li>Estoque: {product.stock} un.</li>}
          </ul>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <div className="flex items-center gap-2 rounded-2xl border p-3">
            <Truck className="h-5 w-5" />
            <span>Envio para todo o Brasil</span>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border p-3">
            <ShieldCheck className="h-5 w-5" />
            <span>Garantia legal</span>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border p-3">
            <CreditCard className="h-5 w-5" />
            <span>Até 12x no Mercado Pago</span>
          </div>
        </div>
      </section>
    </main>
  );
}
