import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { setCartCookie } from "@/lib/cart-cookie";
import { ensureMutableCartId } from "@/lib/server/cart-guard";


export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function computeSummary(items: Array<{ quantity: number; unitCents: number }>) {
  const itemsCount = items.reduce((acc, i) => acc + i.quantity, 0);
  const totalCents = items.reduce(
    (acc, i) => acc + i.quantity * i.unitCents,
    0
  );
  return { itemsCount, totalCents };
}

async function getSessionUserId() {
  const session = await getServerSession(authOptions);
  const id = (session?.user as any)?.id;
  return id ? Number(id) : null;
}

const res = () => {
  NextResponse.json({ ok: true, action: "forked", newCartId: newCart.id });
  setCartCookie(res, newCart.id);
  return res;
};

async function getCartId() {
  const cookieStore = cookies(); // <- sem await
  return cookieStore.get("cartId")?.value;
}

async function ensureCartFollowingSession(opts: { createForGuest: boolean }) {
  const userId = await getSessionUserId();
  const cookieStore = cookies(); // <- sem await
  let cookieCartId = cookieStore.get("cartId")?.value || null;
  let cookieCart = cookieCartId
    ? await prisma.cart.findUnique({
        where: { id: cookieCartId },
        include: { items: true },
      })
    : null;

  // Se logado → use carrinho do usuário
  if (userId) {
    let userCart = await prisma.cart.findFirst({
      where: { userId, status: "ACTIVE" as any },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
    if (!userCart && cookieCart) {
      // “adota” carrinho guest
      userCart = await prisma.cart.update({
        where: { id: cookieCart.id },
        data: { userId },
        include: { items: true },
      });
    }
    if (!userCart) {
      userCart = await prisma.cart.create({
        data: { userId },
        include: { items: true },
      });
    }

    // se havia outro carrinho guest diferente → merge
    if (
      cookieCart &&
      cookieCart.id !== userCart.id &&
      cookieCart.items.length > 0
    ) {
      for (const it of cookieCart.items) {
        const existing = await prisma.cartItem.findFirst({
          where: {
            cartId: userCart.id,
            productId: it.productId,
            variantId: it.variantId,
          },
        });
        if (existing) {
          await prisma.cartItem.update({
            where: { id: existing.id },
            data: {
              quantity: existing.quantity + it.quantity,
              unitCents: it.unitCents,
            },
          });
        } else {
          await prisma.cartItem.create({
            data: {
              cartId: userCart.id,
              productId: it.productId,
              variantId: it.variantId,
              quantity: it.quantity,
              unitCents: it.unitCents,
            },
          });
        }
      }
      // limpa o carrinho antigo (opcional)
      await prisma.cart
        .delete({ where: { id: cookieCart.id } })
        .catch(() => {});
    }

    return { cartId: userCart.id, userId };
  }

  // visitante
  if (!cookieCart && opts.createForGuest) {
    cookieCart = await prisma.cart.create({ data: {} });
  }
  return { cartId: cookieCart?.id ?? null, userId: null };
}

export async function GET() {
  try {
    const { cartId } = await ensureCartFollowingSession({
      createForGuest: false,
    });
    if (!cartId) {
      return NextResponse.json({
        items: [],
        summary: { itemsCount: 0, totalCents: 0 },
      });
    }

    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                priceCents: true,
                images: { select: { url: true }, orderBy: { position: "asc" } },
              },
            },
            variant: { select: { id: true, name: true, priceCents: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    const items = cart?.items ?? [];
    const res = NextResponse.json({ items, summary: computeSummary(items) });
    await setCartCookie(res, cartId); // fixa cookie pro carrinho final
    return res;
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Erro ao carregar carrinho" },
      { status: 500 }
    );
  }
}

/** ==========
 *  POST (usa ensureMutableCartId)
 *  ========== */
export async function POST(req: NextRequest) {
  const { productId, quantity = 1 } = await req.json();
   const { cartId, setCookieTo } = await ensureMutableCartId();

  try {
    const body = await req.json();
    const productId = Number(body?.productId);
    const variantId = body?.variantId ?? null;
    const quantity = Math.max(1, Number(body?.quantity ?? 1) | 0);

    if (!Number.isFinite(productId) || productId <= 0) {
      return NextResponse.json(
        { error: "productId inválido" },
        { status: 400 }
      );
    }

    // HARDENING: obtém carrinho seguro para mutação
    const { cartId, setCookieTo } = await ensureMutableCartId();

    // checa produto ativo e obtém preço
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { isActive: true, priceCents: true },
    });
    if (!product || !product.isActive) {
      return NextResponse.json(
        { error: "Produto indisponível" },
        { status: 400 }
      );
    }

    const unitPrice = variantId
      ? (
          await prisma.productVariant.findUnique({
            where: { id: String(variantId) },
            select: { priceCents: true },
          })
        )?.priceCents
      : product.priceCents;

    // adiciona ou incrementa item
    const existing = await prisma.cartItem.findFirst({
      where: { cartId, productId, variantId: variantId ?? null },
    });

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId,
          productId,
          variantId,
          quantity,
          unitCents: unitPrice ?? 0,
        },
      });
    }

    // snapshot atualizado
    const items = await prisma.cartItem.findMany({
      where: { cartId },
      select: { quantity: true, unitCents: true },
    });

    const res = NextResponse.json({ ok: true, summary: computeSummary(items) });
    if (setCookieTo) await setCartCookie(res, setCookieTo);
    return res;
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Erro ao adicionar ao carrinho" },
      { status: 500 }
    );
  }

  await prisma.cartItem.create({
    data: { cartId, productId, quantity, unitCents: 0 /* defina conforme seu preço */ },
  });
  const res = NextResponse.json({ ok: true, cartId });
  if (setCookieTo !== undefined) setCartCookie(res, setCookieTo);
  return res;
}

