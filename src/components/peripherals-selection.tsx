"use client";

import { useState, useCallback } from 'react';
import type { Product } from '@/lib/types';
import { ProductCard } from '@/components/product-card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface PeripheralsSelectionProps {
  peripherals: Product[];
  onSelect?: (product: Product, selected: boolean) => void;
}

export function PeripheralsSelection({ peripherals, onSelect }: PeripheralsSelectionProps) {
  const [selectedPeripherals, setSelectedPeripherals] = useState<Product[]>([]);

  const handleSelectPeripheral = useCallback((product: Product, selected: boolean) => {
    if (selected) {
      setSelectedPeripherals((prev) => [...prev, product]);
      if (onSelect) {
        onSelect(product, true);
      }
    } else {
      setSelectedPeripherals((prev) => prev.filter((p) => p.id !== product.id));
      if (onSelect) {
        onSelect(product, false);
      }
    }
  }, [onSelect]);

  const clearSelection = () => {
    setSelectedPeripherals([]);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {peripherals.map((peripheral) => (
          <ProductCard
            key={peripheral.id}
            product={peripheral}
            isSelected={selectedPeripherals.some((p) => p.id === peripheral.id)}
            onSelect={handleSelectPeripheral}
            isClickable={true}
          />
        ))}
      </div>
      {selectedPeripherals.length > 0 && (
        <Card className="mt-4 shadow-lg">
          <CardHeader>
            <CardTitle>Your Selected Peripherals</CardTitle>
            <CardDescription>Review your selected peripherals.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-48 pr-4">
              <ul className="space-y-3">
                {selectedPeripherals.map((item) => (
                  <li key={item.id} className="flex justify-between items-center text-sm">
                    <span className="font-medium truncate pr-2">{item.name}</span>
                  </li>
                ))}
              </ul>
            </ScrollArea>
            <Button variant="ghost" size="sm" className="mt-2 text-destructive hover:text-destructive" onClick={clearSelection}>
              <Trash2 className="mr-2 h-4 w-4" />
              Clear Selection
            </Button>
          </CardContent>
        </Card>
      )}
    </>
  );
}
