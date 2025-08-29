
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, Package, Clock, MapPin, Building, Utensils, XCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Badge } from '@/components/ui/badge';
import type { CartItem } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';

interface Order {
    id: string;
    date: string;
    total: number;
    status: string;
    items: CartItem[];
    placementTime?: number;
    orderType: 'delivery' | 'dine-in';
}

const ESTIMATED_DELIVERY_TIME_MS = 20 * 1000; // 20 seconds for simulation

export default function ProfilePage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [userName, setUserName] = useState('Valued Customer');
    const [activeTab, setActiveTab] = useState('delivery');
    const router = useRouter();

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
                if (order.status === 'Order Placed' && order.placementTime && order.orderType === 'delivery') {
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

    const deliveryOrders = orders.filter(o => o.orderType === 'delivery');
    const dineInOrders = orders.filter(o => o.orderType === 'dine-in');

    const formatCurrency = (amount: number) => `₹${amount.toFixed(2)}`;
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    // Delivery Stats
    const totalDeliveries = deliveryOrders.length;
    const deliveredOrders = deliveryOrders.filter(o => o.status === 'Delivered').length;
    const pendingDeliveries = totalDeliveries - deliveredOrders;

    // Dine-in Stats
    const totalReservations = dineInOrders.length;
    const upcomingReservations = dineInOrders.filter(o => o.status === 'Order Placed').length;
    const completedReservations = dineInOrders.filter(o => o.status === 'Completed').length;


    const getStatusVariant = (status: string, orderType: string): "default" | "secondary" | "destructive" | "outline" | null | undefined => {
        if (status === 'Delivered' || status === 'Completed') return 'default';
        if (orderType === 'dine-in' && status === 'Order Placed') return 'secondary';
        if (status === 'Cancelled') return 'destructive';
        if (status === 'Order Placed' || status === 'Preparing' || status === 'Out for Delivery') return 'secondary';
        return 'outline';
    }
    
    const getStatusText = (order: Order) => {
        if (order.orderType === 'dine-in') {
            if (order.status === 'Order Placed') return 'Reserved';
        }
        return order.status;
    }
    
    const handleViewReservation = (order: Order) => {
        sessionStorage.setItem('latestOrder', JSON.stringify(order));
        router.push('/reservation-confirmed');
    }

    const OrderCard = ({ order }: { order: Order }) => (
        <Card className="overflow-hidden">
            <CardHeader className="flex flex-row justify-between items-center p-4 bg-secondary/30">
                <div>
                    <p className="font-bold">Order ID: {order.id}</p>
                    <p className="text-sm text-muted-foreground">Date: {formatDate(order.date)}</p>
                </div>
                <div className="text-right">
                        <p className="font-bold text-lg text-primary">{formatCurrency(order.total)}</p>
                        <Badge variant={getStatusVariant(order.status, order.orderType)}>{getStatusText(order)}</Badge>
                </div>
            </CardHeader>
            <CardContent className="p-4">
                <p className="font-semibold mb-2">Items:</p>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {order.items.map(item => (
                        <li key={item.id}>{item.name} (x{item.quantity})</li>
                    ))}
                </ul>
                    {order.orderType === 'delivery' && (order.status !== 'Delivered' && order.status !== 'Cancelled') && (
                        <div className="text-right mt-4">
                                <Button asChild>
                                <Link href="/track-order">
                                    <MapPin className="mr-2 h-4 w-4" />
                                    Track Order
                                </Link>
                            </Button>
                        </div>
                    )}
                    {order.orderType === 'dine-in' && order.status !== 'Cancelled' && (
                        <div className="text-right mt-4">
                            <Button onClick={() => handleViewReservation(order)}>
                                <Building className="mr-2 h-4 w-4" />
                                View Reservation
                            </Button>
                        </div>
                    )}
            </CardContent>
        </Card>
    );

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
                     <section id="order-history">
                        <Tabs defaultValue="delivery" onValueChange={setActiveTab}>
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="delivery">Delivery History</TabsTrigger>
                                <TabsTrigger value="reservations">Dine-in Reservations</TabsTrigger>
                            </TabsList>
                            
                            <div className="my-8">
                                <h2 className="font-headline text-2xl font-bold mb-4">Account Summary</h2>
                                {activeTab === 'delivery' ? (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center animate-in fade-in-50 duration-300">
                                        <Card className="p-4">
                                            <Package className="h-8 w-8 text-primary mx-auto mb-2" />
                                            <p className="text-2xl font-bold">{totalDeliveries}</p>
                                            <p className="text-muted-foreground">Total Orders</p>
                                        </Card>
                                        <Card className="p-4">
                                            <Clock className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                                            <p className="text-2xl font-bold">{pendingDeliveries}</p>
                                            <p className="text-muted-foreground">Pending</p>
                                        </Card>
                                        <Card className="p-4">
                                            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                                            <p className="text-2xl font-bold">{deliveredOrders}</p>
                                            <p className="text-muted-foreground">Delivered</p>
                                        </Card>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center animate-in fade-in-50 duration-300">
                                        <Card className="p-4">
                                            <Utensils className="h-8 w-8 text-primary mx-auto mb-2" />
                                            <p className="text-2xl font-bold">{totalReservations}</p>
                                            <p className="text-muted-foreground">Total Reservations</p>
                                        </Card>
                                        <Card className="p-4">
                                            <Building className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                                            <p className="text-2xl font-bold">{upcomingReservations}</p>
                                            <p className="text-muted-foreground">Upcoming</p>
                                        </Card>
                                        <Card className="p-4">
                                            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                                            <p className="text-2xl font-bold">{completedReservations}</p>
                                            <p className="text-muted-foreground">Completed</p>
                                        </Card>
                                    </div>
                                )}
                            </div>
                            
                            <Separator className="my-8" />
                            
                            <h2 className="font-headline text-2xl font-bold mb-4">
                                {activeTab === 'delivery' ? 'Delivery History' : 'Your Reservations'}
                            </h2>

                            <TabsContent value="delivery" className="mt-6 p-0">
                                <div className="space-y-4">
                                    {deliveryOrders.length > 0 ? (
                                        deliveryOrders.map(order => <OrderCard key={order.id} order={order} />)
                                    ) : (
                                        <p className="text-muted-foreground text-center py-8">You haven't placed any delivery orders yet.</p>
                                    )}
                                </div>
                            </TabsContent>
                            <TabsContent value="reservations" className="mt-6 p-0">
                                 <div className="space-y-4">
                                    {dineInOrders.length > 0 ? (
                                        dineInOrders.map(order => <OrderCard key={order.id} order={order} />)
                                    ) : (
                                        <p className="text-muted-foreground text-center py-8">You don't have any dine-in reservations.</p>
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </section>
                </CardContent>
            </Card>
        </div>
    );
}
