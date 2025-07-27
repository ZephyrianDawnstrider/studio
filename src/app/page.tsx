
"use client";

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { laptopData, peripheralData } from '@/lib/data';
import type { Product } from '@/lib/types';
import { ProductCard } from '@/components/product-card';
import { ComparisonTable } from '@/components/comparison-table';
import { FinancingRecommendation } from '@/components/financing-recommendation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Trash2, CreditCard, ArrowRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Home() {
  const [selectedLaptops, setSelectedLaptops] = useState<Product[]>([laptopData[0]]);
  const [selectedPeripherals, setSelectedPeripherals] = useState<Product[]>([]);

  const handleSelectPeripheral = useCallback((product: Product, selected: boolean) => {
    if (selected) {
      setSelectedPeripherals((prev) => [...prev, product]);
    } else {
      setSelectedPeripherals((prev) => prev.filter((p) => p.id !== product.id));
    }
  }, []);

  const featuredLaptop = selectedLaptops[0];

  const { totalCost, totalEmi } = useMemo(() => {
    const allSelected = [featuredLaptop, ...selectedPeripherals];
    const cost = allSelected.reduce((acc, item) => acc + item.price, 0);

    // No-cost EMI is often calculated with a processing fee, here we assume a flat 15% interest rate for calculation
    const calculateEmi = (principal: number, months: number) => {
        const annualRate = 0.15;
        const monthlyRate = annualRate / 12;
        if (monthlyRate === 0) return principal / months;
        const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
        return emi;
    }

    const emi = {
        12: calculateEmi(cost, 12),
        18: calculateEmi(cost, 18),
        24: calculateEmi(cost, 24),
    }

    return { totalCost: cost, totalEmi: emi };
  }, [featuredLaptop, selectedPeripherals]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const clearSelection = () => {
    setSelectedPeripherals([]);
  };

  const allSelectedItems = [featuredLaptop, ...selectedPeripherals];

  const otherLaptops = laptopData.filter(laptop => laptop.id !== featuredLaptop.id);

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
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-headline font-bold">Featured Laptop</h2>
                <Link href="/products">
                  <Button variant="outline">
                    Change Laptop <ArrowRight className="ml-2" />
                  </Button>
                </Link>
              </div>
              <Link href={`/products/${featuredLaptop.id}`}>
                <ProductCard
                  product={featuredLaptop}
                  isSelected={true}
                  onSelect={() => {}}
                  isClickable={false}
                />
              </Link>
            </section>
            <section>
              <h2 className="text-3xl font-headline font-bold mb-6">Choose Your Peripherals</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {peripheralData.map((peripheral) => (
                  <ProductCard
                    key={peripheral.id}
                    product={peripheral}
                    isSelected={selectedPeripherals.some((p) => p.id === peripheral.id)}
                    onSelect={handleSelectPeripheral}
                    isClickable={true}
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
                {allSelectedItems.length > 1 ? (
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
                      Clear Peripherals
                    </Button>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-10">Select peripherals to build your setup.</p>
                )}
                
                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between items-baseline font-bold text-lg">
                    <span>Total Cost</span>
                    <span className="font-mono text-2xl text-primary">{formatCurrency(totalCost)}</span>
                  </div>
                </div>

                {totalCost > featuredLaptop.price && (
                   <Card className="bg-secondary/30 dark:bg-card mt-4">
                      <CardHeader className="p-4">
                        <CardTitle className="text-base flex items-center gap-2">
                          <CreditCard className="text-accent" />
                          EMI for Your Setup
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 text-sm">
                        <div className="flex justify-between"><span>12 Months:</span> <span className="font-mono">{formatCurrency(totalEmi[12])}/mo</span></div>
                        <div className="flex justify-between"><span>18 Months:</span> <span className="font-mono">{formatCurrency(totalEmi[18])}/mo</span></div>
                        <div className="flex justify-between"><span>24 Months:</span> <span className="font-mono">{formatCurrency(totalEmi[24])}/mo</span></div>
                      </CardContent>
                    </Card>
                )}

                {selectedPeripherals.length > 0 && <FinancingRecommendation totalCost={totalCost} />}
              </CardContent>
            </Card>
          </div>
        </div>
        
        {selectedPeripherals.length > 0 && (
            <div className="mt-12">
                <ComparisonTable laptops={[featuredLaptop, ...otherLaptops.slice(0,2)]} />
            </div>
        )}
      </main>
    </div>
  );
}
