import BackButton from "../_components/backbutton";
import Header from "../_components/header";
import Image from "next/image";
import RatingsCarousel from "../_components/ratingscarousel";
import { BadgeCheck } from "lucide-react";
import Link from "next/link";

export default function Sobre() {
  return (
    <>
      <main className="flex flex-col w-full">
        <Header />
        <BackButton />
        <article className="flex flex-col items-center justify-center mb-8 bg-white mx-[5%]">
          <div className="flex flex-col items-center justify-center gap-4 p-4">
            <Image
              src="/images/black-circle-logo.png"
              alt="Logo Grill Viana"
              width={80}
              height={80}
            />
          </div>
          <h1 className="text-center text-2xl font-semibold text-gray-700">
            Muito mais que churrasqueiras <br />{" "}
            <span className="text-red-800 font-bold">
              construímos momentos.
            </span>
          </h1>
        </article>
        <article className="flex flex-col mx-[5%] mb-8">
          <h1 className="text-2xl font-semibold text-black">
            Somos a <span className="text-red-800 font-bold">Grill Viana!</span>
          </h1>
          <p className="text-gray-700 font-medium">
            Na Grill Viana, acreditamos que churrasco é muito mais do que
            preparar uma refeição, é criar memórias ao redor da brasa.
          </p>
          <p className="text-gray-700 font-medium text-wrap">
            Fundada por apaixonados por momentos simples e inesquecíveis, nossa
            loja nasceu com o propósito de oferecer churrasqueiras de qualidade,
            práticas e duráveis para todos os tipos de espaços e estilos.
          </p>
        </article>
        <article className="flex flex-row items-center gap-8 mx-[5%] mb-8">
          <figure className="mb-8">
            <Image
              src="/images/ambientado-1.png"
              alt="Sobre a Grill Viana"
              width={600}
              height={400}
              className="rounded-2xl"
            />
          </figure>
          <div>
            <h2 className="text-3xl font-bold text-gray-700 pb-8">Por que escolher a gente?</h2>
            <ul className="space-y-4 text-gray-700 text-lg font-semibold">
              <li className="flex items-center gap-2"><BadgeCheck fill="green" color="white" size={30}/>Qualidade garantida em cada peça</li>
              <li className="flex items-center gap-2"><BadgeCheck fill="green" color="white" size={30}/>Entrega rápida, segura e rastreável para todo o Brasil</li>
              <li className="flex items-center gap-2"><BadgeCheck fill="green" color="white" size={30}/>Suporte que fala a sua língua</li>
              <li className="flex items-center gap-2"><BadgeCheck fill="green" color="white" size={30}/>Compra 100% segura</li>
            </ul>
          </div>
        </article>
        <article className="flex flex-col mx-[5%] mb-8">
          <h2 className="text-2xl font-bold text-black pb-4">Um pouco dos <span className="text-red-800 font-bold">Bastidores</span></h2>
          <p className="text-gray-700 font-medium pb-2">
            Muito além do clique no carrinho, existe uma equipe inteira cuidando
            de cada detalhe para que a sua churrasqueira chegue perfeita até a
            sua casa.
          </p>
          <p className="text-gray-700 font-medium pb-8">
            Do momento em que o pedido é confirmado até o envio, nossos
            profissionais conferem cada item e preparam a embalagem com todo o
            cuidado, afinal, sabemos que você está esperando mais do que um
            produto: está esperando um momento especial.
          </p>
          <section className="w-full flex flex-row justify-between mb-8 bg-white">
            <Image
              src="/images/fixa.png"
              alt="Bastidores Grill Viana"
              width={300}
              height={300}
              className="rounded-2xl"
            />
            <Image
              src="/images/fixa.png"
              alt="Bastidores Grill Viana"
              width={300}
              height={300}
              className="rounded-2xl"
            />
            <Image
              src="/images/fixa.png"
              alt="Bastidores Grill Viana"
              width={300}
              height={300}
              className="rounded-2xl"
            />
            <Image
              src="/images/fixa.png"
              alt="Bastidores Grill Viana"
              width={300}
              height={300}
              className="rounded-2xl"
            />
          </section>
        </article>
        <section>
          <RatingsCarousel />
        </section>
        <footer className="flex flex-col items-center justify-center gap-4 bg-white p-8 mx-[5%] mb-8">
          <h1 className="text-3xl font-bold text-black">Vamos <span className="text-red-800 font-bold">conversar?</span></h1>
          <p className="text-gray-700 font-semibold text-lg">Ficou com alguma dúvida ou quer saber mais?</p>
          <p className="text-gray-700 font-medium text-base mb-2">Entre em contato com a gente pelo SAC, Whatsapp, E-mail ou nossas redes sociais. Será um prazer falar com você!</p>
          <Link href="/contato"  className="w-full bg-red-800 rounded-md p-4 text-center hover:bg-red-700 transition-colors duration-200">
            <p className="text-white font-bold">Fale com a gente</p>
          </Link>
          <Link href="/catalogo" className="w-full bg-white border-red-800 border-2 rounded-md p-4 text-center hover:bg-gray-100 transition-colors duration-200">
            <p className="text-red-800 font-bold">Ver nossos produtos</p>
          </Link>
        </footer>
      </main>
    </>
  );
}
