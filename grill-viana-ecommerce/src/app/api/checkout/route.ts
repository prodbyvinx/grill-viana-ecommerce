import { prisma } from "@/lib/prisma";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { z } from "zod";
import { NextResponse } from "next/server";

const mp = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });

const pref = await new Preference(mp).create({
  body: {
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
    notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/mercadopago`,
  },
});

const BodySchema = z.object({
  productId: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  quantity: z.number().int().positive().default(1),
});

export async function GET() {
  const state = crypto.randomUUID();
  const url = new URL(
    "https://www.bling.com.br/Api/v3/oauth/authorize?response_type=code&client_id=27925cb0dd1bbecfa84c4c9ceb6c6c549865b72a&state=88f1d024a806c2cad9f20b1eb8cf5dfd"
  );
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", process.env.BLING_CLIENT_ID!);
  url.searchParams.set("state", state);
  return NextResponse.redirect(url.toString(), { status: 302 });
}

export async function POST(req: Request) {
  // 1) Validação do body
  const body = BodySchema.parse(await req.json());
  const { slug, productId, quantity: qty } = body;

  // 2) Buscar produto
  let product = null;
  if (slug) product = await prisma.product.findUnique({ where: { slug } });
  if (!product && productId) {
    product = await prisma.product.findUnique({
      where: { id: Number(productId) },
    });
  }
  if (!product) {
    return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
  }

  // 3) Calcular preço e quantidade
  const quantity = qty ?? 1;
  const unitPrice = (product.priceCents ?? 0) / 100;

  // 4) Criar preferência no MP
  const mp = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN!,
  });
  const prefClient = new Preference(mp);

  const pref = await prefClient.create({
    body: {
      items: [
        {
          id: String(product.id),
          title: product.name,
          quantity,
          unit_price: unitPrice,
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
      notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/mercadopago`,
    },
    requestOptions: { idempotencyKey: crypto.randomUUID() },
  });

  // 5) Resposta
  return NextResponse.json({
    id: pref.id,
    init_point: pref.init_point,
    sandbox_init_point: pref.sandbox_init_point,
  });
}
