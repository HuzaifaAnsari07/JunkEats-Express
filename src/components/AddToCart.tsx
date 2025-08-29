
"use client";

import { useState } from 'react';
import { Product } from '@/types';
import { useCart } from '@/context/CartProvider';
import { Button } from '@/components/ui/button';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface AddToCartProps {
    product: Product;
}

export function AddToCart({ product }: AddToCartProps) {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const { toast } = useToast();

    const handleAddToCart = () => {
        addToCart(product, quantity);
    }

    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 border rounded-lg p-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                    <Minus className="h-4 w-4" />
                </Button>
                <span className="font-bold text-lg w-8 text-center" aria-live="polite">{quantity}</span>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setQuantity(q => q + 1)}>
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
            <Button size="lg" onClick={handleAddToCart} className="flex-grow">
                <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
            </Button>
        </div>
    );
}
