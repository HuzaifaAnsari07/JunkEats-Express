
"use client";

import Image from 'next/image';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Star, PlusCircle } from 'lucide-react';
import { useCart } from '@/context/CartProvider';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const formatCurrency = (amount: number) => `₹${amount.toFixed(2)}`;
  
  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 rounded-lg border-2 border-transparent hover:border-accent group">
      <CardHeader className="p-0 relative">
        <Link href={`/product/${product.id}`} className="block h-48 w-full">
            <Image 
              src={product.image} 
              alt={product.name} 
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              data-ai-hint={product.id === 6 ? 'spicy burger' : product.id === 1 ? 'cheeseburger' : `${product.name.split(' ')[0].toLowerCase()} ${product.category.slice(0, -1).toLowerCase()}`} 
            />
        </Link>
        <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-bold flex items-center gap-1">
          <Star className="w-4 h-4 text-accent" fill="currentColor" />
          <span>{product.rating}</span>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <Link href={`/product/${product.id}`}>
            <CardTitle className="font-headline text-xl mb-2 hover:text-primary transition-colors">{product.name}</CardTitle>
        </Link>
        <CardDescription className="text-sm h-12">{product.description}</CardDescription>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center">
        <p className="font-headline text-2xl font-bold text-primary">{formatCurrency(product.price)}</p>
        <Button onClick={() => addToCart(product)} className="bg-primary hover:bg-primary/90 text-primary-foreground transition-transform transform hover:scale-110">
          <PlusCircle className="mr-2 h-5 w-5" /> Add
        </Button>
      </CardFooter>
    </Card>
  );
}

    