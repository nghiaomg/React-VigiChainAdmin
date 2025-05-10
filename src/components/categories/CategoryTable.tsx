import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Box,
  Typography,
  Alert,
  Switch,
  Tooltip,
} from "@mui/material";
import { MoreVert, Delete } from "@mui/icons-material";
import { useCategories } from "@/contexts/CategoriesContext";
import { useAuthStore } from "@/stores";

interface CategoryTableProps {
  page: number;
  rowsPerPage: number;
  totalCount: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CategoryTable = ({
  page,
  rowsPerPage,
  totalCount,
  onPageChange,
  onRowsPerPageChange,
}: CategoryTableProps) => {
  const { wallet: adminWallet } = useAuthStore();
  const {
    categories,
    isLoading,
    error,
    updateCategoryStatus,
    setActionMenuAnchor,
    setSelectedCategoryId,
    deleteCategory,
  } = useCategories();

  const isAdmin = adminWallet?.role === "admin";

  const handleOpenActionMenu = (
    event: React.MouseEvent<HTMLElement>,
    id: string
  ) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedCategoryId(id);
  };

  const handleToggleStatus = async (
    id: string,
    currentStatus: boolean,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.stopPropagation();
    try {
      await updateCategoryStatus(id, !currentStatus);
    } catch (error) {
      console.error("Failed to update category status:", error);
    }
  };

  const handleDelete = async (
    id: string,
    event: React.MouseEvent<HTMLElement>
  ) => {
    event.stopPropagation();
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(id);
      } catch (error) {
        console.error("Failed to delete category:", error);
      }
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "positive":
        return "success";
      case "negative":
        return "error";
      case "neutral":
        return "warning";
      default:
        return "default";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Updated At</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography>Loading...</Typography>
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography>No categories found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {category.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        maxWidth: 200,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {category.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={category.type}
                      color={getTypeColor(category.type) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {isAdmin ? (
                      <Switch
                        size="small"
                        checked={category.isActive}
                        onChange={(e) =>
                          handleToggleStatus(category.id, category.isActive, e)
                        }
                        color="success"
                      />
                    ) : (
                      <Chip
                        label={category.isActive ? "Active" : "Inactive"}
                        color={category.isActive ? "success" : "default"}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(category.createdAt)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(category.updatedAt)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      {isAdmin && (
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={(e) => handleDelete(category.id, e)}
                            sx={{ mr: 1 }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      <IconButton
                        size="small"
                        onClick={(e) => handleOpenActionMenu(e, category.id)}
                      >
                        <MoreVert />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </Box>
  );
};

export default CategoryTable;
