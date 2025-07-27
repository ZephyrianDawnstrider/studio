
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
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ExternalLink, Loader } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

interface ComparisonTableProps {
  laptops: Product[];
  isLoading?: boolean;
}

const comparisonFeatures = ['Price', 'CPU', 'GPU', 'RAM', 'Storage', 'Display'];

export function ComparisonTable({ laptops, isLoading = false }: ComparisonTableProps) {
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
  
  const renderLoadingState = () => (
    <div className="overflow-x-auto">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="font-bold min-w-[120px]">Feature</TableHead>
                    <TableHead className="font-bold min-w-[200px]"><Skeleton className="h-5 w-4/5" /></TableHead>
                    <TableHead className="font-bold min-w-[200px]"><Skeleton className="h-5 w-4/5" /></TableHead>
                    <TableHead className="font-bold min-w-[200px]"><Skeleton className="h-5 w-4/5" /></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {comparisonFeatures.map((feature) => (
                    <TableRow key={feature}>
                        <TableCell className="font-medium">{feature}</TableCell>
                        <TableCell><Skeleton className="h-5 w-3/5" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-3/5" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-3/5" /></TableCell>
                    </TableRow>
                ))}
                <TableRow>
                    <TableCell></TableCell>
                    <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                </TableRow>
            </TableBody>
        </Table>
    </div>
  );

  const renderComparisonTable = () => (
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
            <TableRow>
                <TableCell></TableCell>
                {laptops.map((laptop) => (
                    <TableCell key={laptop.id}>
                        <Button asChild className="w-full">
                            <Link href={laptop.url} target="_blank" rel="noopener noreferrer">
                                Shop Now <ExternalLink className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </TableCell>
                ))}
            </TableRow>
            </TableBody>
        </Table>
    </div>
  )

  const renderEmptyState = () => (
    <div className="text-center py-10 text-muted-foreground">
        <p>No comparable laptops found at the moment.</p>
        <p className="text-sm">Try changing the featured laptop to get new suggestions.</p>
    </div>
  )

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-4">
            AI Laptop Comparison
            {isLoading && <Loader className="animate-spin text-primary" />}
        </CardTitle>
        <CardDescription>
          Side-by-side comparison of your selected laptop and AI-powered suggestions from the web.
        </CardDescription>
      </CardHeader>
      <CardContent>
       {isLoading ? renderLoadingState() : (laptops.length > 1 ? renderComparisonTable() : renderEmptyState())}
      </CardContent>
    </Card>
  );
}
