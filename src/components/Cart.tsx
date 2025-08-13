
"use client";

import { useCart } from '@/context/CartProvider';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { SheetClose } from './ui/sheet';
import Link from 'next/link';

export function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <ShoppingBag className="h-24 w-24 text-muted-foreground" />
        <h3 className="mt-4 font-headline text-xl font-semibold">Your cart is empty</h3>
        <p className="text-muted-foreground mt-2 text-sm">Add some delicious junk food to get started!</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1">
        <div className="p-4 sm:p-6">
          <ul className="-my-6 divide-y divide-border">
            {cartItems.map((item) => (
              <li key={item.id} className="flex py-6">
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border">
                  <Image src={item.image} alt={item.name} width={96} height={96} className="h-full w-full object-cover object-center" data-ai-hint="cart item" />
                </div>
                <div className="ml-4 flex flex-1 flex-col">
                  <div>
                    <div className="flex justify-between text-base font-medium text-foreground">
                      <h3 className="font-headline">{item.name}</h3>
                      <p className="ml-4 font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex flex-1 items-end justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="font-bold">{item.quantity}</span>
                      <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex">
                      <Button variant="ghost" type="button" className="font-medium text-primary hover:text-primary/80" onClick={() => removeFromCart(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </ScrollArea>
      <div className="border-t px-4 py-6 sm:px-6">
        <div className="flex justify-between text-lg font-medium text-foreground">
          <p>Subtotal</p>
          <p>${cartTotal.toFixed(2)}</p>
        </div>
        <p className="mt-0.5 text-sm text-muted-foreground">Shipping and taxes calculated at checkout.</p>
        <div className="mt-6">
            <SheetClose asChild>
                <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
                    <Link href="/checkout">
                        Proceed to Checkout
                    </Link>
                </Button>
            </SheetClose>
        </div>
        <div className="mt-4 flex justify-center text-center text-sm text-muted-foreground">
          <p>
            or{' '}
            <Button variant="link" onClick={clearCart} className="text-primary p-0 h-auto">
              Clear Cart
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
