import * as React from 'react';
import ProductCard, { Product } from '@/app/(public)/_components/productcard';


interface CatalogContentProps {
  products: Product[];
}

const CatalogContent: React.FC<CatalogContentProps> = ({ products }) => {
  if (products.length === 0) {
    return (
      <p className="mt-6 text-center text-gray-500">Nenhum produto encontrado.</p>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default CatalogContent;
