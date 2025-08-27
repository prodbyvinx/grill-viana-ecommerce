// src/app/api/cart/merge/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth-options"; // ou de onde você exportar seu authOptions

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  // 1) precisa estar logado
  const session = await getServerSession(authOptions);
  const id = (session?.user as any)?.id;
  const userId = id ? Number(id) : null;
  if (!userId) {
    return NextResponse.json({ merged: false, reason: "not-authenticated" }, { status: 401 });
  }

  // 2) carrinho do cookie (visitante)
  const store = await cookies();
  const guestCartId = store.get("cartId")?.value ?? null;

  // 3) garanta carrinho do usuário
  let userCart = await prisma.cart.findFirst({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
  if (!userCart) {
    userCart = await prisma.cart.create({ data: { userId }, include: { items: true } });
  }

  // se não há guest cart → só fixa o cookie pro carrinho do user e encerra
  if (!guestCartId) {
    const res = NextResponse.json({ merged: false, reason: "no-guest-cart" });
    // fixa cookie apontando para o carrinho do usuário
    res.cookies.set("cartId", userCart.id, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  }

  // 4) carrega carrinho visitante
  const guestCart = await prisma.cart.findUnique({
    where: { id: guestCartId },
    include: { items: true },
  });

  // se o cookie já aponta pro carrinho do user, não há nada pra fazer
  if (!guestCart || guestCart.id === userCart.id) {
    const res = NextResponse.json({ merged: false, reason: "same-cart-or-missing" });
    res.cookies.set("cartId", userCart.id, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  }

  // 5) MERGE: para cada item do guest, soma no carrinho do usuário
  for (const it of guestCart.items) {
    const existing = await prisma.cartItem.findFirst({
      where: { cartId: userCart.id, productId: it.productId, variantId: it.variantId },
    });

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: {
          quantity: existing.quantity + it.quantity,
          // mantém o unitCents do snapshot do item original do guest
          unitCents: it.unitCents ?? existing.unitCents,
        },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: userCart.id,
          productId: it.productId,
          variantId: it.variantId,
          quantity: it.quantity,
          unitCents: it.unitCents ?? 0,
        },
      });
    }
  }

  // 6) apaga carrinho guest e fixa cookie para o carrinho do user
  await prisma.cart.delete({ where: { id: guestCart.id } }).catch(() => {});

  const res = NextResponse.json({ merged: true });
  res.cookies.set("cartId", userCart.id, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
