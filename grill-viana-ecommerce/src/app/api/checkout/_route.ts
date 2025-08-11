export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MercadoPagoConfig, Preference } from "mercadopago";

export async function POST(req: Request) {
  try {
    const { productId, quantity = 1 } = await req.json();
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });

    const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });
    const pref = await new Preference(client).create({
      body: {
        items: [
          {
            id: product.id,
            title: product.name,
            quantity,
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
        notification_url: `${process.env.APP_URL}/api/webhooks/mercadopago`,
      },
    });

    return NextResponse.json({ id: pref.id, init_point: pref.init_point });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro ao criar preferência" }, { status: 500 });
  }
}