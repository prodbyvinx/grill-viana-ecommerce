import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Questions() {
  return (
    <>
      <section className="w-90% mx-[5%] flex flex-col items-center gap-8 py-8">
        <div className="bg-gray-100 w-[100%] rounded-lg p-3">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-md font-medium">
                As churrasqueiras vêm montadas?
              </AccordionTrigger>
              <AccordionContent className="text-md font-medium">
                Nossas churrasqueiras são enviadas desmontadas, com manual de
                instruções e todos os acessórios necessários para montagem. O
                processo é simples e não exige ferramentas especiais. Caso tenha
                alguma dificuldade, nossa equipe de suporte está à disposição
                para ajudar.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="bg-gray-100 w-[100%] rounded-lg p-3">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-md font-medium">Qual o prazo de entrega?</AccordionTrigger>
              <AccordionContent className="text-md font-medium">
                O prazo de entrega varia de acordo com a sua localização e a
                disponibilidade do produto. Consulte o prazo estimado na página do
                produto ou durante o processo de compra. Geralmente, as entregas
                são realizadas entre 5 a 15 dias úteis após a confirmação do
                pagamento.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="bg-gray-100 w-[100%] rounded-lg p-3">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-md font-medium">
                A churrasqueira é indicada para áreas externas?
              </AccordionTrigger>
              <AccordionContent className="text-md font-medium">
                Sim, nossas churrasqueiras são projetadas para uso em áreas
                externas. As churrasqueiras de inox são especialmente duráveis e
                fáceis de limpar, tornando-as ideais para varandas, quintais e
                áreas de lazer ao ar livre.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="bg-gray-100 w-[100%] rounded-lg p-3">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-md font-medium" >
                Vocês fazem entrega em todo o Brasil?
              </AccordionTrigger>
              <AccordionContent className="text-md font-medium">
                Sim, fazemos entrega em todo o Brasil. Consulte nossa página de
                frete para mais informações sobre prazos e condições de entrega.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="bg-gray-100 w-[100%] rounded-lg p-3">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-md font-medium">
                Posso usar lenha na churrasqueira?
              </AccordionTrigger>
              <AccordionContent className="text-md font-medium">
                Não é recomendado o uso de lenha em nossas churrasqueiras, pois
                elas são projetadas para uso com carvão. O uso de lenha ou briquetes pode comprometer a estrutura e durabilidade do equipamento.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </>
  );
}
