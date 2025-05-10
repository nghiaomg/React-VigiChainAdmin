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
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import type { Tag } from "@/types/tag";

interface TagDetailsModalProps {
  tag: Tag | null;
  open: boolean;
  onClose: () => void;
  onEdit?: () => void;
}

const TagDetailsModal = ({ tag, open, onClose, onEdit }: TagDetailsModalProps) => {
  if (!tag) return null;

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
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" component="div">
            Tag Details
          </Typography>
          {onEdit && (
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
              <Typography variant="body1">{tag.name}</Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Description
              </Typography>
              <Typography variant="body1">{tag.description}</Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Category
              </Typography>
              <Chip
                label={tag.category.name}
                color={getCategoryColor(tag.category.type) as any}
                size="small"
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Status
              </Typography>
              <Chip
                label={tag.isActive ? "Active" : "Inactive"}
                color={tag.isActive ? "success" : "default"}
                size="small"
                variant="outlined"
              />
            </Box>

            <Divider />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
              <Box flex={1}>
                <Typography variant="subtitle2" color="text.secondary">
                  Created At
                </Typography>
                <Typography variant="body2">
                  {formatDate(tag.createdAt)}
                </Typography>
              </Box>

              <Box flex={1}>
                <Typography variant="subtitle2" color="text.secondary">
                  Updated At
                </Typography>
                <Typography variant="body2">
                  {formatDate(tag.updatedAt)}
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

export default TagDetailsModal; 