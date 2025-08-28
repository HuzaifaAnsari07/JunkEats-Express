
"use client";

import { useCart } from '@/context/CartProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
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
import { CreditCard, Landmark, Truck, ArrowLeft, Building, Armchair } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';

const DINE_IN_ADVANCE_AMOUNT = 100;
const VACANT_TABLES = 8;
const TOTAL_TABLES = 12;

const addressSchema = z.object({
  name: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  zip: z.string().optional(),
  paymentMethod: z.enum(['card', 'upi', 'cod'], { required_error: "You need to select a payment method." }),
  orderType: z.enum(['delivery', 'dine-in'], { required_error: "Please select an order type." }),
  tableNumber: z.string().optional(),
  specialRequests: z.string().optional(),
}).superRefine((data, ctx) => {
    if (data.orderType === 'delivery') {
        if (!data.name?.trim()) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Name is required for delivery.", path: ['name'] });
        if (!data.address || data.address.length < 5) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Address must be at least 5 characters.", path: ['address'] });
        if (!data.city || data.city.length < 2) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "City must be at least 2 characters.", path: ['city'] });
        if (!data.zip || !/^\d{5,6}$/.test(data.zip)) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Must be a valid zip code.", path: ['zip'] });
    }
    if (data.orderType === 'dine-in') {
        if (!data.tableNumber) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please select a table for dine-in.", path: ['tableNumber']});
        }
    }
});


