
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { UtensilsCrossed, LogIn, Phone, User, MapPin } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [locationEnabled, setLocationEnabled] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationEnabled) {
      alert('Please enable your location to continue.');
      return;
    }
    // Mock login logic
    const user = { name, contactNumber, email };
    sessionStorage.setItem('loggedInUser', JSON.stringify(user));
    console.log('Logging in with:', { name, contactNumber, email, password, locationEnabled });
    router.push('/dashboard');
  };

  const handleEnableLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Location enabled:', position.coords.latitude, position.coords.longitude);
          setLocationEnabled(true);
        },
        (error) => {
          console.error('Error enabling location:', error.message);
          alert('Could not enable location. Please check your browser settings and grant permission.');
          setLocationEnabled(false);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[80vh] px-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
            <UtensilsCrossed className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl">Welcome to JunkEats!</CardTitle>
          <CardDescription>Log in or sign up to get your junk food fix.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
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
              <Label htmlFor="contact">Contact Number</Label>
              <Input
                id="contact"
                type="tel"
                placeholder="123-456-7890"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
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

            <Button
              type="button"
              variant={locationEnabled ? "secondary" : "outline"}
              className="w-full"
              onClick={handleEnableLocation}
            >
              <MapPin className="mr-2 h-5 w-5"/>
              {locationEnabled ? 'Location Enabled' : 'Enable Live Location'}
            </Button>
            
            <Button type="submit" className="w-full font-bold" disabled={!locationEnabled}>
                <LogIn className="mr-2 h-5 w-5"/>
                Continue
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm">
          <p className="w-full">
            By continuing, you agree to our terms of service.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
