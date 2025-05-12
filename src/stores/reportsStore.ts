import { create } from "zustand";
import api from "@/utils/axios";

export interface Report {
  id: string;
  walletAddress: string;
  reporterAddress: string;
  txId: string;
  description: string;
  evidence: string[];
  suggestedTags: string[];
  tags: string[];
  stakeAmount: number;
  status: "pending" | "approved" | "rejected";
  verificationResult?: {
    verifiedBy: string;
    verifiedAt: string;
    reason: string;
    assignedTags: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface VerificationData {
  action: "approve" | "reject";
  verifiedBy: string;
  reason: string;
  assignedTags?: string[];
}

export interface ReportStats {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}

export interface PaginationData {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface CreateReportData {
  walletAddress: string;
  reporterAddress: string;
  txId: string;
  description: string;
  evidence: string[];
  suggestedTags: string[];
  tags?: string[];
  stakeAmount: number;
}

interface ReportsState {
  reports: Report[];
  selectedReport: Report | null;
  stats: ReportStats | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
  filters: {
    status: "pending" | "approved" | "rejected" | "";
    tagId?: string;
  };

  // Actions
  fetchReports: (page: number, limit: number) => Promise<void>;
  getReportById: (id: string) => Promise<void>;
  createReport: (data: CreateReportData) => Promise<void>;
  getReportsByWalletAddress: (address: string) => Promise<void>;
  getReportsByReporterAddress: (address: string) => Promise<void>;
  getReportsByTag: (tagId: string) => Promise<void>;
  addTagToReport: (reportId: string, tagId: string) => Promise<void>;
  removeTagFromReport: (reportId: string, tagId: string) => Promise<void>;
  updateReportTags: (reportId: string, tags: string[]) => Promise<void>;
  verifyReport: (id: string, data: VerificationData) => Promise<void>;
  getReportStats: () => Promise<void>;
  deleteReport: (id: string) => Promise<void>;
  setReports: (reports: Report[]) => void;
  setSelectedReport: (report: Report | null) => void;
  setStats: (stats: ReportStats | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setPagination: (pagination: {
    total: number;
    page: number;
    limit: number;
  }) => void;
  setFilters: (filters: { status: "pending" | "approved" | "rejected" | "", tagId?: string }) => void;
}

const useReportsStore = create<ReportsState>((set, get) => ({
  reports: [],
  selectedReport: null,
  stats: null,
  isLoading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
  },
  filters: {
    status: "",
  },

  setReports: (reports) => set({ reports }),
  setSelectedReport: (report) => set({ selectedReport: report }),
  setStats: (stats) => set({ stats }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setPagination: (pagination) => set({ pagination }),
  setFilters: (filters) => set({ filters }),

  fetchReports: async (page: number, limit: number) => {
    try {
      set({ isLoading: true, error: null });

      // Build params object
      const params: Record<string, any> = { page, limit };

      if (get().filters.status) {
        params.status = get().filters.status;
      }

      if (get().filters.tagId) {
        params.tagId = get().filters.tagId;
      }

      const response = await api.get("/v1/reports", { params });

      if (response.data?.data) {
        set({
          reports: response.data.data.data || [],
          pagination: {
            total: response.data.data.pagination?.total || 0,
            page: response.data.data.pagination?.page || page,
            limit: response.data.data.pagination?.limit || limit,
          },
        });
      } else {
        set({
          reports: [],
          pagination: { total: 0, page, limit },
        });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch reports",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  getReportById: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get(`/v1/reports/${id}`);
      set({
        selectedReport: response.data.data,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to get report details",
      });
      throw error;
    }
  },

  createReport: async (data: CreateReportData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.post("/v1/reports", data);
      set({ isLoading: false });
      return response.data.data;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to create report",
      });
      throw error;
    }
  },

  getReportsByWalletAddress: async (address: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get(`/v1/reports/wallet/${address}`);
      set({
        reports: response.data.data || [],
        isLoading: false,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to get wallet reports",
      });
      throw error;
    }
  },

  getReportsByReporterAddress: async (address: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get(`/v1/reports/reporter/${address}`);
      set({
        reports: response.data.data || [],
        isLoading: false,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to get reporter's reports",
      });
      throw error;
    }
  },

  getReportsByTag: async (tagId: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get(`/v1/reports/tag/${tagId}`);
      set({
        reports: response.data.data || [],
        isLoading: false,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to get reports by tag",
      });
      throw error;
    }
  },

  addTagToReport: async (reportId: string, tagId: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.post(`/v1/reports/${reportId}/tag`, { tagId });
      
      // Update the reports array if this report is in it
      const reports = get().reports.map(report => 
        report.id === reportId ? response.data.data : report
      );
      
      // Update selected report if it's the one being modified
      if (get().selectedReport?.id === reportId) {
        set({ selectedReport: response.data.data });
      }
      
      set({
        reports,
        isLoading: false,
      });
      
      return response.data.data;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to add tag to report",
      });
      throw error;
    }
  },

  removeTagFromReport: async (reportId: string, tagId: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.delete(`/v1/reports/${reportId}/tag/${tagId}`);
      
      // Update the reports array if this report is in it
      const reports = get().reports.map(report => 
        report.id === reportId ? response.data.data : report
      );
      
      // Update selected report if it's the one being modified
      if (get().selectedReport?.id === reportId) {
        set({ selectedReport: response.data.data });
      }
      
      set({
        reports,
        isLoading: false,
      });
      
      return response.data.data;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to remove tag from report",
      });
      throw error;
    }
  },

  updateReportTags: async (reportId: string, tags: string[]) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.put(`/v1/reports/${reportId}/tags`, { tags });
      
      // Update the reports array if this report is in it
      const reports = get().reports.map(report => 
        report.id === reportId ? response.data.data : report
      );
      
      // Update selected report if it's the one being modified
      if (get().selectedReport?.id === reportId) {
        set({ selectedReport: response.data.data });
      }
      
      set({
        reports,
        isLoading: false,
      });
      
      return response.data.data;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to update report tags",
      });
      throw error;
    }
  },

  verifyReport: async (id: string, data: VerificationData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.post(`/v1/reports/${id}/verify`, data);
      const updatedReport = response.data.data;
      
      // Update the reports array if this report is in it
      const reports = get().reports.map(report => 
        report.id === updatedReport.id ? updatedReport : report
      );
      
      set({
        reports,
        selectedReport: updatedReport,
        isLoading: false,
      });
      
      return updatedReport;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to verify report",
      });
      throw error;
    }
  },

  getReportStats: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get("/v1/reports/stats");
      set({
        stats: response.data.data,
        isLoading: false,
      });
      return response.data.data;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to get report statistics",
      });
      throw error;
    }
  },

  deleteReport: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      await api.delete(`/v1/reports/${id}`);
      
      // Remove the deleted report from the list if it exists
      const reports = get().reports.filter(report => report.id !== id);
      set({ 
        reports,
        isLoading: false 
      });
      
      // If the deleted report was selected, clear the selection
      if (get().selectedReport?.id === id) {
        set({ selectedReport: null });
      }
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to delete report",
      });
      throw error;
    }
  },
}));

export default useReportsStore;