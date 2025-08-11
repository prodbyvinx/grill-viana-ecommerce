// src/app/api/checkout/mercadopago/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MercadoPagoConfig, Preference } from "mercadopago";
import crypto from "node:crypto";

type Payload = { slug: string; quantity?: number };

export async function POST(req: Request) {
  try {
    const { slug, quantity = 1 } = (await req.json()) as Payload;

    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ error: "slug obrigatório" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { slug } });
    if (!product) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
    }

    if (!process.env.MP_ACCESS_TOKEN) {
      return NextResponse.json({ error: "MP_ACCESS_TOKEN não configurado" }, { status: 500 });
    }

    const qty = Number.isFinite(quantity) && quantity > 0 ? Math.floor(quantity) : 1;

    const client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN!,
      options: { idempotencyKey: crypto.randomUUID() },
    });

    const body: any = {
      items: [
        {
          id: product.id,
          title: product.name,
          quantity: qty,
          currency_id: "BRL",
          unit_price: product.priceCents / 100,
        },
      ],
      back_urls: {
        success: `${process.env.APP_URL}/checkout/sucesso`,
        failure: `${process.env.APP_URL}/checkout/erro`,
        pending: `${process.env.APP_URL}/checkout/pendente`,
      },
      auto_return: "approved",
    };

    // Evita notification_url em localhost
    if (process.env.APP_URL?.startsWith("https://")) {
      body.notification_url = `${process.env.APP_URL}/api/webhooks/mercadopago`;
    }

    const pref = await new Preference(client).create({ body });
    const url = pref.init_point ?? (pref as any).sandbox_init_point;
    if (!url) {
      return NextResponse.json(
        { error: "Preference criada sem URL de pagamento" },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: pref.id, init_point: url });
  } catch (e: any) {
    console.error("MP Preference Error:", e?.message, e?.cause ?? e);
    return NextResponse.json(
      { error: e?.message ?? "Erro ao criar preferência" },
      { status: 500 }
    );
  }
}
