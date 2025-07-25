"use client";

import type { Product } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ComparisonTableProps {
  laptops: Product[];
}

const comparisonFeatures = ['Price', 'CPU', 'GPU', 'RAM', 'Storage', 'Display'];

export function ComparisonTable({ laptops }: ComparisonTableProps) {
  if (laptops.length < 2) {
    return null;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getSpecValue = (product: Product, feature: string) => {
    if (feature === 'Price') {
      return formatCurrency(product.price);
    }
    const spec = product.specs.find((s) => s.name === feature);
    return spec ? spec.value : 'N/A';
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="font-headline">Laptop Comparison</CardTitle>
        <CardDescription>
          Side-by-side comparison of your selected laptops.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold min-w-[120px]">Feature</TableHead>
                {laptops.map((laptop) => (
                  <TableHead key={laptop.id} className="font-bold min-w-[200px]">{laptop.name}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {comparisonFeatures.map((feature) => (
                <TableRow key={feature}>
                  <TableCell className="font-medium">{feature}</TableCell>
                  {laptops.map((laptop) => (
                    <TableCell key={laptop.id}>
                      {getSpecValue(laptop, feature)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