/** ==========
 *  PUT (usa ensureMutableCartId)
 *  ========== */
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const itemId = String(body?.itemId ?? "");
    const quantity = Number(body?.quantity);

    if (!itemId)
      return NextResponse.json(
        { error: "itemId obrigatório" },
        { status: 400 }
      );
    if (!Number.isFinite(quantity))
      return NextResponse.json({ error: "quantity inválido" }, { status: 400 });

    const { cartId, setCookieTo } = await ensureMutableCartId();

    if (quantity <= 0) {
      await prisma.cartItem.deleteMany({ where: { id: itemId, cartId } });
    } else {
      await prisma.cartItem.updateMany({
        where: { id: itemId, cartId },
        data: { quantity },
      });
    }

    const items = await prisma.cartItem.findMany({
      where: { cartId },
      select: { quantity: true, unitCents: true },
    });

    const res = NextResponse.json({ ok: true, summary: computeSummary(items) });
    if (setCookieTo) await setCartCookie(res, setCookieTo);
    return res;
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Erro ao atualizar quantidade" },
      { status: 500 }
    );
  }
}

/** ==========
 *  DELETE (usa ensureMutableCartId)
 *  ========== */
export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const clearAll = url.searchParams.get("all");
    const { cartId, setCookieTo } = await ensureMutableCartId();

    if (clearAll === "1" || clearAll === "true") {
      await prisma.cartItem.deleteMany({ where: { cartId } });
      const res = NextResponse.json({
        ok: true,
        summary: { itemsCount: 0, totalCents: 0 },
      });
      if (setCookieTo) await setCartCookie(res, setCookieTo);
      return res;
    }

    const body = await req.json().catch(() => ({}));
    const itemId = String(body?.itemId ?? "");
    if (!itemId)
      return NextResponse.json(
        { error: "itemId obrigatório" },
        { status: 400 }
      );

    await prisma.cartItem.deleteMany({ where: { id: itemId, cartId } });

    const items = await prisma.cartItem.findMany({
      where: { cartId },
      select: { quantity: true, unitCents: true },
    });

    const res = NextResponse.json({ ok: true, summary: computeSummary(items) });
    if (setCookieTo) await setCartCookie(res, setCookieTo);
    return res;
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Erro ao remover item" },
      { status: 500 }
    );
  }
}
