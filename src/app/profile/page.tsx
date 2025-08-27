
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, Package, CheckCheck, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { Badge } from '@/components/ui/badge';
import type { CartItem } from '@/types';

interface Order {
    id: string;
    date: string;
    total: number;
    status: string;
    items: CartItem[];
    placementTime?: number;
}

const ESTIMATED_DELIVERY_TIME_MS = 20 * 1000; // 20 seconds for simulation

export default function ProfilePage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [userName, setUserName] = useState('Valued Customer');

    useEffect(() => {
        const storedUser = sessionStorage.getItem('loggedInUser');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setUserName(user.name);
        }

        const storedOrders = sessionStorage.getItem('orderHistory');
        if (storedOrders) {
            const parsedOrders: Order[] = JSON.parse(storedOrders);
            const updatedOrders = parsedOrders.map(order => {
                if (order.status === 'Order Placed' && order.placementTime) {
                    const elapsedTime = Date.now() - order.placementTime;
                    if (elapsedTime > ESTIMATED_DELIVERY_TIME_MS) {
                        return { ...order, status: 'Delivered' };
                    }
                }
                return order;
            });
            setOrders(updatedOrders);
            // Persist the updated statuses back to session storage
            sessionStorage.setItem('orderHistory', JSON.stringify(updatedOrders));
        }
    }, []);

    const formatCurrency = (amount: number) => `₹${amount.toFixed(2)}`;
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const totalOrders = orders.length;
    const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
    const pendingOrders = totalOrders - deliveredOrders;

    const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" | null | undefined => {
        if (status === 'Delivered') return 'default';
        if (status === 'Order Placed' || status === 'Preparing' || status === 'Out for Delivery') return 'secondary';
        return 'outline';
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="w-full max-w-4xl mx-auto shadow-lg">
                <CardHeader className="bg-muted/30">
                    <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-4 rounded-full">
                            <User className="h-10 w-10 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="font-headline text-3xl">{userName}</CardTitle>
                            <CardDescription>Welcome back to your JunkEats dashboard.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <section id="order-summary" className="mb-8">
                        <h2 className="font-headline text-2xl font-bold mb-4">Order Summary</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                            <Card className="p-4">
                                <Package className="h-8 w-8 text-primary mx-auto mb-2" />
                                <p className="text-2xl font-bold">{totalOrders}</p>
                                <p className="text-muted-foreground">Total Orders</p>
                            </Card>
                            <Card className="p-4">
                                <CheckCheck className="h-8 w-8 text-green-500 mx-auto mb-2" />
                                <p className="text-2xl font-bold">{deliveredOrders}</p>
                                <p className="text-muted-foreground">Orders Delivered</p>
                            </Card>
                            <Card className="p-4">
                                <Clock className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                                <p className="text-2xl font-bold">{pendingOrders}</p>
                                <p className="text-muted-foreground">Pending Orders</p>
                            </Card>
                        </div>
                    </section>

                    <Separator className="my-8" />
                    
                    <section id="order-history">
                        <h2 className="font-headline text-2xl font-bold mb-4">Order History</h2>
                        <div className="space-y-4">
                            {orders.length > 0 ? (
                                orders.map(order => (
                                    <Card key={order.id} className="overflow-hidden">
                                        <CardHeader className="flex flex-row justify-between items-center p-4 bg-secondary/30">
                                            <div>
                                                <p className="font-bold">Order ID: {order.id}</p>
                                                <p className="text-sm text-muted-foreground">Date: {formatDate(order.date)}</p>
                                            </div>
                                            <div className="text-right">
                                                 <p className="font-bold text-lg text-primary">{formatCurrency(order.total)}</p>
                                                  <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-4">
                                            <p className="font-semibold mb-2">Items:</p>
                                            <ul className="list-disc list-inside text-sm text-muted-foreground">
                                                {order.items.map(item => (
                                                    <li key={item.id}>{item.name} (x{item.quantity})</li>
                                                ))}
                                            </ul>
                                             {order.status !== 'Delivered' && (
                                                <div className="text-right mt-4">
                                                     <Button asChild>
                                                        <Link href="/track-order">
                                                            <MapPin className="mr-2 h-4 w-4" />
                                                            Track Order
                                                        </Link>
                                                    </Button>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <p className="text-muted-foreground text-center py-8">You haven't placed any orders yet.</p>
                            )}
                        </div>
                    </section>
                </CardContent>
            </Card>
        </div>
    );
}