export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const [orderType, setOrderType] = useState<'delivery' | 'dine-in'>('delivery');
  const { toast } = useToast();
  const [userName, setUserName] = useState('');
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  const tableNumbers = useMemo(() => {
    const numbers = Array.from({ length: TOTAL_TABLES }, (_, i) => i + 1);
    // Fisher-Yates shuffle
    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    return numbers;
  }, []);

  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/dashboard');
    }
    const storedUser = sessionStorage.getItem('loggedInUser');
    if (storedUser) {
        const user = JSON.parse(storedUser);
        setUserName(user.name);
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
      specialRequests: "",
    },
  });
  
  useEffect(() => {
    if (userName) {
      form.setValue('name', userName);
    }
  }, [userName, form]);

  const handleOrderTypeChange = (value: 'delivery' | 'dine-in') => {
    setOrderType(value);
    form.setValue('orderType', value);
    form.clearErrors(); // Clear errors when switching type
    if (value === 'dine-in' && form.getValues('paymentMethod') === 'cod') {
        form.setValue('paymentMethod', 'card');
    }
  }
  
  const handleTableSelection = (table: string) => {
    setSelectedTable(table);
    form.setValue('tableNumber', table);
  }

  const shippingCost = orderType === 'delivery' ? 5.00 : 0;
  const taxRate = 0.05; // 5% Tax
  const taxAmount = cartTotal * taxRate;
  const finalTotal = cartTotal + shippingCost + taxAmount;
  const displayTotal = orderType === 'dine-in' ? DINE_IN_ADVANCE_AMOUNT : finalTotal;
  
  const formatCurrency = (amount: number) => `₹${amount.toFixed(2)}`;

  const onSubmit = (values: z.infer<typeof addressSchema>) => {
    const orderDetails = {
        id: `JNK-${Math.floor(Math.random() * 10000)}`,
        items: cartItems,
        subtotal: cartTotal,
        shipping: shippingCost,
        tax: taxAmount,
        total: finalTotal,
        advancePaid: orderType === 'dine-in' ? DINE_IN_ADVANCE_AMOUNT : null,
        amountDue: orderType === 'dine-in' ? finalTotal - DINE_IN_ADVANCE_AMOUNT : 0,
        customerName: values.name || userName || 'Valued Customer',
        orderType: values.orderType,
        tableNumber: values.tableNumber,
        specialRequests: values.specialRequests,
        paymentMethod: values.paymentMethod,
        address: values.orderType === 'delivery' ? `${values.address}, ${values.city}, ${values.zip}` : `Dine-in at Table ${values.tableNumber}`,
        date: new Date().toISOString(),
        status: 'Order Placed',
        placementTime: Date.now(),
    };

    const history = JSON.parse(sessionStorage.getItem('orderHistory') || '[]');
    history.unshift(orderDetails);
    sessionStorage.setItem('orderHistory', JSON.stringify(history));
    
    clearCart(true); // pass true to suppress the "cart cleared" message
    
    sessionStorage.setItem('latestOrder', JSON.stringify(orderDetails));
    
    if (values.orderType === 'dine-in') {
        toast({
            title: "Table Reserved!",
            description: `Your table T${orderDetails.tableNumber} has been successfully reserved.`,
            variant: 'default',
            duration: 3000,
        });
        router.push(`/reservation-confirmed`);
    } else {
        toast({
            title: "Order Placed!",
            description: "Your order has been successfully placed.",
            variant: 'default',
            duration: 3000,
        });
        router.push(`/order-confirmation`);
    }
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

                                {orderType === 'dine-in' && (
                                    <div className="animate-in fade-in duration-500 space-y-6">
                                        <Separator className="my-6" />
                                        <h3 className="font-headline text-xl mb-4">Dine-in Options</h3>
                                        <Card className='bg-muted/50 p-4'>
                                            <CardHeader className='p-2'>
                                                <CardTitle>Select Your Table</CardTitle>
                                                <CardDescription>Vacant Tables: <span className='font-bold text-primary'>{VACANT_TABLES}</span>/{TOTAL_TABLES}</CardDescription>
                                            </CardHeader>
                                            <CardContent className='p-2'>
                                                <FormField control={form.control} name="tableNumber" render={({ field }) => (
                                                    <FormItem>
                                                        <RadioGroup onValueChange={handleTableSelection} className="grid grid-cols-4 gap-4">
                                                          {tableNumbers.map(tableNum => (
                                                              <Label key={tableNum} htmlFor={`table-${tableNum}`} className={cn("border rounded-lg p-2 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-accent/50 has-[:checked]:bg-accent has-[:checked]:text-accent-foreground has-[:checked]:border-accent-foreground transition-all duration-300",
                                                                  tableNum > VACANT_TABLES ? 'cursor-not-allowed bg-muted text-muted-foreground opacity-50' : ''
                                                              )}>
                                                                  <RadioGroupItem value={String(tableNum)} id={`table-${tableNum}`} disabled={tableNum > VACANT_TABLES} />
                                                                  <Armchair className="h-6 w-6"/>
                                                                  <span className="text-sm font-semibold">T{tableNum}</span>
                                                              </Label>
                                                          ))}
                                                        </RadioGroup>
                                                        <FormMessage className="pt-2"/>
                                                    </FormItem>
                                                )} />
                                            </CardContent>
                                        </Card>
                                        
                                        <FormField control={form.control} name="specialRequests" render={({ field }) => (
                                          <FormItem>
                                              <FormLabel>Special Requests</FormLabel>
                                                <FormControl>
                                                  <Textarea
                                                    placeholder="e.g. High chair for a kid, birthday celebration setup, etc."
                                                    className="resize-none"
                                                    {...field}
                                                  />
                                                </FormControl>
                                              <FormMessage />
                                          </FormItem>
                                        )} />
                                        
                                        <Alert variant="default" className="mt-4 bg-primary/10 border-primary/20">
                                            <AlertTitle className="font-headline text-primary">Advance Payment</AlertTitle>
                                            <AlertDescription>
                                                To confirm your table booking, a non-refundable advance of <span className="font-bold">{formatCurrency(DINE_IN_ADVANCE_AMOUNT)}</span> is required. The remaining amount will be due at the restaurant.
                                            </AlertDescription>
                                        </Alert>
                                    </div>
                                )}
                                
                                <Separator />

                                <div>
                                    <h3 className="font-headline text-xl mb-4">Payment Method</h3>
                                    <FormField control={form.control} name="paymentMethod" render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <RadioGroup onValueChange={field.onChange} value={field.value} className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                                    <Label htmlFor="cod" className={cn("border rounded-lg p-4 flex items-center gap-4 transition-all duration-300 transform", orderType === 'dine-in' ? 'cursor-not-allowed bg-muted text-muted-foreground opacity-50' : 'cursor-pointer hover:bg-accent/50 has-[:checked]:bg-accent has-[:checked]:text-accent-foreground has-[:checked]:border-accent-foreground hover:scale-105' )}>
                                                        <RadioGroupItem value="cod" id="cod" disabled={orderType === 'dine-in'} />
                                                        <Truck />
                                                        <span>Cash on Delivery</span>
                                                    </Label>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage className="pt-2"/>
                                        </FormItem>
                                    )} />
                                </div>
                                <Button type="submit" size="lg" className="w-full font-bold transition-all hover:bg-primary/80 active:scale-95">{orderType === 'dine-in' ? `Pay Advance & Place Order` : `Place Order`}</Button>
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
                        <div className="flex justify-between">
                            <p className="text-muted-foreground">Order Total</p>
                            <p className="font-semibold">{formatCurrency(finalTotal)}</p>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-lg font-bold">
                            <p>{orderType === 'dine-in' ? 'Advance to Pay' : 'Total'}</p>
                            <p>{formatCurrency(displayTotal)}</p>
                        </div>
                        {orderType === 'dine-in' && (
                             <div className="flex justify-between text-sm text-muted-foreground animate-in fade-in duration-300">
                                <p>Remaining Due</p>
                                <p className="font-semibold">{formatCurrency(finalTotal - DINE_IN_ADVANCE_AMOUNT)}</p>
                            </div>
                        )}
                    </CardFooter>
                </Card>
            </div>
        </div>
    </div>
  );
}
