import { create } from 'zustand';
import api from '@/utils/axios';
import { ethers } from 'ethers';

interface Wallet {
  id: string;
  address: string;
  reputationScore: number;
  transactionHistory: any[];
  tags: string[];
  role: string;
  lastAnalyzed: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  wallet: Wallet | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isNewAccount: boolean;
  login: (signer: ethers.JsonRpcSigner) => Promise<void>;
  fetchUserProfile: () => Promise<void>;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  wallet: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isNewAccount: false,

  login: async (signer: ethers.JsonRpcSigner) => {
    try {
      set({ isLoading: true, error: null });
      
      // Get wallet address
      const walletAddress = await signer.getAddress();
      
      // Create login message with timestamp
      const timestamp = new Date().toISOString();
      const message = `Login to Go-Vigichain at ${timestamp}`;
      
      // Sign the message
      const signature = await signer.signMessage(message);
      
      // Send signature, message and wallet address to backend for verification
      const response = await api.post('/v1/auth/login', {
        walletAddress,
        signature,
        message
      });
      
      // Extract data from response
      const { token, wallet, isNewAccount } = response.data.data;
      
      // Check if the wallet has admin role
      if (wallet.role !== 'admin') {
        set({ 
          isLoading: false, 
          error: 'Access denied. Admin privileges required.',
          wallet: null,
          isAuthenticated: false,
          isNewAccount: false,
        });
        throw new Error('Access denied. Admin privileges required.');
      }
      
      // Set token in cookie
      document.cookie = `token=${token}; path=/; max-age=86400;`;
      
      // Update auth headers for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      set({ 
        wallet,
        isAuthenticated: true,
        isLoading: false,
        isNewAccount,
      });
      
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || error.message || 'Login failed',
        wallet: null,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  fetchUserProfile: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await api.get('/v1/auth/me');
      const wallet = response.data.data;
      
      // Validate that the user has admin role
      if (wallet.role !== 'admin') {
        set({ 
          isLoading: false, 
          error: 'Access denied. Admin privileges required.',
          isAuthenticated: false,
          wallet: null
        });
        throw new Error('Access denied. Admin privileges required.');
      }
      
      set({ 
        wallet,
        isAuthenticated: true,
        isLoading: false,
      });
      
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || error.message || 'Failed to fetch user profile',
        isAuthenticated: false,
        wallet: null
      });
      throw error;
    }
  },

  logout: () => {
    // Remove token cookie
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    
    // Remove auth header
    delete api.defaults.headers.common['Authorization'];
    
    set({
      wallet: null,
      isAuthenticated: false,
      error: null,
      isNewAccount: false,
    });
  }
}));

export default useAuthStore;