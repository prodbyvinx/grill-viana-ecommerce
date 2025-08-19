// prisma/seed.ts
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // importa JSONs (CommonJS require é prático aqui)
  const categories = require("./categories.json");
  const products = require("./products.json");

  // 1) Cria / atualiza categorias
  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug }, // slug é único
      update: { name: c.name },
      create: {
        name: c.name,
        slug: c.slug,
      },
    });
  }

  // 2) Cria / atualiza produtos
  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug }, // idempotência
      update: {
        name: p.name,
        description: p.description,
        priceCents: p.priceCents,
        material: p.material,
        sku: p.sku,
        isActive: true,
        // conecta categoria pelo id
        category: p.category,
      },
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        priceCents: p.priceCents,
        material: p.material,
        sku: p.sku,
        isActive: true,
        category: p.category,
        // cria imagens já preparadas no JSON
        images: p.images,
      },
    });
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
