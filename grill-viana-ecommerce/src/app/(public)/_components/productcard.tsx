import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Star, Eye } from "lucide-react";
import BuyButton from "./buybutton";
import Link from 'next/link'

export type Product = {
  id: number;
  name: string;
  sku: string;
  description: string;
  image: string;
  price: number;
  oldPrice?: number;
  rating?: number;
  ratingCount?: number;
  isNew?: boolean;
  category?: string;
  type?: string;
  finalidade?: string;
  grelhas?: number;
  stockTotal: number;
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/produto/${product.id}`}>
      <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 max-h-120 overflow-hidden cursor-pointer">
        <div className="aspect-[4/3] relative overflow-hidden flex justify-center">
          <Image
            src={product.image}
            width={300}
          height={300}
          alt={product.name}
          className="object-contain"
        />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/30 transition-opacity h-full flex justify-center items-center text-white">
          <span className="flex flex-col h-full w-auto justify-center items-center text-sm">
            <Eye />
            <p>Clique para ver detalhes</p>
          </span>
        </div>
      </div>

      <CardHeader>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < (product.rating ?? 0)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
          {product.ratingCount && (
            <span className="text-sm text-slate-500 ml-1">
              ({product.ratingCount})
            </span>
          )}
        </div>
        <CardTitle className="text-xl">{product.name}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>

      <CardContent>
        {product.oldPrice && (
          <span className="font-medium line-through text-red-700 block">
            R$ {product.oldPrice.toFixed(2)}
          </span>
        )}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-black">
            R$ {product.price.toFixed(2)}
          </span>
          <BuyButton productId={product.id as unknown as number} disabled={product.stockTotal === 0} />
        </div>
      </CardContent>
    </Card>
  </Link>
  );
}
