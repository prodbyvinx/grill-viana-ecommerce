import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Star, Eye } from "lucide-react";

export default function CardPromo() {
  return (
    <>
      <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
        <div className="aspect-[4/3] relative overflow-hidden flex justify-center">
          <Image
            src="/images/i60_capa.png"
            width={200}
            height={200}
            alt="Churrasqueira Inox 60cm"
          />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/30 transition-opacity flex justify-center items-center text-white">
            <span className="flex flex-col h-full w-auto justify-center items-center">
              <Eye />
              <p>Clique para ver detalhes</p>
            </span>
          </div>
          {/* {<div className="absolute top-4 right-4">
            <Badge variant="secondary" className="bg-white/90">
              Novo
            </Badge>
          </div>} */}
        </div>
        <CardHeader>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4 fill-yellow-400 text-yellow-400"
              />
            ))}
            <span className="text-sm text-slate-500 ml-1">(124)</span>
          </div>
          <CardTitle className="text-xl">Produto Incrível</CardTitle>
          <CardDescription>Uma descrição detalhada do produto</CardDescription>
        </CardHeader>
        <CardContent>
          <span className="font-medium line-through text-red-700">
            R$ 349,90
          </span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-black">R$ 299,90</span>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
