export interface Wallet {
  id: string;
  address: string;
  reputationScore: number;
  role: string;
  tags: string[];
  lastAnalyzed: string;
} 