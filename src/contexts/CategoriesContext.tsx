import React, { createContext, useContext, useEffect } from 'react';
import useCategoriesStore from '@/stores/categoriesStore';
import type { Category } from '@/types/category';

interface CategoryFilters {
  name?: string;
  type?: 'positive' | 'negative' | 'neutral' | '';
  isActive?: boolean | null;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface CategoriesContextType {
  // State
  categories: Category[];
  selectedCategory: Category | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  filters: CategoryFilters;
  actionMenuAnchor: HTMLElement | null;
  selectedCategoryId: string | null;
  
  // Actions
  fetchCategories: (page?: number, limit?: number) => Promise<void>;
  getCategoryById: (id: string) => Promise<void>;
  getCategoryByName: (name: string) => Promise<void>;
  createCategory: (data: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>) => Promise<void>;
  updateCategory: (id: string, data: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  getCategoriesByType: (type: 'positive' | 'negative' | 'neutral') => Promise<void>;
  getMultipleCategories: (categoryIds: string[]) => Promise<void>;
  updateCategoryStatus: (id: string, isActive: boolean) => Promise<void>;
  setFilters: (filters: CategoryFilters) => void;
  resetFilters: () => void;
  setActionMenuAnchor: (anchor: HTMLElement | null) => void;
  setSelectedCategoryId: (id: string | null) => void;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export const useCategories = () => {
  const context = useContext(CategoriesContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return context;
};

interface CategoriesProviderProps {
  children: React.ReactNode;
}

export const CategoriesProvider: React.FC<CategoriesProviderProps> = ({ children }) => {
  // Get all state and actions from the store
  const {
    categories,
    selectedCategory,
    isLoading,
    error,
    pagination,
    filters,
    actionMenuAnchor,
    selectedCategoryId,
    fetchCategories,
    getCategoryById,
    getCategoryByName,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoriesByType,
    getMultipleCategories,
    updateCategoryStatus,
    setFilters,
    resetFilters,
    setActionMenuAnchor,
    setSelectedCategoryId,
  } = useCategoriesStore();

  // Fetch categories on initial load
  useEffect(() => {
    fetchCategories(1, 10).catch((err: unknown) => {
      console.error('Failed to fetch categories:', err);
    });
  }, [fetchCategories]);

  const value: CategoriesContextType = {
    categories,
    selectedCategory,
    isLoading,
    error,
    pagination,
    filters,
    actionMenuAnchor,
    selectedCategoryId,
    fetchCategories,
    getCategoryById,
    getCategoryByName,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoriesByType,
    getMultipleCategories,
    updateCategoryStatus,
    setFilters,
    resetFilters,
    setActionMenuAnchor,
    setSelectedCategoryId,
  };

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
}; 