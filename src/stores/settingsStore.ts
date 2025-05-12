import { create } from "zustand";
import api from "@/utils/axios";

export interface Setting {
  id: string;
  key: string;
  value: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationData {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface SettingsFilters {
  key?: string;
  [key: string]: any;
}

interface SettingsState {
  settings: Setting[];
  settingsMap: Record<string, string>;
  selectedSetting: Setting | null;
  isLoading: boolean;
  error: string | null;
  pagination: PaginationData;
  filters: SettingsFilters;
  sortBy: string;
  sortOrder: "asc" | "desc";

  // Actions
  fetchSettings: (page?: number, limit?: number) => Promise<void>;
  fetchSettingsAsMap: () => Promise<void>;
  getSettingByKey: (key: string) => Promise<void>;
  createSetting: (data: { key: string; value: string }) => Promise<void>;
  updateSetting: (
    id: string,
    data: { key?: string; value: string }
  ) => Promise<void>;
  updateSettingByKey: (key: string, value: string) => Promise<void>;
  deleteSetting: (id: string) => Promise<void>;
  deleteSettingByKey: (key: string) => Promise<void>;
  setFilters: (newFilters: Partial<SettingsFilters>) => void;
  resetFilters: () => void;
  setSorting: (sortBy: string, sortOrder?: "asc" | "desc") => void;
}

const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: [],
  settingsMap: {},
  selectedSetting: null,
  isLoading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  },
  filters: {},
  sortBy: "updatedAt",
  sortOrder: "desc",

  // Fetch all settings with pagination
  fetchSettings: async (page = 1, limit = 10) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get("/v1/settings", {
        params: {
          page,
          limit,
          ...get().filters,
          sortBy: get().sortBy,
          sortOrder: get().sortOrder,
        },
      });

      if (response.data?.data) {
        // Handle both paginated and non-paginated responses
        if (response.data.data.data && response.data.data.pagination) {
          // Paginated response
          const { data, pagination } = response.data.data;
          set({
            settings: data,
            pagination: {
              total: pagination.total || 0,
              page: pagination.page || page,
              limit: pagination.limit || limit,
              pages:
                pagination.pages || Math.ceil((pagination.total || 0) / limit),
            },
          });
        } else {
          // Non-paginated response
          set({
            settings: response.data.data,
            pagination: {
              total: response.data.data.length,
              page: 1,
              limit: response.data.data.length,
              pages: 1,
            },
          });
        }
      }

      set({ isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to fetch settings",
      });
      throw error;
    }
  },

  // Fetch settings as map
  fetchSettingsAsMap: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get("/v1/settings/map");

      if (response.data?.data) {
        set({ settingsMap: response.data.data });
      }

      set({ isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to fetch settings map",
      });
      throw error;
    }
  },

  // Get setting by key
  getSettingByKey: async (key: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get(`/v1/settings/${key}`);

      if (response.data?.data) {
        set({ selectedSetting: response.data.data });
      }

      set({ isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to get setting",
      });
      throw error;
    }
  },

  // Create new setting
  createSetting: async (data: { key: string; value: string }) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.post("/v1/settings", data);

      if (response.data?.data) {
        // Refresh the settings list
        await get().fetchSettings();
      }

      set({ isLoading: false });
      return response.data?.data;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to create setting",
      });
      throw error;
    }
  },

  // Update setting by ID
  updateSetting: async (id: string, data: { key?: string; value: string }) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.put(`/v1/settings/${id}`, data);

      if (response.data?.data) {
        // Refresh the settings list
        await get().fetchSettings();

        // Update selected setting if it's the one being edited
        if (get().selectedSetting?.id === id) {
          set({ selectedSetting: response.data.data });
        }
      }

      set({ isLoading: false });
      return response.data?.data;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to update setting",
      });
      throw error;
    }
  },

  // Update setting by key
  updateSettingByKey: async (key: string, value: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.put(`/v1/settings/key/${key}`, { value });

      if (response.data?.data) {
        // Refresh the settings list
        await get().fetchSettings();

        // Update selected setting if it's the one being edited
        if (get().selectedSetting?.key === key) {
          set({ selectedSetting: response.data.data });
        }
      }

      set({ isLoading: false });
      return response.data?.data;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to update setting",
      });
      throw error;
    }
  },

  // Delete setting by ID
  deleteSetting: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      await api.delete(`/v1/settings/${id}`);

      // Refresh the settings list
      await get().fetchSettings();

      // Clear selected setting if it was deleted
      if (get().selectedSetting?.id === id) {
        set({ selectedSetting: null });
      }

      set({ isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to delete setting",
      });
      throw error;
    }
  },

  // Delete setting by key
  deleteSettingByKey: async (key: string) => {
    try {
      set({ isLoading: true, error: null });
      await api.delete(`/v1/settings/key/${key}`);

      // Refresh the settings list
      await get().fetchSettings();

      // Clear selected setting if it was deleted
      if (get().selectedSetting?.key === key) {
        set({ selectedSetting: null });
      }

      set({ isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to delete setting",
      });
      throw error;
    }
  },

  // Set filters
  setFilters: (newFilters: Partial<SettingsFilters>) => {
    const currentFilters = get().filters;
    set({
      filters: {
        ...currentFilters,
        ...newFilters,
      },
    });

    get().fetchSettings(1, get().pagination.limit);
  },

  resetFilters: () => {
    set({ filters: {} });

    get().fetchSettings(1, get().pagination.limit);
  },

  setSorting: (sortBy: string, sortOrder: "asc" | "desc" = "desc") => {
    set({
      sortBy,
      sortOrder,
    });

    get().fetchSettings(get().pagination.page, get().pagination.limit);
  },
}));

export default useSettingsStore;
