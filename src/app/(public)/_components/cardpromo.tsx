import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Eye } from "lucide-react";

export default function CardPromo() {
    return (
        <><Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              <div className="aspect-[4/3] relative overflow-hidden">
                <div className="absolute inset-0 bg-gray-300" />
                <div className="absolute inset-0 hover:bg-black/30 transition-colors">
                    <span className="flex h-full w-auto justify-center items-center">
                        <Eye />
                    </span>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-white/90">
                    Novo
                  </Badge>
                </div>
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
                <CardDescription>
                  Uma descrição detalhada do produto
                </CardDescription>
              </CardHeader>
              <CardContent>
                <span className="font-medium line-through text-red-700">
                  R$ 349,90
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-black">
                    R$ 299,90
                  </span>
                </div>
              </CardContent>
            </Card></>
    )
}