import React, { createContext, useContext, useEffect, type ReactNode, useState, useCallback } from 'react';
import useTagsStore from '@/stores/tagsStore';
import type { Tag } from '@/types/tag';

interface TagsContextType {
  // State
  tags: Tag[];
  selectedTag: Tag | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  category: 'positive' | 'negative' | 'neutral' | 'all';
  filters: {
    category: string;
    search: string;
  };
  actionMenuAnchor: HTMLElement | null;
  selectedTagId: string | null;
  
  // Actions
  fetchTags: (page: number, limit: number) => Promise<void>;
  getTagById: (id: string) => Promise<void>;
  getTagByName: (name: string) => Promise<void>;
  createTag: (data: Omit<Tag, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTag: (id: string, data: Partial<Omit<Tag, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  deleteTag: (id: string) => Promise<void>;
  getTagsByCategory: (category: 'positive' | 'negative' | 'neutral') => Promise<void>;
  getMultipleTags: (tagIds: string[]) => Promise<void>;
  setCategory: (category: 'positive' | 'negative' | 'neutral' | 'all') => void;
  setFilters: React.Dispatch<React.SetStateAction<{ category: string; search: string }>>;
  setActionMenuAnchor: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  setSelectedTagId: React.Dispatch<React.SetStateAction<string | null>>;
}

const TagsContext = createContext<TagsContextType | undefined>(undefined);

export const useTags = () => {
  const context = useContext(TagsContext);
  if (context === undefined) {
    throw new Error('useTags must be used within a TagsProvider');
  }
  return context;
};

interface TagsProviderProps {
  children: ReactNode;
}

export const TagsProvider: React.FC<TagsProviderProps> = ({ children }) => {
  // Get all state and actions from the store
  const {
    tags,
    selectedTag,
    isLoading,
    error,
    pagination,
    category,
    fetchTags,
    getTagById,
    getTagByName,
    createTag,
    updateTag,
    deleteTag,
    getTagsByCategory,
    getMultipleTags,
    setCategory,
  } = useTagsStore();

  const [filters, setFilters] = useState({
    category: "",
    search: "",
  });
  const [actionMenuAnchor, setActionMenuAnchor] = useState<HTMLElement | null>(null);
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);

  // Fetch tags on initial load
  useEffect(() => {
    fetchTags(1, 10).catch((err: unknown) => {
      console.error('Failed to fetch tags:', err);
    });
  }, [fetchTags]);

  const paginationWithPages = {
    ...pagination,
    pages: Math.ceil(pagination.total / pagination.limit) || 1
  };

  const value: TagsContextType = {
    tags,
    selectedTag,
    isLoading,
    error,
    pagination: paginationWithPages,
    category,
    fetchTags,
    getTagById,
    getTagByName,
    createTag,
    updateTag,
    deleteTag,
    getTagsByCategory,
    getMultipleTags,
    setCategory,
    filters,
    actionMenuAnchor,
    selectedTagId,
    setFilters,
    setActionMenuAnchor,
    setSelectedTagId,
  };

  return (
    <TagsContext.Provider value={value}>
      {children}
    </TagsContext.Provider>
  );
}; 