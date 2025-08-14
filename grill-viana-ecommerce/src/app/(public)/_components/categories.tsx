import { Ham, ChefHat, Briefcase, CalendarFold, Sprout } from "lucide-react";

export default function Categories() {
  return (
    <>
      <section
        className="bg-white flex items-center justify-center py-8"
      >
        <div className="grid grid-cols-5 w-[60%]">
            <div>
          <div
            className="text-base text-gray-600 font-semibold flex flex-col items-center gap-2"
          >
            <span className="bg-gray-50 rounded-[100%] p-3"><Ham size={34} /></span>
            Churras com Amigos
          </div>
        </div>
        <div>
          <div
            className="text-base text-gray-600 font-semibold flex flex-col items-center gap-2"
          >
            <span className="bg-gray-50 rounded-[100%] p-3"><ChefHat size={34} /></span>
            Profissionais
          </div>
        </div>
        <div>
          {" "}
          <div
            className="text-base text-gray-600 font-semibold flex flex-col items-center gap-2"
          >
            <span className="bg-gray-50 rounded-[100%] p-3"><Briefcase size={34} /></span>
            Portáteis
          </div>
        </div>
        <div>
          {" "}
          <div
            className="text-base text-gray-600 font-semibold flex flex-col items-center gap-2"
          >
            <span className="bg-gray-50 rounded-[100%] p-3"><CalendarFold size={34} /></span>
            Para Todos os Dias
          </div>
        </div>
        <div>
          {" "}
          <div
            className="text-base text-gray-600 font-semibold flex flex-col items-center gap-2"
          >
            <span className="bg-gray-100 rounded-[100%] p-3"><Sprout size={34} /></span>
            Vida ao Ar Livre
          </div>
        </div></div>
        
      </section>
    </>
  );
}