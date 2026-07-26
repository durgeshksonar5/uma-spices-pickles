import React from 'react';
import { ProductCard } from './ProductCard';
import { EmptyState } from '../common/EmptyState';
import { SearchX } from 'lucide-react';

export const ProductGrid = ({
  products = [],
  onResetFilters
}) => {
  if (!products.length) {
    return (
      <EmptyState
        icon={SearchX}
        title="No products found"
        description="Try a different product name or explore our categories."
        actionText="Explore Products"
        onActionClick={onResetFilters}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
