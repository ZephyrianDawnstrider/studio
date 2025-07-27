
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, ExternalLink } from 'lucide-react';
import * as icons from 'lucide-react';

import type { Product } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  onSelect: (product: Product, selected: boolean) => void;
  isClickable?: boolean;
}

export function ProductCard({ product, isSelected, onSelect, isClickable = true }: ProductCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isClickable) {
      // prevent click event from bubbling up to parent Link component
      if ((e.target as HTMLElement).closest('a')) {
          e.stopPropagation();
          return;
      }
      onSelect(product, !isSelected);
    }
  };

  return (
    <Card 
      className={cn(
        "flex flex-col h-full transition-all duration-300",
        isClickable && "cursor-pointer hover:shadow-xl hover:-translate-y-1",
        isSelected && "ring-2 ring-primary"
      )}
      onClick={handleCardClick}
    >
      <CardHeader className="p-0 relative">
        {isSelected && (
          <div className="absolute top-2 right-2 z-10 bg-primary rounded-full text-primary-foreground">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        )}
        <div className="relative h-48 w-full">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover rounded-t-lg"
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
          {product.specs.map((spec) => {
            const Icon = icons[spec.icon as keyof typeof icons] as icons.LucideIcon;
            return (
              <li key={spec.name} className="flex items-center gap-3">
                {Icon && <Icon className="h-5 w-5 text-accent" />}
                <span>
                  <span className="font-semibold text-foreground">{spec.name}:</span> {spec.value}
                </span>
              </li>
            )
          })}
        </ul>
      </CardContent>
      <CardFooter className="p-4 pt-0 mt-auto">
        <Button asChild className="w-full">
          <Link href={product.url} target="_blank" rel="noopener noreferrer">
            Shop Now <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
