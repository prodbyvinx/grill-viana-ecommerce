"use server";

import { Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import LeaveReviewForm from "./leave-review-form";

type Review = {
  id: number;
  rating: number;
  text: string;
  createdAt: Date;
  user: {
    name?: string | null;
  };
};

async function hasPurchased(userId: number, productId: number) {
  // Ajuste conforme seu fluxo; aqui uso paymentStatus: "APPROVED"
  const orderCount = await prisma.order.count({
    where: {
      userId,
      paymentStatus: "APPROVED",
      items: { some: { productId } },
    },
  });
  return orderCount > 0;
}

export default async function ProductReviews({
  reviews = [],
  productId,
}: {
  reviews: Review[];
  productId: number;
}) {
  const session = await getServerSession(authOptions);
  const userIdRaw = (session?.user as any)?.id;
  const userId = userIdRaw != null ? Number(userIdRaw) : undefined;
  const canReview = userId ? await hasPurchased(userId, productId) : false;

  return (
    <div className="py-8">
      <h2 className="text-2xl font-semibold mb-4">Avaliações de Clientes</h2>

      {canReview && <LeaveReviewForm productId={productId} />}

      {reviews.length === 0 ? (
        <p className="text-gray-500">Este produto ainda não possui avaliações.</p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="flex gap-4 border-b pb-4">
              <Avatar>
                <AvatarFallback>{review.user.name?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{review.user.name}</p>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  {new Intl.DateTimeFormat("pt-BR").format(new Date(review.createdAt))}
                </p>
                <p className="text-gray-700">{review.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
