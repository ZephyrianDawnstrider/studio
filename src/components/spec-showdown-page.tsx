"use client";

import { useState, useMemo, useCallback } from 'react';
import { laptopData, peripheralData } from '@/lib/data';
import type { Product } from '@/lib/types';
import { ProductCard } from '@/components/product-card';
import { ComparisonTable } from '@/components/comparison-table';
import { FinancingRecommendation } from '@/components/financing-recommendation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import { Trash2, CreditCard } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

export default function SpecShowdownPage() {
  const [selectedLaptops, setSelectedLaptops] = useState<Product[]>([]);
  const [selectedPeripherals, setSelectedPeripherals] = useState<Product[]>([]);

  const handleSelect = useCallback((product: Product, selected: boolean) => {
    const list = product.category === 'laptop' ? selectedLaptops : selectedPeripherals;
    const setter = product.category === 'laptop' ? setSelectedLaptops : setSelectedPeripherals;

    if (selected) {
      setter([...list, product]);
    } else {
      setter(list.filter((p) => p.id !== product.id));
    }
  }, [selectedLaptops, selectedPeripherals]);

  const { totalCost, totalEmi } = useMemo(() => {
    const allSelected = [...selectedLaptops, ...selectedPeripherals];
    const cost = allSelected.reduce((acc, item) => acc + item.price, 0);

    const emi = selectedPeripherals.reduce(
      (acc, item) => {
        if (item.emi) {
          acc[12] += item.emi[12];
          acc[18] += item.emi[18];
          acc[24] += item.emi[24];
        }
        return acc;
      },
      { 12: 0, 18: 0, 24: 0 }
    );
    return { totalCost: cost, totalEmi: emi };
  }, [selectedLaptops, selectedPeripherals]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const clearSelection = () => {
    setSelectedLaptops([]);
    setSelectedPeripherals([]);
  };

  const allSelectedItems = [...selectedLaptops, ...selectedPeripherals];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary tracking-tight">
            Spec<span className="text-accent">Showdown</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Your ultimate tool to compare high-performance laptops and peripherals. Build your dream setup and get smart financing advice.
          </p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-3xl font-headline font-bold mb-6">Laptops</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {laptopData.map((laptop) => (
                  <ProductCard
                    key={laptop.id}
                    product={laptop}
                    isSelected={selectedLaptops.some((p) => p.id === laptop.id)}
                    onSelect={handleSelect}
                  />
                ))}
              </div>
            </section>
            <section>
              <h2 className="text-3xl font-headline font-bold mb-6">Peripherals</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {peripheralData.map((peripheral) => (
                  <ProductCard
                    key={peripheral.id}
                    product={peripheral}
                    isSelected={selectedPeripherals.some((p) => p.id === peripheral.id)}
                    onSelect={handleSelect}
                  />
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-1 sticky top-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Your Setup</CardTitle>
                <CardDescription>Review your selections and total cost.</CardDescription>
              </CardHeader>
              <CardContent>
                {allSelectedItems.length > 0 ? (
                  <>
                  <ScrollArea className="h-48 pr-4">
                    <ul className="space-y-3">
                      {allSelectedItems.map(item => (
                        <li key={item.id} className="flex justify-between items-center text-sm">
                          <span className="font-medium truncate pr-2">{item.name}</span>
                          <span className="font-mono text-primary whitespace-nowrap">{formatCurrency(item.price)}</span>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                   <Button variant="ghost" size="sm" className="mt-2 text-destructive hover:text-destructive" onClick={clearSelection}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Clear All
                    </Button>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-10">Select items to see your setup summary.</p>
                )}
                
                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between items-baseline font-bold text-lg">
                    <span>Total Cost</span>
                    <span className="font-mono text-2xl text-primary">{formatCurrency(totalCost)}</span>
                  </div>
                </div>

                {totalEmi[12] > 0 && (
                   <Card className="bg-secondary/30 dark:bg-card mt-4">
                      <CardHeader className="p-4">
                        <CardTitle className="text-base flex items-center gap-2">
                          <CreditCard className="text-accent" />
                          EMI for Peripherals
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 text-sm">
                        <div className="flex justify-between"><span>12 Months:</span> <span className="font-mono">{formatCurrency(totalEmi[12])}/mo</span></div>
                        <div className="flex justify-between"><span>18 Months:</span> <span className="font-mono">{formatCurrency(totalEmi[18])}/mo</span></div>
                        <div className="flex justify-between"><span>24 Months:</span> <span className="font-mono">{formatCurrency(totalEmi[24])}/mo</span></div>
                      </CardContent>
                    </Card>
                )}

                <FinancingRecommendation totalCost={totalCost} />
              </CardContent>
            </Card>
          </div>
        </div>
        
        {selectedLaptops.length > 1 && (
            <div className="mt-12">
                <ComparisonTable laptops={selectedLaptops} />
            </div>
        )}
      </main>
    </div>
  );
}
