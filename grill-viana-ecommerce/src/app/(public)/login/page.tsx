// app/(public)/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react"; // <- IMPORTANTE
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const search = useSearchParams();

  // se houver callbackUrl use, senão cai na home
  const callbackUrl = search?.get("callbackUrl") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false, // controlamos manualmente
      callbackUrl, // normalmente “/”
    });

    setSubmitting(false);

    if (!res) return setError("Falha inesperada. Tente novamente.");
    if (res.ok) {
      // força a fusão do carrinho do visitante → carrinho do usuário
      await fetch("/api/cart/merge", { method: "POST", cache: "no-store" });

      // vai pra home e reidrata header/badges
      router.replace("/");
      router.refresh();
      return;
    }
  }

  return (
    <main className="min-h-screen mx-[5%] flex flex-col justify-center items-center">
      <div className="mb-16">
        <Image
          src="/images/black-logo.png"
          alt="Logo"
          width={250}
          height={250}
        />
      </div>
      <h1 className="font-semibold text-3xl mb-16">Entre na sua conta</h1>
      <form
        onSubmit={onSubmit}
        className="space-y-6 w-[30vw] max-w-[520px] min-w-[300px]"
      >
        <Input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="h-12"
        />
        <Input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="h-12"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button
          type="submit"
          disabled={submitting}
          className="w-full bg-red-800 hover:bg-red-700"
        >
          {submitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Entrando...
            </span>
          ) : (
            "Entrar"
          )}
        </Button>
        <div className="text-center">
          <Link
            href="/forgot-password"
            className="text-sm text-gray-500 hover:underline"
          >
            Esqueci minha senha
          </Link>
        </div>
        <div className="text-center text-sm text-gray-500 mt-4">
          Não tem uma conta?{" "}
          <Link href="/register" className="text-red-800 hover:underline">
            Cadastre-se
          </Link>
        </div>
      </form>
    </main>
  );
}
