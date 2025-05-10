import { create } from "zustand";
import api from "@/utils/axios";
import type { Tag } from "@/types/tag";

export interface PaginationData {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface TagsState {
  tags: Tag[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
  filters: {
    category: string;
    search: string;
  };
  selectedTag: Tag | null;
  actionMenuAnchor: HTMLElement | null;
  selectedTagId: string | null;
  category: "positive" | "negative" | "neutral" | "all";

  // Actions
  fetchTags: (page: number, limit: number) => Promise<void>;
  getTagById: (id: string) => Promise<void>;
  getTagByName: (name: string) => Promise<void>;
  createTag: (
    data: Omit<Tag, "id" | "createdAt" | "updatedAt" | "category">
  ) => Promise<void>;
  updateTag: (
    id: string,
    data: Partial<Omit<Tag, "id" | "createdAt" | "updatedAt" | "category">>
  ) => Promise<void>;
  deleteTag: (id: string) => Promise<void>;
  getTagsByCategory: (
    category: "positive" | "negative" | "neutral"
  ) => Promise<void>;
  getMultipleTags: (tagIds: string[]) => Promise<void>;
  setCategory: (category: "positive" | "negative" | "neutral" | "all") => void;
  setTags: (tags: Tag[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setPagination: (pagination: {
    total: number;
    page: number;
    limit: number;
  }) => void;
  setFilters: (filters: { category: string; search: string }) => void;
  setSelectedTag: (tag: Tag | null) => void;
  setActionMenuAnchor: (anchor: HTMLElement | null) => void;
  setSelectedTagId: (id: string | null) => void;
}

const useTagsStore = create<TagsState>((set, get) => ({
  tags: [],
  isLoading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
  },
  filters: {
    category: "",
    search: "",
  },
  selectedTag: null,
  actionMenuAnchor: null,
  selectedTagId: null,
  category: "all",

  setTags: (tags) => set({ tags }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setPagination: (pagination) => set({ pagination }),
  setFilters: (filters) => set({ filters }),
  setSelectedTag: (tag) => set({ selectedTag: tag }),
  setActionMenuAnchor: (anchor) => set({ actionMenuAnchor: anchor }),
  setSelectedTagId: (id) => set({ selectedTagId: id }),

  fetchTags: async (page: number, limit: number) => {
    try {
      set({ isLoading: true, error: null });

      // Build params object
      const params: Record<string, any> = { page, limit };

      if (get().category !== "all") {
        params.category = get().category;
      }

      if (get().filters.search) {
        params.search = get().filters.search;
      }

      const response = await api.get("/v1/tags", { params });

      if (response.data?.data) {
        set({
          tags: response.data.data.data || [],
          pagination: {
            total: response.data.data.pagination?.total || 0,
            page: response.data.data.pagination?.page || page,
            limit: response.data.data.pagination?.limit || limit,
          },
        });
      } else {
        set({
          tags: [],
          pagination: { total: 0, page, limit },
        });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch tags",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  getTagById: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get(`/v1/tags/${id}`);
      set({
        selectedTag: response.data.data,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to get tag details",
      });
      throw error;
    }
  },

  getTagByName: async (name: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get("/v1/tags/name", {
        params: { name },
      });
      set({
        selectedTag: response.data.data,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to get tag",
      });
      throw error;
    }
  },

  createTag: async (
    data: Omit<Tag, "id" | "createdAt" | "updatedAt" | "category">
  ) => {
    try {
      set({ isLoading: true, error: null });
      await api.post("/v1/tags", data);
      await get().fetchTags(1, get().pagination.limit);
      set({ isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to create tag",
      });
      throw error;
    }
  },

  updateTag: async (
    id: string,
    data: Partial<Omit<Tag, "id" | "createdAt" | "updatedAt" | "category">>
  ) => {
    try {
      set({ isLoading: true, error: null });
      await api.put(`/v1/tags/${id}`, data);
      await get().fetchTags(1, get().pagination.limit);
      set({ isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to update tag",
      });
      throw error;
    }
  },

  deleteTag: async (id: string) => {
    try {
      // set({ isLoading: true, error: null });

      await api.delete(`/v1/tags/${id}`);

      await get().fetchTags(get().pagination.page, get().pagination.limit);
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to delete tag",
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  getTagsByCategory: async (category: "positive" | "negative" | "neutral") => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get("/v1/tags/category", {
        params: { category },
      });
      set({
        tags: response.data.data || [],
        isLoading: false,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error:
          error.response?.data?.message || "Failed to get tags by category",
      });
      throw error;
    }
  },

  getMultipleTags: async (tagIds: string[]) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.post("/v1/tags/multiple", { tagIds });
      set({
        tags: response.data.data || [],
        isLoading: false,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to get multiple tags",
      });
      throw error;
    }
  },

  setCategory: (category: "positive" | "negative" | "neutral" | "all") => {
    set({ category });
    get().fetchTags(1, get().pagination.limit);
  },
}));

export default useTagsStore;