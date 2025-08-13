
import { products } from '@/lib/data';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Menu } from '@/components/Menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Medal, Percent } from 'lucide-react';
import AIAssistant from '@/components/AIAssistant';
import Link from 'next/link';

export default function Home() {
  const bestsellers = products.filter(p => p.bestseller);

  return (
    <div className="container mx-auto px-4 py-8 space-y-16">
      <section className="relative h-[500px] w-full overflow-hidden rounded-2xl">
        <Image src="https://placehold.co/1200x500.png" alt="Delicious food banner" layout="fill" objectFit="cover" className="brightness-50" data-ai-hint="food banner" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-primary-foreground p-4">
          <h1 className="font-headline text-5xl md:text-7xl font-bold">Cravings Calling?</h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl">
            Get your favorite junk food delivered to your door, faster than you can say "extra cheese".
          </p>
          <Button asChild size="lg" className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
            <a href="#menu">Order Now</a>
          </Button>
        </div>
      </section>

      <section id="bestsellers">
        <h2 className="font-headline text-4xl font-bold text-center mb-8">Our Bestsellers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bestsellers.map(product => (
            <Card key={product.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="p-0 relative h-48 w-full">
                <Image src={product.image} alt={product.name} layout="fill" objectFit="cover" data-ai-hint={product.id === 6 ? 'spicy burger' : product.id === 1 ? 'cheeseburger' : `${product.name.split(' ')[0]} ${product.category.slice(0, -1)}`} />
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="font-headline text-xl mb-2">{product.name}</CardTitle>
                <p className="text-muted-foreground text-sm mb-4 h-10">{product.description.substring(0, 80)}...</p>
                <div className="flex justify-between items-center">
                  <p className="font-bold text-lg text-primary">${product.price.toFixed(2)}</p>
                  <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <Link href={`/product/${product.id}`}>View Item</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="offers" className="bg-secondary p-8 rounded-2xl">
         <h2 className="font-headline text-4xl font-bold text-center mb-8">Special Offers</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-md flex items-center gap-4">
              <div className="bg-primary/10 p-4 rounded-full">
                <Percent className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-headline text-xl font-bold">50% OFF on Pizzas</h3>
                <p className="text-muted-foreground">Use code: <span className="font-bold text-primary">PIZZA50</span></p>
              </div>
            </div>
             <div className="bg-card p-6 rounded-lg shadow-md flex items-center gap-4">
              <div className="bg-accent/20 p-4 rounded-full">
                <Medal className="h-8 w-8 text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-headline text-xl font-bold">Burger + Fries Combo</h3>
                <p className="text-muted-foreground">Only for <span className="font-bold text-primary">$9.99</span></p>
              </div>
            </div>
         </div>
      </section>

      <section id="ai-assistant">
        <AIAssistant />
      </section>

      <section id="menu">
        <h2 className="font-headline text-4xl font-bold text-center mb-8">Full Menu</h2>
        <Menu allProducts={products} />
      </section>
    </div>
  );
}
