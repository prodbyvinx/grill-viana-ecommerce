import { Truck, WalletMinimal } from "lucide-react";

export default function Conditions() {
  return (
    <>
      <section>
        <div className="bg-white h-50 flex items-center justify-center gap-36 text-gray-600">
          <div className="flex items-start gap-2 bg-gray-50 p-4 rounded-lg">
            <Truck className="self-center h-12 w-12 mr-2" />
            <div className="flex flex-col">
              <h2 className="font-bold">Frete Grátis</h2>
              <p className="">Acima de R$200,00 para todo o Brasil</p>
            </div>
          </div>

          <div className="flex items-start gap-2 bg-gray-50 p-4 rounded-lg  ">
            <WalletMinimal className="self-center h-12 w-12 mr-2" />
            <div className="flex flex-col">
              <h2 className="font-bold">Até 10x sem juros</h2>
              <p>Parcela mínima de R$30,00</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
