

"use client";

import { useState, useMemo, useCallback, use, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import * as icons from 'lucide-react';
import { laptopData, peripheralData } from '@/lib/data';
import type { Product } from '@/lib/types';
import { ProductCard } from '@/components/product-card';
import { ComparisonTable } from '@/components/comparison-table';
import { FinancingRecommendation } from '@/components/financing-recommendation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2, CreditCard } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { suggestLaptops } from '@/ai/flows/laptop-suggestion-flow';
import './product-page.css';

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const [selectedPeripherals, setSelectedPeripherals] = useState<Product[]>([]);
  const [suggestedLaptops, setSuggestedLaptops] = useState<Product[]>([]);
  const { id } = use(params);

  const featuredLaptop = laptopData.find((p) => p.id === id);

  useEffect(() => {
    if (featuredLaptop) {
      const cpu = featuredLaptop.specs.find(s => s.name === 'CPU')?.value || '';
      const gpu = featuredLaptop.specs.find(s => s.name === 'GPU')?.value || '';
      const ram = featuredLaptop.specs.find(s => s.name === 'RAM')?.value || '';
      const price = featuredLaptop.price;

      suggestLaptops({ cpu, gpu, ram, price })
        .then(response => {
          const filteredSuggestions = response.suggestions.filter(
            (suggestion: Product) => suggestion.id !== featuredLaptop.id
          );
          setSuggestedLaptops(filteredSuggestions);
        })
        .catch(error => {
          console.error("Failed to fetch suggested laptops:", error);
        });
    }
  }, [featuredLaptop]);

  if (!featuredLaptop) {
    notFound();
  }

  const handleSelectPeripheral = useCallback((product: Product, selected: boolean) => {
    if (selected) {
      setSelectedPeripherals((prev) => [...prev, product]);
    } else {
      setSelectedPeripherals((prev) => prev.filter((p) => p.id !== product.id));
    }
  }, []);

  const { totalCost, totalEmi } = useMemo(() => {
    const allSelected = [featuredLaptop, ...selectedPeripherals];
    const cost = allSelected.reduce((acc, item) => acc + item.price, 0);

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
  
  const comparisonLaptops = [featuredLaptop, ...suggestedLaptops.slice(0, 2)];

  return (
    <div
      className="min-h-screen bg-background text-foreground product-page-background"
      style={{'--bg-image': `url(${featuredLaptop.imageUrl})`} as React.CSSProperties}
    >
      <div className="backdrop-blur-sm bg-background/80 min-h-screen">
        <main className="container mx-auto px-4 py-8">
          <header className="mb-12">
            <Link href="/products" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Laptops
              </Button>
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary-foreground drop-shadow-lg tracking-tight">
              {featuredLaptop.name}
            </h1>
          </header>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-12">
              <section>
                <Card className="bg-card/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="relative h-64 w-full rounded-lg overflow-hidden shadow-lg">
                        <Image
                          src={featuredLaptop.imageUrl}
                          alt={featuredLaptop.name}
                          fill
                          className="object-cover"
                          data-ai-hint={featuredLaptop.dataAiHint}
                        />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold font-headline">{featuredLaptop.name}</h2>
                        <p className="text-3xl font-bold text-primary mt-2 mb-4">
                          {formatCurrency(featuredLaptop.price)}
                        </p>
                        <Separator />
                        <ul className="space-y-3 text-sm text-muted-foreground mt-4">
                          {featuredLaptop.specs.map((spec) => {
                            const Icon = icons[spec.icon as keyof typeof icons] as icons.LucideIcon;
                            return (
                              <li key={spec.name} className="flex items-center gap-3">
                                {Icon && <Icon className="h-5 w-5 text-accent" />}
                                <span>
                                  <span className="font-semibold text-foreground">{spec.name}:</span> {spec.value}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>
              <section>
                <h2 className="text-3xl font-headline font-bold mb-6 text-primary-foreground drop-shadow-md">Add Peripherals</h2>
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
              <Card className="shadow-lg bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">Your Setup</CardTitle>
                  <CardDescription>Your custom configuration.</CardDescription>
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
                    <div className="text-center py-10">
                      <p className="text-sm text-muted-foreground">Your chosen laptop is shown here.</p>
                       <ul className="space-y-3 mt-4">
                          <li className="flex justify-between items-center text-sm">
                              <span className="font-medium truncate pr-2">{featuredLaptop.name}</span>
                              <span className="font-mono text-primary whitespace-nowrap">{formatCurrency(featuredLaptop.price)}</span>
                          </li>
                        </ul>
                    </div>
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
                            EMI for Total Setup
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 text-sm">
                          <div className="flex justify-between"><span>12 Months:</span> <span className="font-mono">{formatCurrency(totalEmi[12])}/mo</span></div>
                          <div className="flex justify-between"><span>18 Months:</span> <span className="font-mono">{formatCurrency(totalEmi[18])}/mo</span></div>
                          <div className="flex justify-between"><span>24 Months:</span> <span className="font-mono">{formatCurrency(totalEmi[24])}/mo</span></div>
                        </CardContent>
                      </Card>
                  )}

                  {totalCost > featuredLaptop.price && <FinancingRecommendation totalCost={totalCost} />}
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="mt-12">
              <ComparisonTable laptops={comparisonLaptops} />
          </div>
        </main>
      </div>
    </div>
  );
}
