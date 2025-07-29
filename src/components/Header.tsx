
"use client";

import { ShoppingCart, UtensilsCrossed } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '@/components/ui/sheet';
import { Cart } from '@/components/Cart';
import { useCart } from '@/context/CartProvider';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const { cartCount } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <UtensilsCrossed className="h-8 w-8 text-primary" />
          <span className="font-headline text-2xl font-bold">JunkEats Express</span>
        </Link>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <Link href="#menu" className="transition-colors hover:text-primary">Menu</Link>
            <Link href="#offers" className="transition-colors hover:text-primary">Offers</Link>
            <Link href="#ai-assistant" className="transition-colors hover:text-primary">AI Combo</Link>
          </nav>
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="relative rounded-full">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground animate-in zoom-in-50">
                    {cartCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px] p-0">
              <SheetHeader className="p-6">
                <SheetTitle className="font-headline text-2xl">Your Cart</SheetTitle>
                <SheetDescription>Review your items before checkout.</SheetDescription>
              </SheetHeader>
              <Cart />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
