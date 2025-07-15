import ProductCard from '@/app/(public)/_components/cardpromo'

export default function CatalogContent() {
  return (
    <>
      <section className="grid gril-cols-4">
        <div className="w-70 cursor-pointer">
          <ProductCard />
        </div>
        <div className="w-70 cursor-pointer">
          <ProductCard />
        </div>
        <div className="w-70 cursor-pointer">
          <ProductCard />
        </div>
      </section>
    </>
  );
}
