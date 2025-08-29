"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LeaveReviewForm({ productId }: { productId: number }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      router.push("/login");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, text }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Falha ao enviar avaliação.");
      }

      // Reset form and refresh the page to show the new review
      setRating(0);
      setText("");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8">
      <h3 className="text-xl font-semibold mb-4">Deixe sua avaliação</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-6 h-6 cursor-pointer ${
                i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              }`}
              onClick={() => setRating(i + 1)}
            />
          ))}
        </div>
        <Textarea
          placeholder="Escreva sua avaliação aqui..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" disabled={loading || rating === 0 || !text}>
          {loading ? "Enviando..." : "Enviar Avaliação"}
        </Button>
      </form>
    </div>
  );
}