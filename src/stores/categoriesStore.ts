import { create } from 'zustand';
import api from '@/utils/axios';
import type { Category } from '@/types/category';

export interface PaginationData {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface CategoryFilters {
  name?: string;
  type?: 'positive' | 'negative' | 'neutral' | '';
  isActive?: boolean | null;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface CategoriesState {
  categories: Category[];
  selectedCategory: Category | null;
  isLoading: boolean;
  error: string | null;
  pagination: PaginationData;
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

const defaultFilters: CategoryFilters = {
  name: '',
  type: '',
  isActive: null,
  sortBy: 'createdAt',
  sortOrder: 'desc'
};

const useCategoriesStore = create<CategoriesState>((set, get) => ({
  categories: [],
  selectedCategory: null,
  isLoading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  },
  filters: { ...defaultFilters },
  actionMenuAnchor: null,
  selectedCategoryId: null,

  // Fetch categories with filters and pagination
  fetchCategories: async (page = 1, limit = 10) => {
    try {
      const { filters } = get();
      set({ isLoading: true, error: null });

      // Build params object
      const params: Record<string, any> = { 
        page, 
        limit 
      };
      
      // Add filter parameters if they exist
      if (filters.name) params.name = filters.name;
      if (filters.type) params.type = filters.type;
      if (filters.isActive !== null) params.isActive = filters.isActive;
      if (filters.sortBy) params.sortBy = filters.sortBy;
      if (filters.sortOrder) params.sortOrder = filters.sortOrder;

      const response = await api.get('/v1/categories', { params });
      
      if (response.data?.data) {
        const { data, pagination } = response.data.data;
        set({
          categories: data || [],
          pagination: {
            total: pagination?.total || 0,
            page: pagination?.page || page,
            limit: pagination?.limit || limit,
            pages: pagination?.pages || Math.ceil((pagination?.total || 0) / limit)
          },
          isLoading: false
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch categories'
      });
      console.error('Error fetching categories:', error);
    }
  },

  // Get category by ID
  getCategoryById: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get(`/v1/categories/${id}`);
      set({
        selectedCategory: response.data.data,
        isLoading: false
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to get category'
      });
      console.error('Error getting category by ID:', error);
    }
  },

  // Get category by name
  getCategoryByName: async (name: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get(`/v1/categories/name/${name}`);
      set({
        selectedCategory: response.data.data,
        isLoading: false
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to get category'
      });
      console.error('Error getting category by name:', error);
    }
  },

  // Create a new category
  createCategory: async (data) => {
    try {
      set({ isLoading: true, error: null });
      await api.post('/v1/categories', data);
      await get().fetchCategories();
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to create category'
      });
      console.error('Error creating category:', error);
      throw error;
    }
  },

  // Update an existing category
  updateCategory: async (id, data) => {
    try {
      set({ isLoading: true, error: null });
      await api.put(`/v1/categories/${id}`, data);
      await get().fetchCategories();
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to update category'
      });
      console.error('Error updating category:', error);
      throw error;
    }
  },

  // Delete a category
  deleteCategory: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await api.delete(`/v1/categories/${id}`);
      await get().fetchCategories();
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to delete category'
      });
      console.error('Error deleting category:', error);
      throw error;
    }
  },

  // Get categories by type
  getCategoriesByType: async (type) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get(`/v1/categories/type/${type}`);
      set({
        categories: response.data.data || [],
        isLoading: false
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to get categories by type'
      });
      console.error('Error getting categories by type:', error);
    }
  },

  // Get multiple categories by IDs
  getMultipleCategories: async (categoryIds) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.post('/v1/categories/multiple', { categoryIds });
      set({
        categories: response.data.data || [],
        isLoading: false
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to get multiple categories'
      });
      console.error('Error getting multiple categories:', error);
    }
  },

  // Update category status
  updateCategoryStatus: async (id, isActive) => {
    try {
      set({ isLoading: true, error: null });
      await api.put(`/v1/categories/${id}/status`, { isActive });
      await get().fetchCategories();
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to update category status'
      });
      console.error('Error updating category status:', error);
      throw error;
    }
  },

  // Set filters for fetching categories
  setFilters: (filters) => {
    set({ filters: { ...get().filters, ...filters } });
    // Fetch with new filters
    get().fetchCategories(1, get().pagination.limit);
  },

  // Reset filters to default
  resetFilters: () => {
    set({ filters: { ...defaultFilters } });
    // Fetch with reset filters
    get().fetchCategories(1, get().pagination.limit);
  },

  // Set action menu anchor
  setActionMenuAnchor: (anchor) => {
    set({ actionMenuAnchor: anchor });
  },

  // Set selected category ID
  setSelectedCategoryId: (id) => {
    set({ selectedCategoryId: id });
  }
}));

export default useCategoriesStore; 