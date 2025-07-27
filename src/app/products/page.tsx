
"use client";

import Link from 'next/link';
import { laptopData } from '@/lib/data';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Link href="/">
            <Button variant="outline" size="icon">
              <ArrowLeft />
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary ml-4">
            Choose a Laptop
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {laptopData.map((laptop) => (
              <ProductCard
                key={laptop.id}
                product={laptop}
                isSelected={false}
                onSelect={() => {}}
                isClickable={false}
              />
          ))}
        </div>
      </main>
    </div>
  );
}
