import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mp } from "@/lib/mercadopago";

export async function POST(req: Request) {
  const body = await req.json();
  // eventos diferentes: payment, merchant_order...
  const paymentId = body?.data?.id ?? body?.id;
  if (!paymentId) return NextResponse.json({ ok: true });

  const payment = await mp.payment.get(paymentId);
  const status = payment.body.status; // approved, rejected, pending...
  const prefId = payment.body.order?.id || payment.body.metadata?.preference_id;

  // idempotência: cheque se já processou
  let order = await prisma.order.findFirst({ where: { mpPreferenceId: prefId } });

  if (!order && prefId) {
    // criar pedido a partir do snapshot do carrinho
    const cart = await prisma.cart.findFirst({ where: { checkoutPreferenceId: prefId }, include: { items: true } });
    if (cart) {
      order = await prisma.$transaction(async tx => {
        const created = await tx.order.create({
          data: {
            userId: cart.userId,
            mpPreferenceId: prefId,
            mpPaymentId: String(paymentId),
            status: "CREATED",
            totalCents: cart.items.reduce((a,i)=>a+i.quantity*(i.unitCents??0),0),
          }
        });
        await tx.orderItem.createMany({
          data: cart.items.map(i => ({
            orderId: created.id,
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
            unitCents: i.unitCents ?? 0,
          }))
        });
        // fechar carrinho
        await tx.cart.update({ where: { id: cart.id }, data: { status: "CLOSED" as any }});
        return created;
      });
    }
  }

  if (order) {
    const next = status === "approved" ? "PAID"
               : status === "rejected" ? "FAILED"
               : "PENDING";
    await prisma.order.update({ where: { id: order.id }, data: { status: next } });
  }

  return NextResponse.json({ ok: true });
}
