"use client";

import Header from "../_components/header";
import BackButton from "../_components/backbutton";
import Questions from "./_components/questions";
import SacForm from "./_components/sacform";
import { Toaster } from "@/components/ui/sonner"

export default function Faq() {
  return (
    <>
      <Header />
      <BackButton />
      <section className="flex flex-col items-center py-8 mx-[5%]">
        <h1 className="text-3xl font-bold">
          <span className="text-red-800">Dúvidas?</span> A gente te ajuda!
        </h1>
        <p className="text-base text-gray-700 mt-2">
          Confira abaixo as respostas para as perguntas mais frequentes sobre
          nossos produtos prazos e formas de envio.
        </p>
        <p className="text-base text-gray-700">
          Se ainda restar alguma dúvida é só preencher o formulário logo abaixo,
          teremos o maior prazer em responder seu e-mail!
        </p>
      </section>
      <Questions />
      <section className="mx-[5%]">
        <div className="mx-[5%]">
          <h2 className="text-3xl font-bold mb-4 text-center">Precisando de <span className="text-red-800">ajuda?</span></h2>
          <p className="text-center text-base text-gray-700 mb-6">
            Fale diretamente com a gente pelo formulário.
          </p>
        </div>
      </section>
      
      <SacForm
        onSubmit={async (data) => {
          // Handle form submission
          console.log("Form submitted:", data);
        }}
      />
      <Toaster />
    </>
  );
}
