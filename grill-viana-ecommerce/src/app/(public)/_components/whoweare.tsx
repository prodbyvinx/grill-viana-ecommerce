import Image from "next/image";
import { Badge, BadgeCheck } from "lucide-react";

export default function WhoWeAre() {
  return (
    <>
      <section className="py-8 w-full flex bg-gray-100 justify-center items-center">
        <div className="grid grid-cols-2 gap-3 w-[70%]">
          <main>
            <Image
              src="/images/ambientado-1.png"
              width={520}
              height={520}
              style={{objectFit: "fill"}}
              alt="Churrasco Ambientado"
              className="rounded-2xl"
            />
          </main>
          <aside className="flex flex-col gap-2.5 justify">
            <div>
              <Image
                src="/images/black-logo.png"
                width={150}
                height={150}
                alt="Logo Grill Viana"
              />
            </div>
            <h1 className="font-bold text-3xl">
              Somos a <span className="text-red-800">Grill Viana</span>!
            </h1>
            <p className="text-gray-700">
              Na Grill Viana, não vendemos apenas churrasqueiras, oferecemos a
              você a chave para experiências inesquecíveis.
            </p>
            <p className="font-medium text-gray-700">
              Nosso diferencial reside em três pilares fundamentais.
            </p>
            <div className="flex flex-col gap-3 -ml-1">
              <p className="flex">
                <BadgeCheck fill="green" color="white" size={30}/>
                <span className="ml-4 font-medium">Qualidade Incomparável e Durabilidade</span>
              </p>
              <p className="flex">
                <BadgeCheck fill="green" color="white" size={30}/>
                <span className="ml-4 font-medium">A Experiência de Churrasco Elevada</span>
              </p>
              <p className="flex">
                <BadgeCheck fill="green" color="white" size={30}/>
                <span className="ml-4 font-medium">Variedade e Versatilidade para Cada Churrasqueiro</span>
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
