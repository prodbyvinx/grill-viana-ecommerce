// prisma.config.ts
import { defineConfig } from "prisma/config";
import path from "node:path";

export default defineConfig({
  // aponta para o seu schema
  schema: path.join(__dirname, "prisma", "schema.prisma"),

  // onde o Prisma deve encontrar as migrations
  migrations: {
    path: path.join(__dirname, "prisma", "migrations"),
  },

  // (opcional) shadow database, views, typedSql etc...
  // shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL,
});
