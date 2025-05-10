import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Visibility,
  Delete,
  Edit,
  ToggleOn,
  ToggleOff,
} from "@mui/icons-material";
import type { Category } from "@/types/category";

interface CategoryActionMenuProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onViewDetails: () => void;
  onEdit: () => void;
  onToggleStatus: () => void;
  onDelete: () => void;
  selectedCategory: Category | null;
}

const CategoryActionMenu = ({
  anchorEl,
  onClose,
  onViewDetails,
  onEdit,
  onToggleStatus,
  onDelete,
  selectedCategory,
}: CategoryActionMenuProps) => {
  const isActive = selectedCategory?.isActive;

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      onClick={onClose}
    >
      <MenuItem onClick={onViewDetails}>
        <ListItemIcon>
          <Visibility fontSize="small" />
        </ListItemIcon>
        <ListItemText>View Details</ListItemText>
      </MenuItem>
      <MenuItem onClick={onEdit}>
        <ListItemIcon>
          <Edit fontSize="small" />
        </ListItemIcon>
        <ListItemText>Edit</ListItemText>
      </MenuItem>
      <MenuItem onClick={onToggleStatus}>
        <ListItemIcon>
          {isActive ? (
            <ToggleOff fontSize="small" />
          ) : (
            <ToggleOn fontSize="small" />
          )}
        </ListItemIcon>
        <ListItemText>
          {isActive ? "Deactivate" : "Activate"}
        </ListItemText>
      </MenuItem>
      <Divider />
      <MenuItem onClick={onDelete} sx={{ color: 'error.main' }}>
        <ListItemIcon>
          <Delete fontSize="small" color="error" />
        </ListItemIcon>
        <ListItemText>Delete</ListItemText>
      </MenuItem>
    </Menu>
  );
};

export default CategoryActionMenu; 