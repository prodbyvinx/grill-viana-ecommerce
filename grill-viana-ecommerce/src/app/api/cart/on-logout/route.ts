import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

async function setCartCookie(res: NextResponse, cartId: string | null) {
  if (!cartId) {
    // limpa cookie
    res.cookies.set("cartId", "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 });
    return;
  }
  res.cookies.set("cartId", cartId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function POST() {
  const cookieStore = cookies();
  const currentId = cookieStore.get("cartId")?.value || null;

  if (!currentId) {
    // não há carrinho, apenas garante que o cookie está limpo
    const res = NextResponse.json({ ok: true, action: "noop" });
    await setCartCookie(res, null);
    return res;
  }

  const current = await prisma.cart.findUnique({
    where: { id: currentId },
    include: { items: true },
  });

  // Se não encontrou, só limpa cookie
  if (!current) {
    const res = NextResponse.json({ ok: true, action: "clear" });
    await setCartCookie(res, null);
    return res;
  }

  // Se o carrinho pertencia a um usuário, fazemos o "fork" para guest
  if (current.userId) {
    const newCart = await prisma.cart.create({
      data: { status: "ACTIVE" },
      select: { id: true },
    });

    if (current.items.length) {
      // copia itens (sem vincular ao usuário)
      await prisma.cartItem.createMany({
        data: current.items.map((it) => ({
          cartId: newCart.id,
          productId: it.productId,
          variantId: it.variantId ?? null,
          quantity: it.quantity,
          unitCents: it.unitCents,
        })),
      });
    }

    const res = NextResponse.json({ ok: true, action: "forked", newCartId: newCart.id });
    await setCartCookie(res, newCart.id);
    return res;
  }

  // Já é guest: nada a fazer
  const res = NextResponse.json({ ok: true, action: "already-guest", cartId: current.id });
  await setCartCookie(res, current.id);
  return res;
}
