
"use client";

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, CookingPot, Bike, Home } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const TOTAL_DELIVERY_TIME = 20000; // 20 seconds
const STAGES = [
    { name: "Order Placed", icon: <CheckCircle className="h-8 w-8" />, description: "We have received your order." },
    { name: "Preparing", icon: <CookingPot className="h-8 w-8" />, description: "Your meal is being prepared by our expert chefs." },
    { name: "Out for Delivery", icon: <Bike className="h-8 w-8" />, description: "Your order is on its way to you!" },
    { name: "Delivered", icon: <Home className="h-8 w-8" />, description: "Enjoy your delicious meal!" }
];
const TIME_PER_STAGE = TOTAL_DELIVERY_TIME / (STAGES.length - 1);

export default function TrackOrderPage() {
    const [progress, setProgress] = useState(0);
    const [currentStatusIndex, setCurrentStatusIndex] = useState(0);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [orderId, setOrderId] = useState<string | null>(null);
    const [isDelivery, setIsDelivery] = useState(true);

    useEffect(() => {
        const latestOrder = sessionStorage.getItem('latestOrder');
        if (latestOrder) {
            const parsedOrder = JSON.parse(latestOrder);
            setOrderId(parsedOrder.id);
            setIsDelivery(parsedOrder.orderType === 'delivery');
            
            const orderPlacementTime = parsedOrder.placementTime || Date.now();
            
            // Only set start time if it's a delivery order that's not delivered
            if (parsedOrder.orderType === 'delivery' && parsedOrder.status !== 'Delivered') {
                setStartTime(orderPlacementTime);
            } else {
                 const finalIndex = STAGES.length -1;
                 setCurrentStatusIndex(finalIndex);
                 setProgress(100);
            }
            
            if (!parsedOrder.placementTime) {
                sessionStorage.setItem('latestOrder', JSON.stringify({...parsedOrder, placementTime: orderPlacementTime}));
            }
        }
    }, []);

    useEffect(() => {
        if (startTime === null || !isDelivery) return;

        const interval = setInterval(() => {
            const elapsedTime = Date.now() - startTime;
            const newProgress = Math.min((elapsedTime / TOTAL_DELIVERY_TIME) * 100, 100);
            setProgress(newProgress);

            const newStatusIndex = Math.min(Math.floor(elapsedTime / TIME_PER_STAGE), STAGES.length - 1);
            setCurrentStatusIndex(newStatusIndex);

            if (elapsedTime >= TOTAL_DELIVERY_TIME) {
                clearInterval(interval);
                const history = JSON.parse(sessionStorage.getItem('orderHistory') || '[]');
                const updatedHistory = history.map((o: any) => o.id === orderId ? { ...o, status: 'Delivered' } : o);
                sessionStorage.setItem('orderHistory', JSON.stringify(updatedHistory));
            }
        }, 1000); 

        return () => clearInterval(interval);
    }, [startTime, orderId, isDelivery]);
    
    const minutesRemaining = Math.max(0, Math.ceil((TOTAL_DELIVERY_TIME * (1 - progress / 100)) / (1000 * 60)));


    return (
        <div className="container mx-auto px-4 py-8">
            <Button variant="outline" asChild className="mb-6">
                <Link href="/profile">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Profile
                </Link>
            </Button>
            <Card className="max-w-2xl mx-auto shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">Track Your Order</CardTitle>
                    <CardDescription>Order #{orderId || '...'}</CardDescription>
                </CardHeader>
                <CardContent>
                    {isDelivery ? (
                        <>
                            <div className="my-8">
                                <Progress value={progress} className="w-full h-2" />
                                <div className="flex justify-between mt-2">
                                    {STAGES.map((status, index) => (
                                        <div key={index} className={`text-xs text-center ${index <= currentStatusIndex ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                                            {status.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="space-y-8 mt-8">
                                {STAGES.map((status, index) => (
                                     <div key={index} className={`flex gap-6 items-start transition-opacity duration-500 ${index > currentStatusIndex ? 'opacity-40' : ''}`}>
                                        <div className={`flex flex-col items-center gap-2 transition-colors duration-500 ${index <= currentStatusIndex ? 'text-primary' : 'text-muted-foreground'}`}>
                                            <div className={`p-3 rounded-full transition-colors duration-500 ${index <= currentStatusIndex ? 'bg-primary/10' : 'bg-muted'}`}>
                                               {React.cloneElement(status.icon, {className: `h-8 w-8 ${index <= currentStatusIndex ? 'text-primary' : ''}`})}
                                            </div>
                                            {index < STAGES.length - 1 && (
                                                <div className={`w-0.5 grow transition-colors duration-500 ${index < currentStatusIndex ? 'bg-primary' : 'bg-border'}`} style={{height: '3rem'}}></div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className={`font-headline text-xl font-semibold transition-colors duration-500 ${index > currentStatusIndex ? 'text-muted-foreground' : ''}`}>{status.name}</h3>
                                            <p className="text-muted-foreground">{status.description}</p>
                                            {index === currentStatusIndex && progress < 100 && (
                                                <p className="text-sm text-primary font-bold animate-pulse mt-1">Current Status</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="my-8 h-px bg-border" />
                            
                            <div className="text-center">
                                <p className="text-muted-foreground">Estimated Delivery Time:</p>
                                <p className="font-bold text-xl font-headline">
                                     {progress < 100 ? `${minutesRemaining} minutes` : "Delivered"}
                                </p>
                            </div>
                        </>
                     ) : (
                        <div className="text-center py-10">
                            <h3 className="font-headline text-xl">This is a Dine-in Order</h3>
                            <p className="text-muted-foreground">Tracking is not applicable for dine-in orders. Please check your reservation details.</p>
                            <Button asChild className="mt-4">
                                <Link href="/reservation-confirmed">View Reservation</Link>
                            </Button>
                        </div>
                     )}
                </CardContent>
            </Card>
        </div>
    )
}
