"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"

interface ContactFormProps {
  /**
   * Callback when the form is submitted.
   * Receives an object with name, email, subject and message.
   */
  onSubmit: (data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) => Promise<void>;
}

export default function SacForm({ onSubmit }: ContactFormProps) {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim())
      return;
    await onSubmit({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-[5%] pb-8"
      >
        {/* Nome Completo */}
        <Input
          type="text"
          placeholder="Nome Completo *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="bg-gray-100 focus:bg-white h-12"
        />
        {/* E-mail */}
        <Input
          type="email"
          placeholder="E-mail *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-gray-100 focus:bg-white h-12"
        />
        {/* Assunto (spans two columns) */}
        <Input
          type="text"
          placeholder="Assunto *"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          className="col-span-1 md:col-span-2 bg-gray-100 focus:bg-white h-12"
        />
        {/* Mensagem (spans two columns) */}
        <Textarea
          placeholder="Mensagem *"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          required
          className="col-span-1 md:col-span-2 resize-none bg-gray-100 focus:bg-white h-36"
        />
        {/* Botão de envio (spans two columns) */}
        <Button
          type="submit"
          disabled={
            !name.trim() || !email.trim() || !subject.trim() || !message.trim()
          }
          className="col-span-1 md:col-span-2 w-full bg-red-800 hover:bg-red-900"
          onClick={() => {toast("Mensagem enviada com sucesso!", { description: "Agradecemos pelo seu contato!", position: "bottom-right" })}}
        >
          Enviar minha mensagem
        </Button>
      </form>
    </>
  );
}
