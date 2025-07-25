import type { LucideIcon } from 'lucide-react';

export interface Spec {
  name: string;
  value: string;
  icon: LucideIcon;
}

export interface Emi {
  12: number;
  18: number;
  24: number;
}

export interface Product {
  id: string;
  category: 'laptop' | 'peripheral';
  name: string;
  price: number;
  url: string;
  imageUrl: string;
  dataAiHint: string;
  specs: Spec[];
  emi?: Emi;
}
