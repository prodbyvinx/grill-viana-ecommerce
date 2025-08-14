import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { mpPayment, mpPreference } from "@/lib/mercadopago";

type Action = "checkout" | "webhook";
function getAction(req: Request): Action | undefined {
  const url = new URL(req.url);
  return (url.searchParams.get("action") as Action | null) ?? undefined;
}

export async function GET() {
  return NextResponse.json({ ok: true, service: "mercadopago" });
}

export async function POST(req: Request) {
  const action = getAction(req);

  if (action === "checkout") return handleCheckout(req);
  if (action === "webhook")  return handleWebhook(req);

  return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
}

// ============= CHECKOUT =============
const CheckoutSchema = z.object({
  productId: z.number(),
  quantity: z.number().min(1),
  unitPriceCents: z.number().min(1),
  customerEmail: z.string().email().optional(),
});

async function handleCheckout(req: Request) {
  try {
    const body = await req.json();
    const { productId, quantity, unitPriceCents, customerEmail } = CheckoutSchema.parse(body);

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || !product.isActive) {
      return NextResponse.json({ error: "Produto indisponível" }, { status: 400 });
    }

    const totalCents = unitPriceCents * quantity;

    const order = await prisma.order.create({
      data: {
        status: "pending",
        totalCents,
        customerEmail: customerEmail ?? null,
        externalRef: "", // definido já já
      },
    });

    const externalRef = `gv-${order.id}`;
    await prisma.order.update({ where: { id: order.id }, data: { externalRef } });

    const pref = await mpPreference.create({
      body: {
        items: [{
          id: String(product.id),
          title: product.name,
          quantity,
          unit_price: Number((unitPriceCents / 100).toFixed(2)),
          currency_id: "BRL",
        }],
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_SITE_URL}/pedido/sucesso?ref=${externalRef}`,
          failure: `${process.env.NEXT_PUBLIC_SITE_URL}/pedido/erro?ref=${externalRef}`,
          pending: `${process.env.NEXT_PUBLIC_SITE_URL}/pedido/pendente?ref=${externalRef}`,
        },
        auto_return: "approved",
        external_reference: externalRef,
        metadata: { productId: product.id, slug: product.slug },
        notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/mp?action=webhook`,
      },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { mpPreferenceId: pref.id ?? null, mpInitPoint: pref.init_point ?? null },
    });

    return NextResponse.json({
      ok: true,
      preferenceId: pref.id,
      initPoint: pref.init_point,
      externalRef,
      orderId: order.id,
    });
  } catch (err: any) {
    console.error("checkout error", err);
    return NextResponse.json({ error: err?.message ?? "Erro no checkout" }, { status: 500 });
  }
}

// ============= WEBHOOK =============
async function handleWebhook(req: Request) {
  try {
    const json = await req.json().catch(() => ({}));
    const { type, data } = json as { type?: string; data?: { id?: string } };

    if (type !== "payment" || !data?.id) {
      return NextResponse.json({ ignored: true }, { status: 200 });
    }

    const paymentId = String(data.id);
    const payment = await mpPayment.get({ id: paymentId });

    const external_reference = payment.external_reference as string | undefined;
    const amount = Math.round(Number(payment.transaction_amount ?? 0) * 100);
    const mpStatus = String(payment.status ?? "");
    const mpStatusDetail = String(payment.status_detail ?? "");

    if (!external_reference) {
      return NextResponse.json({ error: "Sem external_reference" }, { status: 200 });
    }

    const order = await prisma.order.findFirst({ where: { externalRef: external_reference } });
    if (!order) {
      return NextResponse.json({ error: "Pedido não encontrado" }, { status: 200 });
    }

    if (order.lastPaymentId === paymentId) {
      return NextResponse.json({ ok: true, idempotent: true }, { status: 200 });
    }

    const newStatus =
      mpStatus === "approved"      ? "paid" :
      mpStatus === "in_process"    ? "pending" :
      mpStatus === "pending"       ? "pending" :
      mpStatus === "rejected"      ? "failed"  :
      mpStatus === "cancelled"     ? "failed"  :
      mpStatus === "refunded"      ? "refunded":
      mpStatus === "charged_back"  ? "refunded": "pending";

    const paymentRecord = order.paymentId
      ? await prisma.payment.update({
          where: { id: order.paymentId }, // <-- corrige aqui
          data: {
            amountCents: amount,
            status: newStatus,
            mpPaymentId: paymentId,
            mpStatus,
            mpStatusDetail,
          },
        })
      : await prisma.payment.create({
          data: {
            method: "mercadopago",
            amountCents: amount,
            status: newStatus,
            mpPaymentId: paymentId,
            mpStatus,
            mpStatusDetail,
          },
        });

    await prisma.order.update({
      where: { id: order.id },
      data: { status: newStatus, paymentId: paymentRecord.id, lastPaymentId: paymentId },
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("webhook mp error", err);
    return NextResponse.json({ error: err?.message ?? "Erro no webhook" }, { status: 200 });
  }
}
