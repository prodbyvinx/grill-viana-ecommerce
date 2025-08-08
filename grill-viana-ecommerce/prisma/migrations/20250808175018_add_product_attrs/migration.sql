/*
  Warnings:

  - Added the required column `finalidade` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `grelhas` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "finalidade" TEXT NOT NULL,
ADD COLUMN     "grelhas" INTEGER NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL,
ALTER COLUMN "cost" DROP NOT NULL,
ALTER COLUMN "sku" DROP NOT NULL;
