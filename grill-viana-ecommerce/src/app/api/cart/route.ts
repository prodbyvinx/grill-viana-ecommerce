import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function computeSummary(items: Array<{ quantity: number; unitCents: number }>) {
  const itemsCount = items.reduce((acc, i) => acc + i.quantity, 0);
  const totalCents = items.reduce((acc, i) => acc + i.quantity * i.unitCents, 0);
  return { itemsCount, totalCents };
}

async function getCartId() {
  const cookieStore = await cookies();
  return cookieStore.get("cartId")?.value;
}

async function setCartCookie(res: NextResponse, cartId: string) {
  res.cookies.set("cartId", cartId, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30d
  });
}

export async function GET() {
  try {
    const cartId = await getCartId();
    if (!cartId) {
      return NextResponse.json({ items: [], summary: { itemsCount: 0, totalCents: 0 } });
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
    return NextResponse.json({ items, summary: computeSummary(items) });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Erro ao carregar carrinho" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const productId = Number(body?.productId);
    const variantId = body?.variantId ?? null;
    const quantity = Math.max(1, Number(body?.quantity ?? 1) | 0);

    if (!Number.isFinite(productId) || productId <= 0) {
      return NextResponse.json({ error: "productId inválido" }, { status: 400 });
    }

    // garante o carrinho
    let cartId = await getCartId();
    let cart = cartId ? await prisma.cart.findUnique({ where: { id: cartId } }) : null;
    if (!cart) {
      cart = await prisma.cart.create({ data: {} });
      cartId = cart.id;
    }

    // checa produto ativo e obtém preço
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { isActive: true, priceCents: true },
    });
    if (!product || !product.isActive) {
      return NextResponse.json({ error: "Produto indisponível" }, { status: 400 });
    }

    const unitPrice = variantId
      ? (
          await prisma.productVariant.findUnique({
            where: { id: String(variantId) },
            select: { priceCents: true },
          })
        )?.priceCents
      : product.priceCents;

    // adiciona ou incrementa item (escopado por cartId)
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
          cartId: cartId!,
          productId,
          variantId,
          quantity,
          unitCents: unitPrice ?? 0,
        },
      });
    }

    // snapshot atualizado
    const items = await prisma.cartItem.findMany({
      where: { cartId: cartId! },
      select: { quantity: true, unitCents: true },
    });

    const res = NextResponse.json({ ok: true, summary: computeSummary(items) });
    await setCartCookie(res, cartId!);
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Erro ao adicionar ao carrinho" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const itemId = String(body?.itemId ?? "");
    const quantity = Number(body?.quantity);

    if (!itemId) return NextResponse.json({ error: "itemId obrigatório" }, { status: 400 });
    if (!Number.isFinite(quantity)) return NextResponse.json({ error: "quantity inválido" }, { status: 400 });

    const cartId = await getCartId();
    if (!cartId) return NextResponse.json({ error: "Carrinho não encontrado" }, { status: 400 });

    if (quantity <= 0) {
      await prisma.cartItem.deleteMany({ where: { id: itemId, cartId } });
    } else {
      await prisma.cartItem.updateMany({ where: { id: itemId, cartId }, data: { quantity } });
    }

    const items = await prisma.cartItem.findMany({
      where: { cartId },
      select: { quantity: true, unitCents: true },
    });
    return NextResponse.json({ ok: true, summary: computeSummary(items) });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Erro ao atualizar quantidade" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const clearAll = url.searchParams.get("all");
    const cartId = await getCartId();
    if (!cartId) {
      return NextResponse.json({ ok: true, summary: { itemsCount: 0, totalCents: 0 } });
    }

    if (clearAll === "1" || clearAll === "true") {
      await prisma.cartItem.deleteMany({ where: { cartId } });
      return NextResponse.json({ ok: true, summary: { itemsCount: 0, totalCents: 0 } });
    }

    // remover item específico (escopado ao carrinho)
    const body = await req.json().catch(() => ({}));
    const itemId = String(body?.itemId ?? "");
    if (!itemId) return NextResponse.json({ error: "itemId obrigatório" }, { status: 400 });

    await prisma.cartItem.deleteMany({ where: { id: itemId, cartId } });

    const items = await prisma.cartItem.findMany({
      where: { cartId },
      select: { quantity: true, unitCents: true },
    });
    return NextResponse.json({ ok: true, summary: computeSummary(items) });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Erro ao remover item" }, { status: 500 });
  }
}
