"use client";

import { useState } from 'react';
import { Product } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductCard } from './ProductCard';

interface MenuProps {
  allProducts: Product[];
}

const categories: Product['category'][] = ['Pizza', 'Burgers', 'Fries', 'Beverages', 'Combos', 'Desserts'];

export function Menu({ allProducts }: MenuProps) {
  const [activeTab, setActiveTab] = useState<string>(categories[0]);

  return (
    <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6 bg-secondary p-1 h-auto rounded-lg">
        {categories.map(category => (
          <TabsTrigger key={category} value={category} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-md">
            {category}
          </TabsTrigger>
        ))}
      </TabsList>
      {categories.map(category => (
        <TabsContent key={category} value={category} className="mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {allProducts.filter(p => p.category === category).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
            {allProducts.filter(p => p.category === category).length === 0 && (
              <p className="text-muted-foreground col-span-full text-center">No items in this category yet. Check back soon!</p>
            )}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
