import { NextResponse } from "next/server";
import { mpPreference } from "@/lib/mercadopago";
import { prisma } from "@/lib/prisma";
import { ensureMutableCartId } from "@/lib/server/cart-guard";
import { setCartCookie } from "@/lib/cart-cookie";
import { headers } from "next/headers";

export async function POST() {
  const host = headers().get("host")!;
  const base = `https://${host}`;

  const { cartId, setCookieTo } = await ensureMutableCartId();

  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: { items: { include: { product: true, variant: true } } },
  });
  if (!cart || cart.items.length === 0) {
    return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 });
  }

  const items = cart.items.map((ci) => ({
    title:
      ci.variant?.name ??
      cart.items.find((x) => x.id === ci.id)?.product?.name ??
      "Item",
    quantity: ci.quantity,
    currency_id: "BRL",
    unit_price: (ci.unitCents ?? ci.product?.priceCents ?? 0) / 100,
  }));

  const pref = await mpPreference.create({
    items,
    binary_mode: true, // aprova/reprova sem análise manual
    notification_url: process.env.MP_NOTIFICATION_URL,
    back_urls: {
      success: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/sucesso`,
      failure: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/erro`,
      pending: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/pendente`,
    },
    auto_return: "approved",
    statement_descriptor: "GRILL VIANA",
    metadata: { cartId },
    body: {
      items,
      back_urls: {
        success: `${base}/checkout/sucesso`,
        failure: `${base}/checkout/erro`,
        pending: `${base}/checkout/pendente`,
      },
      notification_url: `${base}/api/webhooks/mercadopago`,
      auto_return: "approved",
      binary_mode: true,
      metadata: { cartId },
    },

  });

  // opcional: marcar o carrinho como “LOCKED”
  await prisma.cart.update({
    where: { id: cartId },
    data: { checkoutPreferenceId: pref.id, status: "LOCKED" as any },
  });

  const res = NextResponse.json({
    init_point: pref.body.init_point,
    preferenceId: pref.body.id,
  });
  if (setCookieTo) setCartCookie(res, setCookieTo);
  return res;
}
