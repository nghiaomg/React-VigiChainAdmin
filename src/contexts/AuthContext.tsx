import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  checkIfWalletIsConnected,
  connectWallet,
  listenToAccountChanges,
  listenToChainChanges,
  getChainId,
} from '../utils/metamask';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      setAccount(null);
      setIsAuthenticated(false);
      navigate('/login');
    } else {
      setAccount(accounts[0]);
      setIsAuthenticated(true);
    }
  };

  const handleChainChanged = async (newChainId: string) => {
    setChainId(newChainId);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const account = await checkIfWalletIsConnected();
        const chainId = await getChainId();

        if (account) {
          setAccount(account);
          setIsAuthenticated(true);
        }

        if (chainId) {
          setChainId(chainId);
        }

        // Setup listeners
        listenToAccountChanges(handleAccountsChanged);
        listenToChainChanges(handleChainChanged);

      } catch (err: any) {
        setError(err.message || 'Failed to initialize authentication');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Cleanup listeners on unmount
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
      setIsLoading(true);
      setError(null);

      const account = await connectWallet();
      if (account) {
        setAccount(account);
        setIsAuthenticated(true);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setAccount(null);
    setIsAuthenticated(false);
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