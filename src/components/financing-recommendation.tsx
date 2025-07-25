"use client";

import { useState } from 'react';
import { financingRecommendation } from '@/ai/flows/financing-recommendation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, Lightbulb } from 'lucide-react';

interface FinancingRecommendationProps {
  totalCost: number;
}

export function FinancingRecommendation({ totalCost }: FinancingRecommendationProps) {
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState('');
  const { toast } = useToast();

  const handleGetRecommendation = async () => {
    setLoading(true);
    setRecommendation('');
    try {
      const result = await financingRecommendation({ totalCost });
      setRecommendation(result.recommendation);
    } catch (error) {
      console.error('Failed to get financing recommendation:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not fetch financing advice. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-secondary/50 dark:bg-card mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="text-primary" />
          AI Financing Assistant
        </CardTitle>
        <CardDescription>
          Get AI-powered advice on how to finance your purchase.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : recommendation ? (
          <div className="prose prose-sm text-foreground max-w-none dark:prose-invert relative pl-8">
            <Lightbulb className="absolute left-0 top-0.5 h-5 w-5 text-accent"/>
            <p>{recommendation}</p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Click the button to get your personalized financing recommendation based on your total cost.
          </p>
        )}
        <Button
          onClick={handleGetRecommendation}
          disabled={loading || totalCost === 0}
          className="mt-4 w-full"
        >
          {loading ? 'Analyzing...' : 'Get Financing Advice'}
        </Button>
      </CardContent>
    </Card>
  );
}
