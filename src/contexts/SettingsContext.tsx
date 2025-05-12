import React, { createContext, useContext, useEffect, type ReactNode, useState, useCallback } from 'react';
import useSettingsStore from '@/stores/settingsStore';
import type { Setting } from '@/stores/settingsStore';

interface SettingsContextType {
  // State
  settings: Setting[];
  settingsMap: Record<string, string>;
  selectedSetting: Setting | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  filters: {
    key?: string;
    [key: string]: any;
  };
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  actionMenuAnchor: HTMLElement | null;
  selectedSettingId: string | null;
  
  // Actions
  fetchSettings: (page: number, limit: number) => Promise<void>;
  fetchSettingsAsMap: () => Promise<void>;
  getSettingByKey: (key: string) => Promise<void>;
  createSetting: (data: { key: string; value: string }) => Promise<void>;
  updateSetting: (id: string, data: { key?: string; value: string }) => Promise<void>;
  updateSettingByKey: (key: string, value: string) => Promise<void>;
  deleteSetting: (id: string) => Promise<void>;
  deleteSettingByKey: (key: string) => Promise<void>;
  setFilters: (newFilters: Partial<{ key?: string; [key: string]: any }>) => void;
  resetFilters: () => void;
  setSorting: (sortBy: string, sortOrder?: 'asc' | 'desc') => void;
  setActionMenuAnchor: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  setSelectedSettingId: React.Dispatch<React.SetStateAction<string | null>>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  // Get all state and actions from the store
  const {
    settings,
    settingsMap,
    selectedSetting,
    isLoading,
    error,
    pagination,
    filters,
    sortBy,
    sortOrder,
    fetchSettings,
    fetchSettingsAsMap,
    getSettingByKey,
    createSetting,
    updateSetting,
    updateSettingByKey,
    deleteSetting,
    deleteSettingByKey,
    setFilters,
    resetFilters,
    setSorting,
  } = useSettingsStore();

  const [actionMenuAnchor, setActionMenuAnchor] = useState<HTMLElement | null>(null);
  const [selectedSettingId, setSelectedSettingId] = useState<string | null>(null);

  // Initial fetch of settings
  useEffect(() => {
    fetchSettings(1, 10).catch((err: unknown) => {
      console.error('Failed to fetch settings:', err);
    });
  }, [fetchSettings]);

  // Ensure we have pagination data with safe defaults
  const paginationWithDefaults = {
    total: pagination?.total || 0,
    page: pagination?.page || 1,
    limit: pagination?.limit || 10,
    pages: pagination?.total ? Math.ceil(pagination.total / (pagination?.limit || 10)) : 0
  };

  const value: SettingsContextType = {
    settings,
    settingsMap,
    selectedSetting,
    isLoading,
    error,
    pagination: paginationWithDefaults,
    filters,
    sortBy,
    sortOrder,
    fetchSettings,
    fetchSettingsAsMap,
    getSettingByKey,
    createSetting,
    updateSetting,
    updateSettingByKey,
    deleteSetting,
    deleteSettingByKey,
    setFilters,
    resetFilters,
    setSorting,
    actionMenuAnchor,
    selectedSettingId,
    setActionMenuAnchor,
    setSelectedSettingId,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}; 