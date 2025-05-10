import { useState } from "react";
import {
  TableRow,
  TableCell,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  MoreVert,
  Visibility,
  Delete,
} from "@mui/icons-material";
import type { Tag } from "@/types/tag";

interface TagTableRowProps {
  tag: Tag;
  onViewDetails?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const TagTableRow = ({ tag, onViewDetails, onDelete }: TagTableRowProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const getCategoryColor = (type: string) => {
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

  return (
    <TableRow hover>
      <TableCell>{tag.name}</TableCell>
      <TableCell>{tag.description}</TableCell>
      <TableCell>
        <Chip
          label={tag.category.name}
          color={getCategoryColor(tag.category.type) as any}
          size="small"
        />
      </TableCell>
      <TableCell>
        <Chip
          label={tag.isActive ? "Active" : "Inactive"}
          color={tag.isActive ? "success" : "default"}
          size="small"
          variant="outlined"
        />
      </TableCell>
      <TableCell>
        {formatDate(tag.createdAt)}
      </TableCell>
      <TableCell>
        {formatDate(tag.updatedAt)}
      </TableCell>
      <TableCell align="right">
        <IconButton
          size="small"
          onClick={handleOpenMenu}
          aria-label="tag actions"
        >
          <MoreVert />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          onClick={handleCloseMenu}
        >
          <MenuItem onClick={() => onViewDetails?.(tag.id)}>
            <ListItemIcon>
              <Visibility fontSize="small" />
            </ListItemIcon>
            <ListItemText>View Details</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => onDelete?.(tag.id)}>
            <ListItemIcon>
              <Delete fontSize="small" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        </Menu>
      </TableCell>
    </TableRow>
  );
};

export default TagTableRow; 