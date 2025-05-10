export interface Category {
  id: string;
  name: string;
  description: string;
  type: 'positive' | 'negative' | 'neutral';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
} 