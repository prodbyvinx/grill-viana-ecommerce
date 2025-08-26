import "dotenv/config";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Tenta carregar categories.json (se existir). Se não existir, segue em frente.
let categories: any[] = [];
try {
  categories = require("./categories.json");
} catch {
  /* ok */
}

// Carrega produtos (products.json no seu formato atual)
const products: any[] = require("./products.json");

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

function imagesFromSeed(p: any): { url: string; position: number }[] {
  if (p?.images?.create?.length) return p.images.create;
  if (Array.isArray(p?.images))
    return p.images.map((url: string, i: number) => ({ url, position: i }));
  if (p?.image) return [{ url: p.image, position: 0 }];
  return [];
}

function normalizeImageUrl(url: string) {
  // Mantém URLs absolutas; para relativas, garante prefixo /images/
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("/")) return url;
  if (url.startsWith("images/")) return `/${url}`;
  return `/images/${url}`;
}

function safeCents(v: any) {
  if (typeof v === "number") return Math.round(v);
  const n = Number(v);
  return Number.isFinite(n) ? Math.round(n) : 0;
}

function ensurePriceCents(p: any) {
  // aceita priceCents direto; senão, converte de price (reais) -> centavos
  if (p.priceCents != null) return safeCents(p.priceCents);
  const price = Number(p.price ?? 0);
  return Math.round(price * 100);
}

function deriveSkuFromSlug(slug: string | undefined) {
  if (!slug) return "";
  return slug.toUpperCase().replace(/-/g, "");
}

async function main() {
  // 1) Categorias (se existir arquivo)
  for (const c of categories) {
    if (!c?.slug || !c?.name) continue;
    await prisma.category.upsert({
      where: { slug: String(c.slug) },
      update: { name: String(c.name) },
      create: { name: String(c.name), slug: String(c.slug) },
    });
  }

  // 2) Produtos (+ imagens garantidas, rating e sku)
  for (const raw of products) {
    const slug = raw.slug ?? slugify(String(raw.name ?? ""));
    if (!slug) {
      console.warn("⚠️ Produto sem nome/slug no seed, ignorado:", raw);
      continue;
    }

    const priceCents = ensurePriceCents(raw);

    // Normaliza lista de imagens
    const imagesCreate = imagesFromSeed(raw).map((it) => ({
      url: normalizeImageUrl(String(it.url)),
      position: safeCents(it.position) || 0,
    }));

    // rating (novos campos no schema)
    const rating = safeCents(raw.rating ?? 0);
    const ratingCount = safeCents(raw.ratingCount ?? 0);

    // Tenta um SKU determinístico a partir do slug se não vier no JSON
    let skuCandidate = (raw.sku ?? "").toString().trim();
    if (!skuCandidate) skuCandidate = deriveSkuFromSlug(slug);

    // Upsert principal
    const upserted = await prisma.product.upsert({
      where: { slug },
      update: {
        name: String(raw.name ?? ""),
        description: String(raw.description ?? ""),
        material: raw.material ?? "",
        priceCents,
        sku: skuCandidate || null, // pode ficar nulo temporariamente; ajeitamos abaixo
        isActive: true,
        rating,
        ratingCount,

        ...(raw.category
          ? { category: raw.category }
          : raw.categorySlug
          ? { category: { connect: { slug: String(raw.categorySlug) } } }
          : {}),

        ...(imagesCreate.length
          ? {
              images: {
                deleteMany: {}, // limpa as antigas
                create: imagesCreate,
              },
            }
          : {}),
      },
      create: {
        name: String(raw.name ?? ""),
        slug,
        description: String(raw.description ?? ""),
        material: raw.material ?? "",
        priceCents,
        sku: skuCandidate || null, // pode ficar nulo temporariamente; ajeitamos abaixo
        isActive: true,
        rating,
        ratingCount,

        ...(raw.category
          ? { category: raw.category }
          : raw.categorySlug
          ? { category: { connect: { slug: String(raw.categorySlug) } } }
          : {}),

        ...(imagesCreate.length ? { images: { create: imagesCreate } } : {}),
      },
      select: { id: true, sku: true },
    });

    // Se continuou sem SKU (ou vazio), use padrão baseado no ID (P000123)
    if (!upserted.sku || !upserted.sku.trim()) {
      const padded = String(upserted.id).padStart(6, "0");
      const finalSku = `P${padded}`;
      await prisma.product.update({
        where: { id: upserted.id },
        data: { sku: finalSku },
      });
    }
  }
}

main()
  .then(() => console.log("✅ Seed concluído"))
  .catch((e) => {
    console.error("❌ Seed falhou:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
