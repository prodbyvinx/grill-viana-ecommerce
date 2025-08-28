// src/app/api/cart/merge/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth-options";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function setCartCookie(res: NextResponse, cartId: string) {
  res.cookies.set("cartId", cartId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    // secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 dias
  });
}

export async function POST() {
  // 1) precisa estar logado
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const userId = Number((session.user as any).id);
  if (!userId) {
    return NextResponse.json({ merged: false, reason: "not-authenticated" }, { status: 401 });
  }

  // 2) ler cartId do cookie (visitante) e carregar do banco
  const cookieStore = cookies();
  const guestCartId = cookieStore.get("cartId")?.value || null;

  const guestCart = guestCartId
    ? await prisma.cart.findUnique({
        where: { id: guestCartId },
        include: {
          items: {
            select: {
              id: true,
              productId: true,
              variantId: true,
              quantity: true,
              unitCents: true,
            },
          },
        },
      })
    : null;

  // 3) carregar carrinho ativo do usuário
  const userCart = await prisma.cart.findFirst({
    where: { userId, status: "ACTIVE" },
    include: {
      items: {
        select: {
          id: true,
          productId: true,
          variantId: true,
          quantity: true,
          unitCents: true,
        },
      },
    },
  });

  // Se o carrinho do cookie já é do usuário, nada a fazer (só fixa cookie/id)
  if (guestCart && guestCart.userId === userId) {
    const res = NextResponse.json({ ok: true, cartId: guestCart.id, merged: false });
    await setCartCookie(res, guestCart.id);
    return res;
  }

  const guestHasItems = (guestCart?.items?.length ?? 0) > 0;
  const userHasCart = !!userCart;
  const userHasItems = (userCart?.items?.length ?? 0) > 0;

  // B) Convidado TEM itens e usuário NÃO tem carrinho -> adotar guest (atribui userId)
  if (guestHasItems && !userHasCart) {
    const updated = await prisma.cart.update({
      where: { id: guestCart!.id },
      data: { userId, status: "ACTIVE" },
      select: { id: true },
    });
    const res = NextResponse.json({ ok: true, cartId: updated.id, adopted: true });
    await setCartCookie(res, updated.id);
    return res;
  }

  // A) Ambos têm itens -> mescla no carrinho do usuário e apaga o do convidado
  if (guestHasItems && userHasItems) {
    await prisma.$transaction(async (tx) => {
      for (const gi of guestCart!.items) {
        const existing = await tx.cartItem.findFirst({
          where: {
            cartId: userCart!.id,
            productId: gi.productId,
            variantId: gi.variantId ?? null,
          },
        });
        if (existing) {
          await tx.cartItem.update({
            where: { id: existing.id },
            data: { quantity: existing.quantity + gi.quantity },
          });
        } else {
          await tx.cartItem.create({
            data: {
              cartId: userCart!.id,
              productId: gi.productId,
              variantId: gi.variantId,
              quantity: gi.quantity,
              unitCents: gi.unitCents,
            },
          });
        }
      }
      // limpa o carrinho do convidado
      await tx.cartItem.deleteMany({ where: { cartId: guestCart!.id } });
      await tx.cart.delete({ where: { id: guestCart!.id } });
    });

    const res = NextResponse.json({ ok: true, cartId: userCart!.id, merged: true });
    await setCartCookie(res, userCart!.id);
    return res;
  }

  // C) convidado vazio + usuário com carrinho -> manter userCart (NÃO sobrescrever)
  if (!guestHasItems && userHasCart) {
    if (guestCart) {
      // opcional: deletar o carrinho vazio do convidado
      await prisma.cart.delete({ where: { id: guestCart.id } }).catch(() => {});
    }
    const res = NextResponse.json({ ok: true, cartId: userCart.id, keptUserCart: true });
    await setCartCookie(res, userCart.id);
    return res;
  }

  // D) nenhum tem itens -> cria carrinho vazio do usuário
  const created = await prisma.cart.create({
    data: { userId, status: "ACTIVE" },
    select: { id: true },
  });
  if (guestCart) {
    await prisma.cart.delete({ where: { id: guestCart.id } }).catch(() => {});
  }
  const res = NextResponse.json({ ok: true, cartId: created.id, createdEmpty: true });
  await setCartCookie(res, created.id);
  return res;
}
