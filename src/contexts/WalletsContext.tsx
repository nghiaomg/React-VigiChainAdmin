import React, { createContext, useContext, useEffect, type ReactNode } from 'react';
import useWalletsStore from '@/stores/walletsStore';
import type { Wallet, WalletAnalysisResult, Tag } from '@/stores/walletsStore';

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface WalletsContextType {
  // State
  wallets: Wallet[];
  filteredWallets: Wallet[];
  selectedWallet: Wallet | null;
  analysisResult: WalletAnalysisResult | null;
  tags: Tag[];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  riskLevel: 'all' | 'low' | 'medium' | 'high';
  pagination: PaginationData;
  
  // Actions
  fetchWallets: (page?: number, limit?: number) => Promise<void>;
  getWalletDetails: (id: string) => Promise<void>;
  analyzeWallet: (id: string) => Promise<void>;
  blockWallet: (id: string) => Promise<void>;
  markWalletSafe: (id: string) => Promise<void>;
  addTag: (walletId: string, tagName: string) => Promise<void>;
  removeTag: (walletId: string, tagName: string) => Promise<void>;
  setSearchTerm: (term: string) => void;
  setRiskLevel: (level: 'all' | 'low' | 'medium' | 'high') => void;
}

const WalletsContext = createContext<WalletsContextType | undefined>(undefined);

export const useWallets = () => {
  const context = useContext(WalletsContext);
  if (context === undefined) {
    throw new Error('useWallets must be used within a WalletsProvider');
  }
  return context;
};

interface WalletsProviderProps {
  children: ReactNode;
}

export const WalletsProvider: React.FC<WalletsProviderProps> = ({ children }) => {
  // Get all state and actions from the store
  const {
    wallets,
    filteredWallets,
    selectedWallet,
    analysisResult,
    tags,
    isLoading,
    error,
    searchTerm,
    riskLevel,
    pagination,
    fetchWallets,
    getWalletDetails,
    analyzeWallet,
    blockWallet,
    markWalletSafe,
    addTag,
    removeTag,
    setSearchTerm,
    setRiskLevel,
  } = useWalletsStore();

  // Fetch wallets on initial load
  useEffect(() => {
    fetchWallets().catch((err: unknown) => {
      console.error('Failed to fetch wallets:', err);
    });
  }, [fetchWallets]);

  const value: WalletsContextType = {
    wallets,
    filteredWallets,
    selectedWallet,
    analysisResult,
    tags,
    isLoading,
    error,
    searchTerm,
    riskLevel,
    pagination,
    fetchWallets,
    getWalletDetails,
    analyzeWallet,
    blockWallet,
    markWalletSafe,
    addTag,
    removeTag,
    setSearchTerm,
    setRiskLevel,
  };

  return (
    <WalletsContext.Provider value={value}>
      {children}
    </WalletsContext.Provider>
  );
};
