"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BackButton from "../_components/backbutton";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";


export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }
    try {
      // 1) Cria o usuário no banco via rota de cadastro
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Erro ao registrar.");
      }

      // 2) (Opcional) Já faz login automático após cadastro
      const login = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (login?.ok) {
        router.push("/dashboard");
      } else {
        // Se preferir, redirecione para /login
        router.push("/login");
      }
    } catch (err: any) {
      setError(err?.message || "Falha ao registrar.");
    } finally {
      setSubmitting(false);
    }
  }

  

  return (
    <>
      <BackButton />
      <main className="min-h-screen mx-[5%] flex flex-col justify-center items-center">
        <div className="mb-16">
          <Image
            src="/images/black-logo.png"
            alt="Logo"
            width={250}
            height={250}
          />
        </div>
        <h1 className="font-semibold text-3xl mb-16">Crie sua conta</h1>
        <form onSubmit={onSubmit} className="space-y-6 w-[30vw]">
          <div className="relative w-full">
            <Input
              id="name"
              type="text"
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-50 focus:bg-white h-12"
              required
            />
          </div>
          <div className="relative w-full">
            <Input
              id="email"
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-50 focus:bg-white h-12"
              required
            />
          </div>
          <div className="relative w-full">
            <Input
              id="password"
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-50 focus:bg-white h-12"
              required
            />
          </div>
          <div className="relative w-full">
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirme a senha"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="bg-gray-50 focus:bg-white h-12"
              required
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button
          type="submit"
          disabled={submitting}
          className="w-full h-11 bg-red-800 hover:bg-red-700 cursor-pointer text-white"
        >
          {submitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Cadastrando...
            </span>
          ) : (
            "Cadastrar"
          )}
        </Button>
          <Link href="/login">
            <p className="text-center text-sm text-gray-500 mt-4">
              Já tem uma conta?{' '}
              <span className="text-red-800 cursor-pointer hover:underline">
                Entrar
              </span>
            </p>
          </Link>
        </form>
      </main>
    </>
  );
}
