import Link from "next/link";

export default function PendingPage() {
  return (
    <div className="max-w-xl mx-auto py-16">
      <h1 className="text-2xl font-semibold">Pagamento pendente</h1>
      <p className="mt-4">Assim que o MercadoPago confirmar, atualizaremos seu pedido.</p>
      <Link href="/" className="text-red-700 hover:underline">Voltar para a loja</Link>
    </div>
  );
}