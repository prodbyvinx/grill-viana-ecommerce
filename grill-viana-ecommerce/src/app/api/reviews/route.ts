import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { z } from "zod";

const reviewSchema = z.object({
  productId: z.coerce.number(), // Alterado de z.number() para z.coerce.number()
  rating: z.number().min(1).max(5),
  text: z.string().min(1),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  if (!userId) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { productId, rating, text } = reviewSchema.parse(body);

    const newReview = await prisma.review.create({
      data: {
        productId,
        rating,
        text,
        userId,
      },
    });

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro ao criar avaliação" }, { status: 500 });
  }
}