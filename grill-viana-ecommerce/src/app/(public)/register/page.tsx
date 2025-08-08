"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BackButton from "../_components/backbutton";
import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (res.ok) {
        router.push("/login");
      } else {
        const { error } = await res.json();
        setError(error);
      }
    } catch (err) {
      setError("Erro no servidor. Tente novamente.");
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
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-gray-50 focus:bg-white h-12"
              required
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button
            type="submit"
            className="w-full bg-red-800 hover:bg-red-700 cursor-pointer"
          >
            Cadastrar
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
