import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { setCartCookie } from "@/lib/cart-cookie";

export async function POST() {
  const cookieStore = cookies();
  const currentId = cookieStore.get("cartId")?.value || null;

  if (!currentId) {
    const res = NextResponse.json({ ok: true, action: "noop" });
    setCartCookie(res, null);
    return res;
  }

  const current = await prisma.cart.findUnique({
    where: { id: currentId },
    include: { items: true },
  });

  if (!current) {
    const res = NextResponse.json({ ok: true, action: "clear" });
    setCartCookie(res, null);
    return res;
  }

  // Se o carrinho está atrelado a um usuário → FORK para guest
  if (current.userId) {
    const newCart = await prisma.cart.create({
      data: { status: "ACTIVE" },
      select: { id: true },
    });

    if (current.items.length) {
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
    setCartCookie(res, newCart.id);
    return res;
  }

  // Já era guest
  const res = NextResponse.json({ ok: true, action: "already-guest", cartId: current.id });
  setCartCookie(res, current.id);
  return res;
}