import { useEffect, useState } from "react";
import { Box, Typography, Card, Button, Divider } from "@mui/material";
import { FilterList, Add } from "@mui/icons-material";
import { useAuthStore } from "@/stores";
import { useCategories } from "@/contexts/CategoriesContext";
import CategoryFilters from "@/components/categories/CategoryFilters";
import CategoryTable from "@/components/categories/CategoryTable";
import CategoryActionMenu from "@/components/categories/CategoryActionMenu";
import CategoryDetailsModal from "@/components/categories/CategoryDetailsModal";
import CategoryFormModal from "@/components/categories/CategoryFormModal";
import type { Category } from "@/types/category";

const CategoriesPage = () => {
  const { wallet: adminWallet } = useAuthStore();
  const {
    categories,
    fetchCategories,
    getCategoryById,
    deleteCategory,
    updateCategoryStatus,
    pagination,
    selectedCategory,
  } = useCategories();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategories(page + 1, rowsPerPage);
  }, [page, rowsPerPage, fetchCategories]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const handleCloseActionMenu = () => {
    setActionMenuAnchor(null);
    setSelectedCategoryId(null);
  };

  const handleViewDetails = async (id: string) => {
    try {
      await getCategoryById(id);
      setDetailsModalOpen(true);
      handleCloseActionMenu();
    } catch (error) {
      console.error("Failed to get category details:", error);
    }
  };

  const handleEditCategory = async (id: string) => {
    try {
      await getCategoryById(id);
      setCategoryToEdit(selectedCategory);
      setFormModalOpen(true);
      handleCloseActionMenu();
    } catch (error) {
      console.error("Failed to get category details for edit:", error);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await updateCategoryStatus(id, !currentStatus);
      handleCloseActionMenu();
    } catch (error) {
      console.error("Failed to update category status:", error);
    }
  };

  const handleEditFromDetails = () => {
    if (selectedCategory) {
      setCategoryToEdit(selectedCategory);
      setFormModalOpen(true);
    }
  };

  const handleAddCategory = () => {
    setCategoryToEdit(null);
    setFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setFormModalOpen(false);
    setCategoryToEdit(null);
    // Refresh the categories list after adding/editing
    fetchCategories(page + 1, rowsPerPage);
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory(id);
      handleCloseActionMenu();
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  const isAdmin = adminWallet?.role === "admin";

  return (
    <Box sx={{ width: "100%" }}>
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          fontWeight: 700,
          color: "text.primary",
        }}
      >
        Category Management
      </Typography>

      <Card
        elevation={0}
        sx={{
          mb: 4,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            p: 3,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
            gap: 2,
          }}
        >
          <Typography variant="h6" fontWeight="600">
            Categories
          </Typography>

          <CategoryFilters />
        </Box>

        <Divider />

        <CategoryTable
          page={page}
          rowsPerPage={rowsPerPage}
          totalCount={pagination.total}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      {isAdmin && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mb: 4 }}>
          <Button variant="outlined" startIcon={<FilterList />}>
            Export Data
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<Add />}
            onClick={handleAddCategory}
          >
            Add Category
          </Button>
        </Box>
      )}

      <CategoryActionMenu
        anchorEl={actionMenuAnchor}
        onClose={handleCloseActionMenu}
        onViewDetails={() => selectedCategoryId && handleViewDetails(selectedCategoryId)}
        onEdit={() => selectedCategoryId && handleEditCategory(selectedCategoryId)}
        onToggleStatus={() => {
          if (selectedCategoryId && selectedCategory) {
            handleToggleStatus(selectedCategoryId, selectedCategory.isActive);
          }
        }}
        onDelete={() => selectedCategoryId && handleDeleteCategory(selectedCategoryId)}
        selectedCategory={selectedCategory}
      />

      <CategoryDetailsModal
        category={selectedCategory}
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        onEdit={isAdmin ? handleEditFromDetails : undefined}
      />

      <CategoryFormModal
        open={formModalOpen}
        onClose={handleCloseFormModal}
        editCategory={categoryToEdit}
      />
    </Box>
  );
};

export default CategoriesPage; 