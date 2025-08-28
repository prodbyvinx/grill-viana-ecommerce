import "server-only";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth-options";

export async function ensureMutableCartId() {
  const session = await getServerSession(authOptions);
  const cookieStore = cookies();
  const cookieId = cookieStore.get("cartId")?.value || null;

  // Logado: usa/cria carrinho do usuário
  if (session?.user?.id) {
    const userId = Number((session.user as any).id);
    let userCart = await prisma.cart.findFirst({ where: { userId, status: "ACTIVE" } });
    if (!userCart) userCart = await prisma.cart.create({ data: { userId, status: "ACTIVE" } });
    // opcional: sincronizar cookie com o id do carrinho atual
    return { cartId: userCart.id, userId, setCookieTo: userCart.id as string | undefined };
  }

  // Guest: se não tem cookie, cria carrinho
  if (!cookieId) {
    const guest = await prisma.cart.create({ data: { status: "ACTIVE" } });
    return { cartId: guest.id, userId: null, setCookieTo: guest.id };
  }

  // Se cookie aponta para carrinho de user, faz fork para guest
  const cart = await prisma.cart.findUnique({ where: { id: cookieId }, include: { items: true } });
  if (cart?.userId) {
    const newCart = await prisma.cart.create({ data: { status: "ACTIVE" } });
    if (cart.items.length) {
      await prisma.cartItem.createMany({
        data: cart.items.map((it) => ({
          cartId: newCart.id,
          productId: it.productId,
          variantId: it.variantId ?? null,
          quantity: it.quantity,
          unitCents: it.unitCents,
        })),
      });
    }
    return { cartId: newCart.id, userId: null, setCookieTo: newCart.id };
  }

  // Já é guest
  return { cartId: cookieId, userId: null, setCookieTo: undefined };
}