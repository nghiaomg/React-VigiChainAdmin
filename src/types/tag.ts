export interface Category {
  id: string;
  name: string;
  description: string;
  type: 'positive' | 'negative' | 'neutral';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  category: Category;
  value: string;
  type: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
} 