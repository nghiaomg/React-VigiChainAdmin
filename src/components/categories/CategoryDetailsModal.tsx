import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
  Stack,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import type { Category } from "@/types/category";
import { useCategories } from "@/contexts/CategoriesContext";
import { useAuthStore } from "@/stores";

interface CategoryDetailsModalProps {
  category: Category | null;
  open: boolean;
  onClose: () => void;
  onEdit?: () => void;
}

const CategoryDetailsModal = ({ 
  category, 
  open, 
  onClose, 
  onEdit 
}: CategoryDetailsModalProps) => {
  const { updateCategoryStatus } = useCategories();
  const { wallet: adminWallet } = useAuthStore();
  const isAdmin = adminWallet?.role === "admin";
  
  if (!category) return null;

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
    return date.toLocaleDateString('en-US', {
      month: 'short', 
      day: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleToggleStatus = async () => {
    try {
      await updateCategoryStatus(category.id, !category.isActive);
    } catch (error) {
      console.error("Failed to update category status:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" component="div">
            Category Details
          </Typography>
          {onEdit && isAdmin && (
            <Button 
              startIcon={<Edit />} 
              variant="outlined" 
              size="small"
              onClick={() => {
                onEdit();
                onClose();
              }}
            >
              Edit
            </Button>
          )}
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Name
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {category.name}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Description
              </Typography>
              <Typography variant="body1">
                {category.description}
              </Typography>
            </Box>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
              <Box flex={1}>
                <Typography variant="subtitle2" color="text.secondary">
                  Type
                </Typography>
                <Chip
                  label={category.type}
                  color={getTypeColor(category.type) as any}
                  size="small"
                  sx={{ mt: 0.5 }}
                />
              </Box>

              <Box flex={1}>
                <Typography variant="subtitle2" color="text.secondary">
                  Status
                </Typography>
                {isAdmin ? (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={category.isActive}
                        onChange={handleToggleStatus}
                        color="success"
                      />
                    }
                    label={category.isActive ? "Active" : "Inactive"}
                  />
                ) : (
                  <Chip
                    label={category.isActive ? "Active" : "Inactive"}
                    color={category.isActive ? "success" : "default"}
                    size="small"
                    variant="outlined"
                    sx={{ mt: 0.5 }}
                  />
                )}
              </Box>
            </Stack>

            <Divider />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
              <Box flex={1}>
                <Typography variant="subtitle2" color="text.secondary">
                  Created At
                </Typography>
                <Typography variant="body2">
                  {formatDate(category.createdAt)}
                </Typography>
              </Box>

              <Box flex={1}>
                <Typography variant="subtitle2" color="text.secondary">
                  Updated At
                </Typography>
                <Typography variant="body2">
                  {formatDate(category.updatedAt)}
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryDetailsModal; 