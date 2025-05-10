export interface Tag {
  id: string;
  name: string;
  description: string;
  category: 'positive' | 'negative' | 'neutral';
  createdAt: string;
  updatedAt: string;
} 