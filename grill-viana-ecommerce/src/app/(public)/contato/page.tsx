import { AtSign, Instagram, PhoneCall } from "lucide-react";
import BackButton from "../_components/backbutton";
import Header from "../_components/header";

export default function Contato() {
  return (
    <>
      <Header />
      <BackButton />
      <section className="w-full">
        <div className="mx-[5%] flex flex-col items-center justify-center text-center pt-8">
          <h1 className="text-3xl font-bold mb-4">
            Fale com a <span className="text-red-800">gente!</span>
          </h1>
          <p className="text-base text-gray-600 font-medium mb-16">
            É só escolher o canal que preferir: estamos disponíveis no
            Instagram, Telefone, Whatsapp e E-mail.
          </p>
        </div>
        <div className="mx-[5%] grid grid-cols-3 items-center justify-center">
          <div className="flex flex-col items-center">
            <span className="flex items-center justify-center w-24 h-24 bg-red-800 rounded-full mb-4">
              <Instagram size="32" fill="white" stroke="#9F0712" strokeWidth={2} />
            </span>

            <h2 className="font-medium text-lg">Instagram</h2>
            <caption className="font-bold text-xl text-wrap">@grillviana</caption>
          </div>
          <div className="flex flex-col items-center">
            <span className="flex items-center justify-center w-24 h-24 bg-red-800 rounded-full mb-4">
              <PhoneCall size="32" fill="white" stroke="#9F0712" strokeWidth={0} />
            </span>

            <h2 className="font-medium text-lg">Telefone</h2>
            <caption className="font-bold text-xl text-wrap">(19) 1234-5678</caption>
          </div>
          <div className="flex flex-col items-center">
            <span className="flex items-center justify-center w-24 h-24 bg-red-800 rounded-full mb-4">
              <AtSign size="32" stroke="white" />
            </span>

            <h2 className="font-medium text-lg">E-mail</h2>
            <caption className="font-bold text-xl text-wrap">henrique.vendas@grillviana.com</caption>
          </div>
        </div>
      </section>
    </>
  );
}
