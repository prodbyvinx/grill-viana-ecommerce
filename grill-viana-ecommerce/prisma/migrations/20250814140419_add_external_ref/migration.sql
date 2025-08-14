/*
  Warnings:

  - A unique constraint covering the columns `[externalRef]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Category_name_key";

-- DropIndex
DROP INDEX "public"."Category_slug_key";

-- AlterTable
ALTER TABLE "public"."Category" ALTER COLUMN "slug" SET DEFAULT 'sem-slug';

-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "externalRef" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "lastPaymentId" TEXT,
ADD COLUMN     "mpInitPoint" TEXT,
ADD COLUMN     "paymentId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Order_externalRef_key" ON "public"."Order"("externalRef");
