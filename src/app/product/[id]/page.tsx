
import { products } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Star, Truck, ShieldCheck, Leaf } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AddToCart } from '@/components/AddToCart';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = products.find(p => p.id === parseInt(params.id, 10));

  if (!product) {
    notFound();
  }

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(
            <Star key={i} className={`h-5 w-5 ${i <= rating ? 'text-accent fill-accent' : 'text-muted-foreground'}`} />
        );
    }
    return stars;
  };

  return (
    <div className="container mx-auto px-4 py-8">
        <Button variant="outline" asChild className="mb-6">
            <Link href="/dashboard#menu">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Menu
            </Link>
        </Button>
        <Card>
            <CardContent className="p-4 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    <div className="w-full h-80 md:h-full relative overflow-hidden rounded-lg">
                        <Image 
                            src={product.image} 
                            alt={product.name} 
                            layout="fill"
                            objectFit="cover"
                            className="transition-transform duration-300 hover:scale-105"
                            data-ai-hint={product.id === 6 ? 'spicy burger' : product.id === 1 ? 'cheeseburger' : `${product.name.split(' ')[0].toLowerCase()} ${product.category.slice(0, -1).toLowerCase()}`} 
                        />
                    </div>
                    <div className="flex flex-col justify-center space-y-4">
                        <Badge variant="secondary" className="w-fit">{product.category}</Badge>
                        <h1 className="font-headline text-4xl md:text-5xl font-bold">{product.name}</h1>
                        <div className="flex items-center gap-2">
                            {renderStars(product.rating)}
                            <span className="text-muted-foreground">({product.rating} / 5.0)</span>
                        </div>
                        <p className="font-headline text-4xl font-bold text-primary">${product.price.toFixed(2)}</p>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            {product.description}
                        </p>
                        <Separator />
                        <AddToCart product={product} />
                        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground pt-4">
                            <div className="flex items-center gap-2">
                                <Truck className="h-5 w-5 text-primary"/>
                                <span>Fast Delivery</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="h-5 w-5 text-primary"/>
                                <span>Quality Assured</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Leaf className="h-5 w-5 text-primary"/>
                                <span>Fresh Ingredients</span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
