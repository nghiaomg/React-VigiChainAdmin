import { create } from "zustand";
import api from "@/utils/axios";

export interface Chain {
  id: string;
  name: string;
  chainId: number;
  rpcUrl: string;
  explorerUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationData {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface ChainsFilters {
  name?: string;
  chainId?: number;
  [key: string]: any;
}

interface ChainsState {
  chains: Chain[];
  selectedChain: Chain | null;
  isLoading: boolean;
  error: string | null;
  pagination: PaginationData;
  filters: ChainsFilters;
  sortBy: string;
  sortOrder: 'asc' | 'desc';

  // Actions
  fetchChains: (page?: number, limit?: number) => Promise<void>;
  getChainById: (id: string) => Promise<void>;
  getChainByChainId: (chainId: number) => Promise<void>;
  getChainByName: (name: string) => Promise<void>;
  createChain: (data: {
    name: string;
    chainId: number;
    rpcUrl: string;
    explorerUrl: string;
  }) => Promise<void>;
  updateChain: (
    id: string,
    data: {
      name: string;
      chainId: number;
      rpcUrl: string;
      explorerUrl: string;
    }
  ) => Promise<void>;
  deleteChain: (id: string) => Promise<void>;
  setFilters: (newFilters: Partial<ChainsFilters>) => void;
  resetFilters: () => void;
  setSorting: (sortBy: string, sortOrder?: 'asc' | 'desc') => void;
}

const useChainsStore = create<ChainsState>((set, get) => ({
  chains: [],
  selectedChain: null,
  isLoading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  },
  filters: {},
  sortBy: 'updatedAt',
  sortOrder: 'desc',

  // Fetch all chains with pagination
  fetchChains: async (page = 1, limit = 10) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get('/v1/chains', {
        params: {
          page,
          limit,
          ...get().filters,
          sortBy: get().sortBy,
          sortOrder: get().sortOrder,
        },
      });

      if (response.data?.data) {
        // Handle both paginated and non-paginated responses
        if (response.data.data.data && response.data.data.pagination) {
          // Paginated response
          const { data, pagination } = response.data.data;
          set({
            chains: data,
            pagination: {
              total: pagination.total || 0,
              page: pagination.page || page,
              limit: pagination.limit || limit,
              pages: pagination.pages || Math.ceil((pagination.total || 0) / limit),
            },
          });
        } else {
          // Non-paginated response
          set({
            chains: response.data.data,
            pagination: {
              total: response.data.data.length,
              page: 1,
              limit: response.data.data.length,
              pages: 1,
            },
          });
        }
      }

      set({ isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch chains',
      });
      throw error;
    }
  },

  // Get chain by ID
  getChainById: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get(`/v1/chains/${id}`);

      if (response.data?.data) {
        set({ selectedChain: response.data.data });
      }

      set({ isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to get chain',
      });
      throw error;
    }
  },

  // Get chain by chain ID
  getChainByChainId: async (chainId: number) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get(`/v1/chains/chain/${chainId}`);

      if (response.data?.data) {
        set({ selectedChain: response.data.data });
      }

      set({ isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to get chain',
      });
      throw error;
    }
  },

  // Get chain by name
  getChainByName: async (name: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get(`/v1/chains/name/${name}`);

      if (response.data?.data) {
        set({ selectedChain: response.data.data });
      }

      set({ isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to get chain',
      });
      throw error;
    }
  },

  // Create new chain
  createChain: async (data: {
    name: string;
    chainId: number;
    rpcUrl: string;
    explorerUrl: string;
  }) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.post('/v1/chains', data);

      if (response.data?.data) {
        // Refresh the chains list
        await get().fetchChains();
      }

      set({ isLoading: false });
      return response.data?.data;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to create chain',
      });
      throw error;
    }
  },

  // Update chain
  updateChain: async (
    id: string,
    data: {
      name: string;
      chainId: number;
      rpcUrl: string;
      explorerUrl: string;
    }
  ) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.put(`/v1/chains/${id}`, data);

      if (response.data?.data) {
        // Refresh the chains list
        await get().fetchChains();

        // Update selected chain if it's the one being edited
        if (get().selectedChain?.id === id) {
          set({ selectedChain: response.data.data });
        }
      }

      set({ isLoading: false });
      return response.data?.data;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to update chain',
      });
      throw error;
    }
  },

  // Delete chain
  deleteChain: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      await api.delete(`/v1/chains/${id}`);

      // Refresh the chains list
      await get().fetchChains();

      // Clear selected chain if it was deleted
      if (get().selectedChain?.id === id) {
        set({ selectedChain: null });
      }

      set({ isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to delete chain',
      });
      throw error;
    }
  },

  // Set filters
  setFilters: (newFilters: Partial<ChainsFilters>) => {
    const currentFilters = get().filters;
    set({
      filters: {
        ...currentFilters,
        ...newFilters,
      },
    });

    get().fetchChains(1, get().pagination.limit);
  },

  // Reset filters
  resetFilters: () => {
    set({ filters: {} });

    get().fetchChains(1, get().pagination.limit);
  },

  // Set sorting
  setSorting: (sortBy: string, sortOrder: 'asc' | 'desc' = 'desc') => {
    set({
      sortBy,
      sortOrder,
    });

    get().fetchChains(get().pagination.page, get().pagination.limit);
  },
}));

export default useChainsStore; 