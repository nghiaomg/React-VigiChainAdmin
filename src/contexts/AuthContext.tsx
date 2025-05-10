import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  checkIfWalletIsConnected,
  connectWallet,
  listenToAccountChanges,
  listenToChainChanges,
  getChainId,
} from '../utils/metamask';
import { useAuthStore } from '@/store';
import { ethers } from 'ethers';

interface AuthContextType {
  isAuthenticated: boolean;
  account: string | null;
  chainId: string | null;
  isLoading: boolean;
  error: string | null;
  login: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [localLoading, setLocalLoading] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);

  // Get state and actions from auth store
  const { 
    isAuthenticated,
    isLoading: storeLoading,
    error: storeError,
    login: apiLogin,
    fetchUserProfile,
    logout: apiLogout
  } = useAuthStore();

  const isLoading = localLoading || storeLoading;
  const error = localError || storeError;

  const handleAccountsChanged = async (accounts: string[]) => {
    if (accounts.length === 0) {
      setAccount(null);
      apiLogout();
      navigate('/login');
    } else {
      setAccount(accounts[0]);
      try {
        await fetchUserProfile();
      } catch (err) {
        navigate('/login');
      }
    }
  };

  const handleChainChanged = async (newChainId: string) => {
    setChainId(newChainId);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const walletAccount = await checkIfWalletIsConnected();
        const currentChainId = await getChainId();

        if (walletAccount) {
          setAccount(walletAccount);
          await fetchUserProfile();
        }

        if (currentChainId) {
          setChainId(currentChainId);
        }

        listenToAccountChanges(handleAccountsChanged);
        listenToChainChanges(handleChainChanged);

      } catch (err: any) {
        setLocalError(err.message || 'Failed to initialize authentication');
      } finally {
        setLocalLoading(false);
      }
    };

    initializeAuth();

    return () => {
      const { ethereum } = window as any;
      if (ethereum) {
        ethereum.removeListener('accountsChanged', handleAccountsChanged);
        ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [navigate]);

  const login = async () => {
    try {
      setLocalLoading(true);
      setLocalError(null);

      // Connect MetaMask
      const walletAccount = await connectWallet();
      if (walletAccount) {
        setAccount(walletAccount);
        
        // Get provider and signer for authentication
        const { ethereum } = window as any;
        if (!ethereum) throw new Error('MetaMask is not installed');
        
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        
        // Perform signature-based login
        await apiLogin(signer);
        
        if (isAuthenticated) {
          navigate('/dashboard');
        }
      }
    } catch (err: any) {
      setLocalError(err.message || 'Failed to connect wallet');
      throw err;
    } finally {
      setLocalLoading(false);
    }
  };

  const logout = () => {
    setAccount(null);
    apiLogout();
    navigate('/login');
  };

  const value = {
    isAuthenticated,
    account,
    chainId,
    isLoading,
    error,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 