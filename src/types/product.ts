export type Product = {
  [x: string]: ReactNode;
  id: number;
  name: string;
  category: "Inox" | "Galvanizada" | "Dobrável" | "Espeteira";
  price: number;
  imageUrl: string;
  rating: number;
};
