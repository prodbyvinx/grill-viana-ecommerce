import "dotenv/config";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Tenta carregar categories.json (se existir). Se não existir, segue em frente.
let categories: any[] = [];
try {
  categories = await import("./categories.json", { assert: { type: "json" } }).then(m => m.default);
} catch {
  console.log("⚠️ categories.json não encontrado, seguindo com categorias vazias.");
}

// Carrega produtos (products.json no seu formato atual)
let products: any[] = [];
try {
  products = await import("./products.json", { assert: { type: "json" } }).then(m => m.default);
} catch {
  console.log("⚠️ products.json não encontrado, seguindo com produtos vazios.");
}

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

function safeInt(v: any) {
  if (typeof v === "number") return Math.round(v);
  const n = Number(v);
  return Number.isFinite(n) ? Math.round(n) : 0;
}

function ensurePriceCents(p: any) {
  // aceita priceCents direto; senão, converte de price (reais) -> centavos
  if (p.priceCents != null) return safeInt(p.priceCents);
  const price = Number(p.price ?? 0);
  return Math.round(price * 100);
}

/**
 * Converte peso do seed para gramas (Int).
 * Aceita:
 *  - weightGrams / pesoGramas / weight_g / peso_g  (já em gramas)
 *  - weightKg / pesoKg / weight / peso            (em kg)
 */
function ensureWeightGrams(p: any): number | undefined {
  const gramFields = ["weightGrams", "pesoGramas", "weight_g", "peso_g"];
  for (const key of gramFields) {
    if (p?.[key] != null) {
      const n = Number(p[key]);
      if (Number.isFinite(n) && n > 0) return Math.round(n);
    }
  }
  const kgFields = ["weightKg", "pesoKg", "weight", "peso"];
  for (const key of kgFields) {
    if (p?.[key] != null) {
      const n = Number(p[key]);
      if (Number.isFinite(n) && n > 0) return Math.round(n * 1000);
    }
  }
  return undefined;
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

  // 2) Produtos (+ imagens, rating, sku e weightGrams)
  for (const raw of products) {
    const slug = raw.slug ?? slugify(String(raw.name ?? ""));
    if (!slug) {
      console.warn("⚠️ Produto sem nome/slug no seed, ignorado:", raw);
      continue;
    }

    const priceCents = ensurePriceCents(raw);
    const weightGrams = ensureWeightGrams(raw);

    // Normaliza lista de imagens
    const imagesCreate = imagesFromSeed(raw).map((it) => ({
      url: normalizeImageUrl(String(it.url)),
      position: safeInt(it.position) || 0,
    }));

    const rating = safeInt(raw.rating ?? 0);
    const ratingCount = safeInt(raw.ratingCount ?? 0);

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
        sku: skuCandidate || null,
        isActive: true,
        rating,
        ratingCount,
        ...(weightGrams != null ? { weightGrams } : {}),

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
        sku: skuCandidate || null,
        isActive: true,
        rating,
        ratingCount,
        ...(weightGrams != null ? { weightGrams } : {}),

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
