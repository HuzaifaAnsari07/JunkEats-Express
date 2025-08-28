
"use client";

import { ShoppingCart, UtensilsCrossed, User } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { Cart } from '@/components/Cart';
import { useCart } from '@/context/CartProvider';
import { ThemeToggle } from './ThemeToggle';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

interface Order {
    status: string;
}

export function Header() {
  const { cartCount } = useCart();
  const pathname = usePathname();
  const [hasPendingOrder, setHasPendingOrder] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const checkPendingOrders = () => {
        const storedOrders = sessionStorage.getItem('orderHistory');
        if (storedOrders) {
            const orders: Order[] = JSON.parse(storedOrders);
            const pending = orders.some(order => 
                order.status !== 'Delivered' && 
                order.status !== 'Completed' && 
                order.status !== 'Cancelled'
            );
            setHasPendingOrder(pending);
        } else {
            setHasPendingOrder(false);
        }
    }
    
    checkPendingOrders();

    // Re-check on navigation change
    const interval = setInterval(checkPendingOrders, 3000); // Check every 3 seconds

    return () => clearInterval(interval);
  }, [pathname]);


  if (pathname === '/' || pathname === '/register') {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <UtensilsCrossed className="h-8 w-8 text-primary" />
          <span className="font-headline text-2xl font-bold">JunkEats Express</span>
        </Link>
        <div className="flex items-center gap-2">
          <nav className="hidden md:flex gap-4 text-sm font-medium">
            <Button variant="ghost" asChild>
                <Link href="/dashboard#menu">Menu</Link>
            </Button>
            <Button variant="ghost" asChild>
                <Link href="/dashboard#offers">Offers</Link>
            </Button>
             <Button variant="ghost" asChild>
                <Link href="/dashboard#ai-assistant">AI Combo</Link>
             </Button>
          </nav>
          
          <ThemeToggle />
          {isClient && (
            <Button variant="outline" size="icon" className="rounded-full relative" asChild>
              <Link href="/profile">
                  {hasPendingOrder && (
                    <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-destructive ring-2 ring-background animate-pulse" />
                  )}
                  <User className="h-5 w-5" />
                  <span className="sr-only">Profile</span>
              </Link>
            </Button>
          )}
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
            <SheetContent className="w-full md:w-[600px] lg:w-[700px] sm:max-w-none p-0 flex flex-col">
              <SheetHeader className="p-6 pb-4">
                <SheetTitle className="font-headline text-2xl">Your Cart</SheetTitle>
                <SheetDescription>Review your items before checkout.</SheetDescription>
              </SheetHeader>
              <Cart />
            </SheetContent>
          </Sheet>
           <div className="hidden md:flex items-center gap-2">
             <Button variant="outline" asChild>
                <Link href="/">Logout</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
