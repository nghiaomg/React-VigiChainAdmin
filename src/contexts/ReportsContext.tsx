import React, { createContext, useContext, useEffect, type ReactNode, useState, useCallback } from 'react';
import useReportsStore from '@/stores/reportsStore';
import type { Report, VerificationData, ReportStats } from '@/stores/reportsStore';

interface ReportsContextType {
  // State
  reports: Report[];
  selectedReport: Report | null;
  stats: ReportStats | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  filters: {
    status: "pending" | "approved" | "rejected" | "";
    tagId?: string;
  };
  
  // Actions
  fetchReports: (page: number, limit: number) => Promise<void>;
  getReportById: (id: string) => Promise<void>;
  createReport: (data: {
    walletAddress: string;
    reporterAddress: string;
    txId: string;
    description: string;
    evidence: string[];
    suggestedTags: string[];
    tags?: string[];
    stakeAmount: number;
  }) => Promise<void>;
  getReportsByWalletAddress: (address: string) => Promise<void>;
  getReportsByReporterAddress: (address: string) => Promise<void>;
  getReportsByTag: (tagId: string) => Promise<void>;
  addTagToReport: (reportId: string, tagId: string) => Promise<void>;
  removeTagFromReport: (reportId: string, tagId: string) => Promise<void>;
  updateReportTags: (reportId: string, tags: string[]) => Promise<void>;
  verifyReport: (id: string, data: VerificationData) => Promise<void>;
  getReportStats: () => Promise<void>;
  deleteReport: (id: string) => Promise<void>;
  setFilters: React.Dispatch<React.SetStateAction<{ status: "pending" | "approved" | "rejected" | "", tagId?: string }>>;
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

export const useReports = () => {
  const context = useContext(ReportsContext);
  if (context === undefined) {
    throw new Error('useReports must be used within a ReportsProvider');
  }
  return context;
};

interface ReportsProviderProps {
  children: ReactNode;
}

export const ReportsProvider: React.FC<ReportsProviderProps> = ({ children }) => {
  // Get all state and actions from the store
  const {
    reports,
    selectedReport,
    stats,
    isLoading,
    error,
    pagination,
    fetchReports,
    getReportById,
    createReport,
    getReportsByWalletAddress,
    getReportsByReporterAddress,
    getReportsByTag,
    addTagToReport,
    removeTagFromReport,
    updateReportTags,
    verifyReport,
    getReportStats,
    deleteReport,
  } = useReportsStore();

  const [filters, setFilters] = useState<{ status: "pending" | "approved" | "rejected" | "", tagId?: string }>({
    status: "",
  });

  useEffect(() => {
    console.log('fetching reports');
    fetchReports(1, 10).catch((err: unknown) => {
      console.error('Failed to fetch reports:', err);
    });
  }, [fetchReports]);

  // Ensure we have pagination data with safe defaults
  const paginationWithPages = {
    total: pagination?.total || 0,
    page: pagination?.page || 1,
    limit: pagination?.limit || 10,
    pages: pagination?.total ? Math.ceil(pagination.total / (pagination?.limit || 10)) : 0
  };

  const value: ReportsContextType = {
    reports,
    selectedReport,
    stats,
    isLoading,
    error,
    pagination: paginationWithPages,
    filters,
    fetchReports,
    getReportById,
    createReport,
    getReportsByWalletAddress,
    getReportsByReporterAddress,
    getReportsByTag,
    addTagToReport,
    removeTagFromReport,
    updateReportTags,
    verifyReport,
    getReportStats,
    deleteReport,
    setFilters,
  };

  return (
    <ReportsContext.Provider value={value}>
      {children}
    </ReportsContext.Provider>
  );
}; 