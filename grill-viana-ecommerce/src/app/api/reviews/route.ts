import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { z } from "zod";

const reviewSchema = z.object({
  productId: z.coerce.number(), // aceita string vinda do cliente
  rating: z.number().min(1).max(5),
  text: z.string().min(1),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userIdRaw = (session?.user as any)?.id;
  const userId = userIdRaw != null ? Number(userIdRaw) : undefined;

  if (!userId) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { productId, rating, text } = reviewSchema.parse(body);

    const created = await prisma.$transaction(async (tx) => {
      // cria a review
      const review = await tx.review.create({
        data: { productId, rating, text, userId },
      });

      // recalcula média e contagem
      const agg = await tx.review.aggregate({
        where: { productId },
        _avg: { rating: true },
        _count: { _all: true },
      });

      await tx.product.update({
        where: { id: productId },
        data: {
          rating: Number(agg._avg.rating ?? 0),
          ratingCount: agg._count._all,
        },
      });

      return review;
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro ao criar avaliação" }, { status: 500 });
  }
}
