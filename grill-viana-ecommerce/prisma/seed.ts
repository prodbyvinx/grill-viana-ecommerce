// prisma/seed.ts
import { PrismaClient } from  "@prisma/client";

const products = require("./seed-data.json");

const prismaClient = new PrismaClient();

async function main() {
  for (const p of products) {
    const category = await prismaClient.category.upsert({
      where: { name: p.category },
      update: {},
      create: { name: p.category },
    });

    await prismaClient.product.upsert({
      where: { slug: `${p.name.toLowerCase().replace(/\s+/g, "-")}-${p.id}` },
      update: {},
      create: {
        name: p.name,
        slug: `${p.name.toLowerCase().replace(/\s+/g, "-")}-${p.id}`,
        description: p.description,
        price: p.price,
        type: p.type,
        sku: p.sku,
        finalidade: p.finalidade,
        grelhas: p.grelhas,
        stock: 0,
        categories: { connect: { id: category.id } },
        images: { create: [{ url: p.image }] },
      },
    });
  }
}

main()
  .catch(console.error)
  .finally(() => prismaClient.$disconnect());
