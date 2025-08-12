import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { z } from "zod";

const mp = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });

const pref = await new Preference(mp).create({
  body: {
    items: [
      {
        id: String(product.id),
        title: product.name,
        quantity, // number inteiro
        unit_price: Number(unitPrice), // em reais
        currency_id: "BRL",
      },
    ],
    back_urls: {
      success: `${process.env.NEXT_PUBLIC_SITE_URL}/pedido/sucesso`,
      failure: `${process.env.NEXT_PUBLIC_SITE_URL}/pedido/erro`,
      pending: `${process.env.NEXT_PUBLIC_SITE_URL}/pedido/pendente`,
    },
    auto_return: "approved",
    external_reference: `gv-${product.id}`,
    metadata: { productId: product.id, slug: product.slug },
    // notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/mercadopago`,
  },
  // requestOptions: { idempotencyKey: crypto.randomUUID() }, // opcional
});

const BodySchema = z.object({
  productId: z.number().int().positive().optional(),
  slug: z.string().min(1).optional(),
  quantity: z.number().int().positive().default(1),
});

export async function POST(req: Request) {
  try {
    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Informe slug ou productId" }, { status: 400 });
    }

    const { productId, slug, quantity } = parsed.data;

    if (!productId && !slug) {
      return NextResponse.json({ error: "Informe slug ou productId" }, { status: 400 });
    }

    // Busca pelo que tiver disponível
    const product = productId
      ? await prisma.product.findUnique({ where: { id: productId } })
      : await prisma.product.findUnique({ where: { slug: slug! } });

    if (!product) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
    }

    // Se seu schema usa priceCents (inteiro), converta para reais
    const unitPrice = (product as any).priceCents
      ? (product as any).priceCents / 100
      : (product as any).price; // fallback se ainda tiver `price` legado

    const mp = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });
    const pref = await new Preference(mp).create({
      items: [
        {
          id: String(product.id),
          title: product.name,
          quantity,
          unit_price: Number(unitPrice),
          currency_id: "BRL",
        },
      ],
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_SITE_URL}/pedido/sucesso`,
        failure: `${process.env.NEXT_PUBLIC_SITE_URL}/pedido/erro`,
        pending: `${process.env.NEXT_PUBLIC_SITE_URL}/pedido/pendente`,
      },
      auto_return: "approved",
      external_reference: `gv-${product.id}`,
      metadata: { productId: product.id, slug: product.slug },
    });

    return NextResponse.json({ id: pref.id, init_point: pref.init_point }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Falha ao criar checkout" }, { status: 500 });
  }
}