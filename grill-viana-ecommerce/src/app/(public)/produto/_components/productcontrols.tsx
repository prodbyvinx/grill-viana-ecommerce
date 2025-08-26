"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AddToCartButton from "@/app/(public)/_components/addtocart";
import BuyButton from "@/app/(public)/_components/buybutton";

export default function ProductControls({
  productId,
  unitPriceCents,
  stockTotal,
}: {
  productId: number;
  unitPriceCents: number;
  stockTotal: number;
}) {
  const [qty, setQty] = useState(1);

  return (
    <div className="space-y-4">
      <div className="py-2">
        <Select value={String(qty)} onValueChange={(v) => setQty(Number(v))}>
          <SelectTrigger className="w-auto">
            <SelectValue placeholder="Quantidade" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5].map((n) => (
              <SelectItem key={n} value={String(n)}>{n}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-3">
        <AddToCartButton productId={productId} quantity={qty} />
        <BuyButton
          productId={productId}
          unitPriceCents={unitPriceCents}
          disabled={stockTotal <= 0}
        />
      </div>
    </div>
  );
}
