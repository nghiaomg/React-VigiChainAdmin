import { create } from 'zustand';
import api from '@/utils/axios';

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Transaction {
  txId: string;
  toAddress: string;
  amount: number;
  timestamp: string;
}

export interface Wallet {
  id: string;
  address: string;
  reputationScore: number;
  transactionHistory?: Transaction[];
  tags: string[];
  role: string;
  lastAnalyzed: string;
  createdAt: string;
  updatedAt: string;
}

export interface WalletAnalysisResult {
  id: string;
  walletId: string;
  score: number;
  timestamp: string;
  riskFactors: {
    name: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
  }[];
}

export interface PaginationData {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface WalletsState {
  wallets: Wallet[];
  filteredWallets: Wallet[];
  selectedWallet: Wallet | null;
  analysisResult: WalletAnalysisResult | null;
  tags: Tag[];
  isLoading: boolean;
  error: string | null;
  pagination: PaginationData;
  // Filters
  searchTerm: string;
  riskLevel: 'all' | 'low' | 'medium' | 'high';
  role: string;
  // Actions
  fetchWallets: (page?: number, limit?: number) => Promise<void>;
  getWalletDetails: (id: string) => Promise<void>;
  getWalletByAddress: (address: string) => Promise<void>;
  getWalletsByRole: (role: string) => Promise<void>;
  getWalletsByTag: (tagId: string) => Promise<void>;
  createWallet: (address: string, role?: string) => Promise<void>;
  updateWallet: (id: string, data: Partial<Wallet>) => Promise<void>;
  deleteWallet: (id: string) => Promise<void>;
  analyzeWallet: (id: string) => Promise<void>;
  blockWallet: (id: string) => Promise<void>;
  markWalletSafe: (id: string) => Promise<void>;
  addTransaction: (id: string, transaction: Omit<Transaction, 'timestamp'> & { timestamp?: string }) => Promise<void>;
  updateReputationScore: (id: string, score: number) => Promise<void>;
  addTag: (walletId: string, tagName: string) => Promise<void>;
  removeTag: (walletId: string, tagName: string) => Promise<void>;
  setSearchTerm: (term: string) => void;
  setRiskLevel: (level: 'all' | 'low' | 'medium' | 'high') => void;
  setRole: (role: string) => void;
}

// Helper function to determine risk level
export const getRiskLevel = (score: number) => {
  if (score >= 80) return 'low';
  if (score >= 50) return 'medium';
  return 'high';
};

const useWalletsStore = create<WalletsState>((set, get) => ({
  wallets: [],
  filteredWallets: [],
  selectedWallet: null,
  analysisResult: null,
  tags: [],
  isLoading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  },
  searchTerm: '',
  riskLevel: 'all',
  role: '',

  // Fetch all wallets with pagination
  fetchWallets: async (page = 1, limit = 10) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get('/v1/wallets', { 
        params: { page, limit }
      });
      
      if (response.data?.data) {
        const { data, pagination } = response.data.data;
        const wallets = data || [];
        
        set({ 
          wallets, 
          filteredWallets: wallets,
          pagination: {
            total: pagination?.total || 0,
            page: pagination?.page || page,
            limit: pagination?.limit || limit,
            pages: pagination?.pages || Math.ceil((pagination?.total || 0) / limit)
          },
          isLoading: false
        });

        // Apply existing filters
        get().setSearchTerm(get().searchTerm);
        get().setRiskLevel(get().riskLevel);
      } else {
        throw new Error('Invalid response format');
      }
      
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to fetch wallets' 
      });
      throw error;
    }
  },

  // Get details for a specific wallet
  getWalletDetails: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get(`/v1/wallets/${id}`);
      set({ 
        selectedWallet: response.data.data,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to get wallet details' 
      });
      throw error;
    }
  },

  // Get wallet by blockchain address
  getWalletByAddress: async (address: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get('/v1/wallets/address', { 
        params: { address } 
      });
      set({ 
        selectedWallet: response.data.data,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to get wallet' 
      });
      throw error;
    }
  },

  // Get wallets by role
  getWalletsByRole: async (role: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get('/v1/wallets/role', { 
        params: { role } 
      });
      const wallets = response.data.data || [];
      
      set({ 
        wallets,
        filteredWallets: wallets,
        isLoading: false,
        role
      });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to fetch wallets by role' 
      });
      throw error;
    }
  },

  // Get wallets by tag
  getWalletsByTag: async (tagId: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get('/v1/wallets/tag', { 
        params: { tagId } 
      });
      const wallets = response.data.data || [];
      
      set({ 
        wallets,
        filteredWallets: wallets,
        isLoading: false
      });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to fetch wallets by tag' 
      });
      throw error;
    }
  },

  // Create a new wallet
  createWallet: async (address: string, role?: string) => {
    try {
      set({ isLoading: true, error: null });
      const payload: { address: string; role?: string } = { address };
      
      if (role) {
        payload.role = role;
      }
      
      await api.post('/v1/wallets', payload);
      
      // Refresh wallets list
      await get().fetchWallets();
      
      set({ isLoading: false });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to create wallet' 
      });
      throw error;
    }
  },

  // Update wallet
  updateWallet: async (id: string, data: Partial<Wallet>) => {
    try {
      set({ isLoading: true, error: null });
      await api.put(`/v1/wallets/${id}`, data);
      
      // Refresh wallets list
      await get().fetchWallets();
      
      // Update selected wallet if it's the one being edited
      if (get().selectedWallet?.id === id) {
        await get().getWalletDetails(id);
      }
      
      set({ isLoading: false });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to update wallet' 
      });
      throw error;
    }
  },

  // Delete wallet
  deleteWallet: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      await api.delete(`/v1/wallets/${id}`);
      
      // Refresh wallets list
      await get().fetchWallets();
      
      // Clear selected wallet if it was deleted
      if (get().selectedWallet?.id === id) {
        set({ selectedWallet: null });
      }
      
      set({ isLoading: false });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to delete wallet' 
      });
      throw error;
    }
  },

  // Analyze a wallet
  analyzeWallet: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.post(`/v1/wallets/${id}/analyze`);
      set({ 
        analysisResult: response.data.data,
        isLoading: false 
      });

      // Refresh wallets list to get updated scores
      await get().fetchWallets();
      
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to analyze wallet' 
      });
      throw error;
    }
  },

  // Add transaction to wallet
  addTransaction: async (id: string, transaction: Omit<Transaction, 'timestamp'> & { timestamp?: string }) => {
    try {
      set({ isLoading: true, error: null });
      await api.post(`/v1/wallets/${id}/transactions`, transaction);
      
      // Refresh wallet details if it's selected
      if (get().selectedWallet?.id === id) {
        await get().getWalletDetails(id);
      }
      
      set({ isLoading: false });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to add transaction' 
      });
      throw error;
    }
  },

  // Update reputation score
  updateReputationScore: async (id: string, score: number) => {
    try {
      set({ isLoading: true, error: null });
      await api.put(`/v1/wallets/${id}/reputation`, { score });
      
      // Refresh wallets list
      await get().fetchWallets();
      
      // Refresh wallet details if it's selected
      if (get().selectedWallet?.id === id) {
        await get().getWalletDetails(id);
      }
      
      set({ isLoading: false });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to update reputation score' 
      });
      throw error;
    }
  },

  // Block a wallet
  blockWallet: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      await api.post(`/v1/wallets/${id}/block`);
      
      // Refresh wallets list
      await get().fetchWallets();
      
      set({ isLoading: false });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to block wallet' 
      });
      throw error;
    }
  },

  // Mark a wallet as safe
  markWalletSafe: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      await api.post(`/v1/wallets/${id}/mark-safe`);
      
      // Refresh wallets list
      await get().fetchWallets();
      
      set({ isLoading: false });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to mark wallet as safe' 
      });
      throw error;
    }
  },

  // Add a tag to a wallet
  addTag: async (walletId: string, tagName: string) => {
    try {
      set({ isLoading: true, error: null });
      await api.post(`/v1/wallets/${walletId}/tags`, { name: tagName });
      
      // Refresh wallet details if a wallet is selected
      if (get().selectedWallet?.id === walletId) {
        await get().getWalletDetails(walletId);
      }
      
      // Refresh wallets list
      await get().fetchWallets();
      
      set({ isLoading: false });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to add tag' 
      });
      throw error;
    }
  },

  // Remove a tag from a wallet
  removeTag: async (walletId: string, tagName: string) => {
    try {
      set({ isLoading: true, error: null });
      await api.delete(`/v1/wallets/${walletId}/tags/${tagName}`);
      
      // Refresh wallet details if a wallet is selected
      if (get().selectedWallet?.id === walletId) {
        await get().getWalletDetails(walletId);
      }
      
      // Refresh wallets list
      await get().fetchWallets();
      
      set({ isLoading: false });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to remove tag' 
      });
      throw error;
    }
  },

  // Set search term and filter wallets
  setSearchTerm: (term: string) => {
    const { wallets, riskLevel } = get();
    let filtered = [...wallets];
    
    // Apply search filter
    if (term) {
      filtered = filtered.filter(wallet => 
        wallet.address.toLowerCase().includes(term.toLowerCase()) ||
        wallet.tags.some(tag => tag.toLowerCase().includes(term.toLowerCase()))
      );
    }
    
    // Apply risk level filter
    if (riskLevel !== 'all') {
      filtered = filtered.filter(wallet => 
        getRiskLevel(wallet.reputationScore) === riskLevel
      );
    }
    
    set({ 
      searchTerm: term,
      filteredWallets: filtered 
    });
  },

  // Set risk level filter
  setRiskLevel: (level: 'all' | 'low' | 'medium' | 'high') => {
    const { wallets, searchTerm } = get();
    let filtered = [...wallets];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(wallet => 
        wallet.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wallet.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply risk level filter
    if (level !== 'all') {
      filtered = filtered.filter(wallet => 
        getRiskLevel(wallet.reputationScore) === level
      );
    }
    
    set({ 
      riskLevel: level,
      filteredWallets: filtered 
    });
  },

  // Set role filter
  setRole: (role: string) => {
    if (role) {
      get().getWalletsByRole(role);
    } else {
      get().fetchWallets();
    }
  }
}));

export default useWalletsStore; 