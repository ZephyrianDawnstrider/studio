"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  onSelect: (product: Product, selected: boolean) => void;
}

export function ProductCard({ product, isSelected, onSelect }: ProductCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            data-ai-hint={product.dataAiHint}
          />
        </div>
        <div className="p-4">
          <CardTitle className="font-headline text-lg h-14">{product.name}</CardTitle>
          <p className="text-2xl font-bold text-primary mt-2">
            {formatCurrency(product.price)}
          </p>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4 pt-0">
        <Separator className="mb-4" />
        <ul className="space-y-2 text-sm text-muted-foreground">
          {product.specs.map((spec) => (
            <li key={spec.name} className="flex items-center gap-3">
              <spec.icon className="h-5 w-5 text-accent" />
              <span>
                <span className="font-semibold text-foreground">{spec.name}:</span> {spec.value}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="bg-secondary/30 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Switch
            id={`select-${product.id}`}
            checked={isSelected}
            onCheckedChange={(checked) => onSelect(product, checked)}
            aria-label={`Select ${product.name}`}
          />
          <label htmlFor={`select-${product.id}`} className="text-sm font-medium">
            Select
          </label>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link href={product.url} target="_blank" rel="noopener noreferrer">
            View Product
            <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
