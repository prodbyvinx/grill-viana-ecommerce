// No componente onde você renderiza o catálogo:
import ProductCard from "@/app/(public)/_components/productcard";
import products from "@/app/(public)/catalogo/_data/products.json"; // ou o caminho correto


export default function CatalogContent() {
  return (
    <section className="grid mx-auto w-[90%] grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  {products.map((product) => (
    <ProductCard key={product.id} product={product} />
  ))}
</section>

  );
}
