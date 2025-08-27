import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function SuccessPage({ searchParams }: { searchParams: { ref?: string } }) {
  const ref = searchParams?.ref;
  const order = ref ? await prisma.order.findFirst({ where: { externalRef: ref } }) : null;
  return (
    <div className="max-w-xl mx-auto py-16">
      <h1 className="text-2xl font-semibold">Pagamento aprovado!</h1>
      <p className="mt-4">Pedido: <b>{order?.id}</b> — Status: <b>{order?.status}</b></p>
      <p className="mt-2 text-sm text-muted-foreground">Você receberá um e-mail com os detalhes.</p>
      <Link href="/" className="text-red-700 hover:underline">Voltar para a loja</Link>
    </div>
  );
}