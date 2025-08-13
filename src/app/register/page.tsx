
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock registration logic
    console.log('Registering with:', { name, email, password });
    router.push('/dashboard');
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[80vh] px-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <UserPlus className="h-10 w-10 text-primary" />
            </div>
          <CardTitle className="font-headline text-3xl">Create an Account</CardTitle>
          <CardDescription>Join JunkEats Express to order delicious food.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full font-bold">
              Sign Up
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm">
            <p className="w-full">
                Already have an account?{' '}
                <Link href="/" className="font-semibold text-primary hover:underline">
                    Log in
                </Link>
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
