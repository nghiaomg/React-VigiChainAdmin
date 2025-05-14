import React, { createContext, useContext, useEffect, type ReactNode, useState } from 'react';
import useChainsStore from '@/stores/chainsStore';
import type { Chain } from '@/stores/chainsStore';

interface ChainsContextType {
  // State
  chains: Chain[];
  selectedChain: Chain | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  filters: {
    name?: string;
    chainId?: number;
  };

  // Actions
  fetchChains: (page: number, limit: number) => Promise<void>;
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
  setFilters: React.Dispatch<React.SetStateAction<{ name?: string; chainId?: number }>>;
}

const ChainsContext = createContext<ChainsContextType | undefined>(undefined);

export const useChains = () => {
  const context = useContext(ChainsContext);
  if (context === undefined) {
    throw new Error('useChains must be used within a ChainsProvider');
  }
  return context;
};

interface ChainsProviderProps {
  children: ReactNode;
}

export const ChainsProvider: React.FC<ChainsProviderProps> = ({ children }) => {
  // Get all state and actions from the store
  const {
    chains,
    selectedChain,
    isLoading,
    error,
    pagination,
    fetchChains,
    getChainById,
    getChainByChainId,
    getChainByName,
    createChain,
    updateChain,
    deleteChain,
  } = useChainsStore();

  const [filters, setFilters] = useState<{ name?: string; chainId?: number }>({});

  useEffect(() => {
    console.log('fetching chains');
    fetchChains(1, 10).catch((err: unknown) => {
      console.error('Failed to fetch chains:', err);
    });
  }, [fetchChains]);

  // Ensure we have pagination data with safe defaults
  const paginationWithPages = {
    total: pagination?.total || 0,
    page: pagination?.page || 1,
    limit: pagination?.limit || 10,
    pages: pagination?.total ? Math.ceil(pagination.total / (pagination?.limit || 10)) : 0,
  };

  const value: ChainsContextType = {
    chains,
    selectedChain,
    isLoading,
    error,
    pagination: paginationWithPages,
    filters,
    fetchChains,
    getChainById,
    getChainByChainId,
    getChainByName,
    createChain,
    updateChain,
    deleteChain,
    setFilters,
  };

  return <ChainsContext.Provider value={value}>{children}</ChainsContext.Provider>;
}; 