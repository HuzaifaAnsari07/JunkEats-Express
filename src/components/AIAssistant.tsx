
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2, Pizza, Ham, UtensilsCrossed, GlassWater, Flame } from 'lucide-react';
import { suggestCombo, SuggestComboInput, SuggestComboOutput } from '@/ai/flows/suggest-combo';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Skeleton } from './ui/skeleton';

const mockOrderHistory = [
  { itemName: 'Cheeseburger Deluxe', category: 'Burgers' },
  { itemName: 'Crispy French Fries', category: 'Fries' },
  { itemName: 'Cola', category: 'Beverages' },
  { itemName: 'Pepperoni Pizza', category: 'Pizza' },
];

export default function AIAssistant() {
  const [suggestion, setSuggestion] = useState<SuggestComboOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSuggestCombo = async () => {
    setIsLoading(true);
    setError(null);
    setSuggestion(null);

    try {
      const input: SuggestComboInput = {
        userOrderHistory: mockOrderHistory,
        preferences: 'I like spicy food and trying new things.',
      };
      const result = await suggestCombo(input);
      setSuggestion(result);
    } catch (e: any) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      setError(`Sorry, our AI chef is busy. Please try again later. (Error: ${errorMessage})`);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getIconForCategory = (category: string) => {
    switch (category) {
      case 'Pizza': return <Pizza className="h-6 w-6 text-primary" />;
      case 'Burgers': return <Ham className="h-6 w-6 text-primary" />;
      case 'Beverages': return <GlassWater className="h-6 w-6 text-primary" />;
      case 'Fries': return <Flame className="h-6 w-6 text-primary" />;
      default: return <UtensilsCrossed className="h-6 w-6 text-primary" />;
    }
  }

  return (
    <Card className="bg-gradient-to-br from-secondary via-background to-background text-center p-8 rounded-2xl shadow-xl border-2 border-accent/30">
      <CardHeader>
        <div className="mx-auto bg-accent/20 p-4 rounded-full w-fit">
          <Wand2 className="h-10 w-10 text-accent-foreground" />
        </div>
        <CardTitle className="font-headline text-3xl md:text-4xl mt-4">Can't Decide?</CardTitle>
        <CardDescription className="max-w-md mx-auto mt-2">
          Let our AI chef whip up a personalized combo for you based on your past cravings!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button size="lg" onClick={handleSuggestCombo} disabled={isLoading} className="font-bold bg-accent text-accent-foreground hover:bg-accent/90">
          {isLoading ? 'Thinking of something yummy...' : 'Suggest a Combo!'}
        </Button>

        {error && <Alert variant="destructive" className="mt-6 text-left"><AlertTitle>Oops!</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}

        {isLoading && (
          <div className="mt-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4 mx-auto" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <Skeleton className="h-32 w-full rounded-lg" />
                <Skeleton className="h-32 w-full rounded-lg" />
                <Skeleton className="h-32 w-full rounded-lg" />
              </div>
              <Skeleton className="h-16 w-full rounded-lg" />
            </div>
          </div>
        )}
        
        {suggestion && (
          <div className="mt-8 text-left animate-in fade-in duration-500">
            <h3 className="font-headline text-2xl font-bold mb-4 text-center">Your Personalized Combo!</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {suggestion.comboSuggestion.map((item, index) => (
                <Card key={index} className="bg-background/80">
                  <CardHeader className="flex flex-row items-center gap-4">
                     {getIconForCategory(item.category)}
                    <CardTitle className="font-headline text-lg">{item.itemName}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Alert variant="default" className="bg-primary/10 border-primary/20">
              <Wand2 className="h-4 w-4 text-primary" />
              <AlertTitle className="font-headline text-primary">Chef's Reasoning</AlertTitle>
              <AlertDescription>
                {suggestion.reasoning}
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
