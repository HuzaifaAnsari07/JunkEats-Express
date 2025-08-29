
"use client";

import { UtensilsCrossed } from 'lucide-react';
import { usePathname } from 'next/navigation';


export function Footer() {
  const pathname = usePathname();

  if (pathname === '/' || pathname === '/register') {
    return null;
  }

  return (
    <footer className="border-t mt-16">
      <div className="container flex flex-col items-center justify-center gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <UtensilsCrossed className="h-6 w-6 text-primary" />
          <p className="text-center text-sm leading-loose md:text-left">
            © {new Date().getFullYear()} JunkEats Express. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
