import Link from "next/link";

export default function ErrorPage() {
  return (
    <div className="max-w-xl mx-auto py-16">
      <h1 className="text-2xl font-semibold">Pagamento não aprovado</h1>
      <p className="mt-4">Infelizmente, não conseguimos processar seu pagamento.</p>
      <Link href="/" className="text-blue-500 hover:underline">Voltar para a loja</Link>
    </div>
  );
}