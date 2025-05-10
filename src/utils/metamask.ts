import { ethers } from 'ethers';

export interface MetaMaskError {
  code: number;
  message: string;
}

export const checkIfWalletIsConnected = async (): Promise<string | null> => {
  try {
    const { ethereum } = window as any;

    if (!ethereum) {
      console.log("Make sure you have MetaMask installed!");
      return null;
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      return accounts[0];
    } else {
      console.log("No authorized account found");
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const connectWallet = async (): Promise<string | null> => {
  try {
    const { ethereum } = window as any;

    if (!ethereum) {
      alert("Please install MetaMask!");
      return null;
    }

    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });

    return accounts[0];
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const signMessage = async (address: string, nonce: string): Promise<string | null> => {
  try {
    const { ethereum } = window as any;
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    
    const signature = await signer.signMessage(
      `Please sign this message to confirm your identity. Nonce: ${nonce}`
    );
    
    return signature;
  } catch (error) {
    console.error("Error signing message:", error);
    return null;
  }
};

export const getChainId = async (): Promise<string | null> => {
  try {
    const { ethereum } = window as any;
    const chainId = await ethereum.request({ method: 'eth_chainId' });
    return chainId;
  } catch (error) {
    console.error("Error getting chain ID:", error);
    return null;
  }
};

export const listenToAccountChanges = (callback: (accounts: string[]) => void) => {
  const { ethereum } = window as any;
  if (ethereum) {
    ethereum.on('accountsChanged', callback);
  }
};

export const listenToChainChanges = (callback: (chainId: string) => void) => {
  const { ethereum } = window as any;
  if (ethereum) {
    ethereum.on('chainChanged', callback);
  }
}; 