
import Link from 'next/link';
import { laptopData, peripheralData } from '@/lib/data';
import type { Product } from '@/lib/types';
import { ProductCard } from '@/components/product-card';
import { ComparisonTable } from '@/components/comparison-table';
import { FinancingRecommendation } from '@/components/financing-recommendation';
import { PeripheralsSelection } from '@/components/peripherals-selection';
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

import { HomepageContent } from '@/components/homepage-content';

export default function Home() {
  return <HomepageContent />;
}
