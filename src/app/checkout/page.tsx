
"use client";

import { useCart } from '@/context/CartProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Landmark, Truck, ArrowLeft, Building } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';

const addressSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }).optional(),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }).optional(),
  city: z.string().min(2, { message: "City must be at least 2 characters." }).optional(),
  zip: z.string().regex(/^\d{5,6}$/, { message: "Must be a valid zip code." }).optional(),
  paymentMethod: z.enum(['card', 'upi', 'cod'], { required_error: "You need to select a payment method." }),
  orderType: z.enum(['delivery', 'dine-in'], { required_error: "Please select an order type." }),
}).superRefine((data, ctx) => {
    if (data.orderType === 'delivery') {
        if (!data.name) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Name is required for delivery.", path: ['name'] });
        if (!data.address) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Address is required for delivery.", path: ['address'] });
        if (!data.city) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "City is required for delivery.", path: ['city'] });
        if (!data.zip) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Zip code is required for delivery.", path: ['zip'] });
    }
});


export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const [orderType, setOrderType] = useState<'delivery' | 'dine-in'>('delivery');

  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/dashboard');
    }
  }, [cartItems, router]);

  const form = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: "",
      address: "",
      city: "",
      zip: "",
      paymentMethod: "card",
      orderType: "delivery",
    },
  });
  
  const handleOrderTypeChange = (value: 'delivery' | 'dine-in') => {
    setOrderType(value);
    form.setValue('orderType', value);
  }

  const shippingCost = orderType === 'delivery' ? 25.00 : 0;
  const taxRate = 0.05; // 5% Tax
  const taxAmount = cartTotal * taxRate;
  const total = cartTotal + shippingCost + taxAmount;
  
  const formatCurrency = (amount: number) => `₹${amount.toFixed(2)}`;

  const onSubmit = (values: z.infer<typeof addressSchema>) => {
    const orderDetails = {
        items: cartItems,
        subtotal: cartTotal,
        shipping: shippingCost,
        tax: taxAmount,
        total: total,
        customerName: values.name || 'Valued Customer',
        orderType: values.orderType,
        paymentMethod: values.paymentMethod,
        address: values.orderType === 'delivery' ? `${values.address}, ${values.city}, ${values.zip}` : 'Dine-in'
    };

    sessionStorage.setItem('latestOrder', JSON.stringify(orderDetails));
    
    console.log("Order placed with values:", values);
    clearCart();
    router.push(`/order-confirmation`);
  };

  if (cartItems.length === 0) {
    return (
        <div className="container mx-auto flex items-center justify-center min-h-[60vh]">
            <p>Redirecting to dashboard...</p>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
        <Button variant="outline" asChild className="mb-4">
            <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Menu
            </Link>
        </Button>
        <h1 className="font-headline text-4xl font-bold text-center mb-8">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <Card className="transition-shadow hover:shadow-lg">
                    <CardHeader>
                        <CardTitle className="font-headline">Your Order Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <RadioGroup defaultValue="delivery" onValueChange={handleOrderTypeChange} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     <Label htmlFor="delivery" className="border rounded-lg p-4 flex items-center gap-4 cursor-pointer hover:bg-accent/50 has-[:checked]:bg-accent has-[:checked]:text-accent-foreground has-[:checked]:border-accent-foreground transition-all duration-300 transform hover:scale-105">
                                        <RadioGroupItem value="delivery" id="delivery" />
                                        <Truck />
                                        <span>Delivery</span>
                                    </Label>
                                    <Label htmlFor="dine-in" className="border rounded-lg p-4 flex items-center gap-4 cursor-pointer hover:bg-accent/50 has-[:checked]:bg-accent has-[:checked]:text-accent-foreground has-[:checked]:border-accent-foreground transition-all duration-300 transform hover:scale-105">
                                        <RadioGroupItem value="dine-in" id="dine-in" />
                                        <Building />
                                        <span>Dine-in</span>
                                    </Label>
                                </RadioGroup>

                                {orderType === 'delivery' && (
                                    <div className="animate-in fade-in duration-500">
                                        <Separator className="my-6" />
                                        <h3 className="font-headline text-xl mb-4">Shipping Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField control={form.control} name="name" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Full Name</FormLabel>
                                                    <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                            <FormField control={form.control} name="address" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Address</FormLabel>
                                                    <FormControl><Input placeholder="123 JunkFood Lane" {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                            <FormField control={form.control} name="city" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>City</FormLabel>
                                                    <FormControl><Input placeholder="Foodville" {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                            <FormField control={form.control} name="zip" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Zip Code</FormLabel>
                                                    <FormControl><Input placeholder="12345" {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                        </div>
                                    </div>
                                )}
                                
                                <Separator />

                                <div>
                                    <h3 className="font-headline text-xl mb-4">Payment Method</h3>
                                    <FormField control={form.control} name="paymentMethod" render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <Label htmlFor="card" className="border rounded-lg p-4 flex items-center gap-4 cursor-pointer hover:bg-accent/50 has-[:checked]:bg-accent has-[:checked]:text-accent-foreground has-[:checked]:border-accent-foreground transition-all duration-300 transform hover:scale-105">
                                                        <RadioGroupItem value="card" id="card" />
                                                        <CreditCard />
                                                        <span>Credit/Debit Card</span>
                                                    </Label>
                                                    <Label htmlFor="upi" className="border rounded-lg p-4 flex items-center gap-4 cursor-pointer hover:bg-accent/50 has-[:checked]:bg-accent has-[:checked]:text-accent-foreground has-[:checked]:border-accent-foreground transition-all duration-300 transform hover:scale-105">
                                                        <RadioGroupItem value="upi" id="upi" />
                                                        <Landmark />
                                                        <span>UPI</span>
                                                    </Label>
                                                    <Label htmlFor="cod" className="border rounded-lg p-4 flex items-center gap-4 cursor-pointer hover:bg-accent/50 has-[:checked]:bg-accent has-[:checked]:text-accent-foreground has-[:checked]:border-accent-foreground transition-all duration-300 transform hover:scale-105">
                                                        <RadioGroupItem value="cod" id="cod" />
                                                        <Truck />
                                                        <span>Cash on Delivery</span>
                                                    </Label>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage className="pt-2"/>
                                        </FormItem>
                                    )} />
                                </div>
                                <Button type="submit" size="lg" className="w-full font-bold transition-transform transform hover:scale-105">Place Order</Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-1">
                <Card className="sticky top-24 transition-shadow hover:shadow-lg">
                    <CardHeader>
                        <CardTitle className="font-headline">Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[250px] pr-4">
                            <div className="space-y-4">
                                {cartItems.map(item => (
                                    <div key={item.id} className="flex items-center justify-between animate-in fade-in duration-300">
                                        <div className="flex items-center gap-4">
                                            <Image src={item.image} alt={item.name} width={64} height={64} className="rounded-md object-cover" data-ai-hint="cart item" />
                                            <div>
                                                <p className="font-semibold">{item.name}</p>
                                                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                    <CardFooter className="flex-col items-stretch space-y-2">
                        <Separator />
                        <div className="flex justify-between">
                            <p className="text-muted-foreground">Subtotal</p>
                            <p className="font-semibold">{formatCurrency(cartTotal)}</p>
                        </div>
                        {orderType === 'delivery' && (
                             <div className="flex justify-between animate-in fade-in duration-300">
                                <p className="text-muted-foreground">Shipping</p>
                                <p className="font-semibold">{formatCurrency(shippingCost)}</p>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <p className="text-muted-foreground">Tax (5%)</p>
                            <p className="font-semibold">{formatCurrency(taxAmount)}</p>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-lg font-bold">
                            <p>Total</p>
                            <p>{formatCurrency(total)}</p>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    </div>
  );
}

    