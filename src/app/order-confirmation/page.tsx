
"use client";

import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Home, UtensilsCrossed, Printer } from "lucide-react";
import Link from "next/link";
import type { CartItem } from '@/types';
import Image from 'next/image';

interface OrderDetails {
    items: CartItem[];
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    customerName: string;
    orderType: 'delivery' | 'dine-in';
    paymentMethod: string;
    address: string;
}

function OrderConfirmationContent() {
    const router = useRouter();
    const [order, setOrder] = useState<OrderDetails | null>(null);
    const [date, setDate] = useState('');

    useEffect(() => {
        const savedOrder = sessionStorage.getItem('latestOrder');
        if (savedOrder) {
            setOrder(JSON.parse(savedOrder));
            setDate(new Date().toLocaleString());
        } else {
            // If no order details are found, redirect to dashboard
            router.push('/dashboard');
        }
    }, [router]);

    const formatCurrency = (amount: number) => `₹${amount.toFixed(2)}`;

    if (!order) {
        return (
            <div className="container mx-auto flex items-center justify-center min-h-[70vh]">
                <p>Loading your order details...</p>
            </div>
        );
    }
    
    const handlePrint = () => {
        window.print();
    }
    
    return (
        <div className="container mx-auto px-4 py-8 bg-muted/30">
            <style jsx global>{`
                @media print {
                  body * {
                    visibility: hidden;
                  }
                  .printable-area, .printable-area * {
                    visibility: visible;
                  }
                  .printable-area {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                  }
                  .no-print {
                    display: none;
                  }
                }
            `}</style>
            <div className="max-w-2xl mx-auto">
                <Card className="w-full shadow-2xl printable-area">
                    <CardHeader className="bg-primary text-primary-foreground p-6 rounded-t-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="font-headline text-3xl">Order Confirmed!</CardTitle>
                                <CardDescription className="text-primary-foreground/80 mt-1">Here is your bill, {order.customerName}.</CardDescription>
                            </div>
                            <UtensilsCrossed className="h-12 w-12" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="font-semibold text-muted-foreground">Billed to:</p>
                                <p className="font-bold">{order.customerName}</p>
                                <p>{order.address}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-muted-foreground">Order ID:</p>
                                <p>#JNK-{(Math.random() * 10000).toFixed(0)}</p>
                                <p className="font-semibold text-muted-foreground mt-2">Date:</p>
                                <p>{date}</p>
                            </div>
                        </div>

                        <Separator />
                        
                        <div>
                            <h3 className="font-headline text-lg font-semibold mb-2">Order Summary</h3>
                            <div className="space-y-3">
                                {order.items.map(item => (
                                    <div key={item.id} className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-3">
                                            <Image src={item.image} alt={item.name} width={40} height={40} className="rounded-md object-cover no-print" data-ai-hint="cart item" />
                                            <span>
                                                {item.name} <span className="text-muted-foreground">x {item.quantity}</span>
                                            </span>
                                        </div>
                                        <p>{formatCurrency(item.price * item.quantity)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <p className="text-muted-foreground">Subtotal</p>
                                <p className="font-medium">{formatCurrency(order.subtotal)}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-muted-foreground">Tax (5%)</p>
                                <p className="font-medium">{formatCurrency(order.tax)}</p>
                            </div>
                           {order.orderType === 'delivery' && (
                                <div className="flex justify-between">
                                    <p className="text-muted-foreground">Delivery Fee</p>
                                    <p className="font-medium">{formatCurrency(order.shipping)}</p>
                                </div>
                           )}
                           <div className="flex justify-between">
                                <p className="text-muted-foreground">Payment Method</p>
                                <p className="font-medium capitalize">{order.paymentMethod}</p>
                            </div>
                        </div>

                        <Separator className="border-dashed" />

                        <div className="flex justify-between items-center font-bold text-xl bg-secondary/50 p-4 rounded-lg">
                            <p>Grand Total</p>
                            <p>{formatCurrency(order.total)}</p>
                        </div>

                        <p className="text-xs text-center text-muted-foreground pt-4">
                           Thank you for your order! We hope to serve you again soon.
                           <br/>
                           This is a computer-generated bill and does not require a signature.
                        </p>

                    </CardContent>
                </Card>
                <div className="mt-6 flex justify-center gap-4 no-print">
                     <Button asChild size="lg" className="font-bold">
                         <Link href="/dashboard">
                             <Home className="mr-2 h-5 w-5" />
                             Back to Dashboard
                         </Link>
                     </Button>
                     <Button onClick={handlePrint} size="lg" variant="outline">
                        <Printer className="mr-2 h-5 w-5" />
                        Print Bill
                     </Button>
                </div>
            </div>
        </div>
    );
}

export default function OrderConfirmationPage() {
    return (
        <Suspense fallback={<div className="container mx-auto flex items-center justify-center min-h-[70vh]">Loading...</div>}>
            <OrderConfirmationContent />
        </Suspense>
    );
}

    