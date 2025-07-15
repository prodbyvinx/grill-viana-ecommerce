import Header from "../_components/header";
import CatalogContent from "./_components/catalogcontent";

export default function Catalogo() {
  return (
    <>
      <section className="bg-gray-100">
        <Header />
        <div className="w-full flex justify-center items-center my-8">
          <div className="flex w-[70%] flex-col text-center gap-3">
            <h1 className="text-3xl font-bold">
              Nosso <span className="text-red-800">Catálogo</span>
            </h1>
            <p className="text-base">
              Modelos para todos os estilos e espaços, da varanda ao quintal.{" "}
              <span className="font-semibold">
                Qualidade, praticidade e sabor reunidos em um só lugar
              </span>
              .
            </p>
          </div>
        </div>
        <CatalogContent />
      </section>
    </>
  );
}
