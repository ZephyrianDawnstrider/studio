
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
import { suggestLaptops } from '@/ai/flows/laptop-suggestion-flow';

async function getSuggestedLaptops(featuredLaptop: Product) {
  const cpu = featuredLaptop.specs.find(s => s.name === 'CPU')?.value || '';
  const gpu = featuredLaptop.specs.find(s => s.name === 'GPU')?.value || '';
  const ram = featuredLaptop.specs.find(s => s.name === 'RAM')?.value || '';
  const price = featuredLaptop.price;

  try {
    const response = await suggestLaptops({ cpu, gpu, ram, price });
    return response.suggestions.filter((suggestion: Product) => suggestion.id !== featuredLaptop.id);
  } catch (error) {
    console.error("Failed to fetch suggested laptops:", error);
    return [];
  }
}

export default async function Home() {
  const selectedLaptops: Product[] = [laptopData[0]];
  const selectedPeripherals: Product[] = [];
  const featuredLaptop = selectedLaptops[0];

  const suggestedLaptops = await getSuggestedLaptops(featuredLaptop);

  const allSelectedItems = [featuredLaptop, ...selectedPeripherals];

  const totalCost = allSelectedItems.reduce((acc, item) => acc + item.price, 0);

  const calculateEmi = (principal: number, months: number) => {
    const annualRate = 0.15;
    const monthlyRate = annualRate / 12;
    if (monthlyRate === 0) return principal / months;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    return emi;
  };

  const totalEmi = {
    12: calculateEmi(totalCost, 12),
    18: calculateEmi(totalCost, 18),
    24: calculateEmi(totalCost, 24),
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

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
              <ProductCard
                product={featuredLaptop}
                isSelected={true}
                onSelect={() => {}}
                isClickable={false}
              />
            </section>
            <section>
              <h2 className="text-3xl font-headline font-bold mb-6">Choose Your Peripherals</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {peripheralData.map((peripheral) => (
                  <ProductCard
                    key={peripheral.id}
                    product={peripheral}
                    isSelected={false}
                    onSelect={() => {}}
                    isClickable={false}
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

                {totalCost > 0 && (
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

                {totalCost > 0 && <FinancingRecommendation totalCost={totalCost} />}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-12">
          <ComparisonTable laptops={suggestedLaptops.slice(0, 3)} isLoading={false} />
        </div>
      </main>
    </div>
  );
}
