
"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PartyPopper, Home, Utensils } from "lucide-react";
import Link from "next/link";

function OrderConfirmationContent() {
    const searchParams = useSearchParams();
    const orderType = searchParams.get('type') || 'delivery';

    const isDineIn = orderType === 'dine-in';

    return (
        <div className="container mx-auto flex items-center justify-center min-h-[70vh] px-4 py-8">
            <Card className="w-full max-w-lg text-center p-4 md:p-6 shadow-xl bg-card animate-in fade-in zoom-in-95 duration-500">
                <CardHeader>
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                        {isDineIn ? (
                            <Utensils className="h-12 w-12 text-primary" />
                        ) : (
                            <PartyPopper className="h-12 w-12 text-primary" />
                        )}
                    </div>
                    <CardTitle className="font-headline text-3xl">Order Confirmed!</CardTitle>
                    <CardDescription className="text-lg">
                        {isDineIn 
                            ? "Your order has been placed. We'll notify you when it's ready!"
                            : "Thank you for your order. Your delicious food is on its way!"
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                        {isDineIn 
                            ? "Please listen for your name to be called for pickup at the counter."
                            : "You can expect your delivery in approximately 30-45 minutes."
                        }
                        <br/>
                        An email confirmation has been sent to you (not really, this is a demo!).
                    </p>
                    <Separator />
                    <p className="font-headline font-semibold text-xl">What's next?</p>
                    <ul className="text-sm text-muted-foreground list-inside text-left mx-auto max-w-xs space-y-1">
                        <li><span className="font-semibold">Preparation:</span> Your order is being freshly prepared by our chefs.</li>
                        {!isDineIn && (
                            <li><span className="font-semibold">Dispatch:</span> A delivery partner will be assigned shortly.</li>
                        )}
                        <li><span className="font-semibold">Notification:</span> You'll be notified when it's ready for {isDineIn ? 'pickup' : 'delivery'}.</li>
                    </ul>
                </CardContent>
                <CardFooter>
                     <Button asChild size="lg" className="w-full font-bold">
                         <Link href="/">
                             <Home className="mr-2 h-5 w-5" />
                             Back to Home
                         </Link>
                     </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

export default function OrderConfirmationPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <OrderConfirmationContent />
        </Suspense>
    );
}
