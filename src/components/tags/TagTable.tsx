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
  Tooltip,
} from "@mui/material";
import { MoreVert, Delete, Edit } from "@mui/icons-material";
import { useTags } from "@/contexts/TagsContext";
import { useAuthStore } from "@/stores";

interface TagTableProps {
  page: number;
  rowsPerPage: number;
  totalCount: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEdit?: (id: string) => void;
}

const TagTable = ({
  page,
  rowsPerPage,
  totalCount,
  onPageChange,
  onRowsPerPageChange,
  onEdit,
}: TagTableProps) => {
  const { wallet: adminWallet } = useAuthStore();
  const { tags, isLoading, error, setActionMenuAnchor, setSelectedTagId, deleteTag } = useTags();

  const isAdmin = adminWallet?.role === "admin";

  const handleOpenActionMenu = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedTagId(id);
  };

  const handleDelete = async (id: string, event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    if (window.confirm("Are you sure you want to delete this tag?")) {
      try {
        await deleteTag(id);
      } catch (error) {
        console.error("Failed to delete tag:", error);
      }
    }
  };

  const handleEdit = (id: string, event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    if (onEdit) {
      onEdit(id);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
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
              <TableCell>Category</TableCell>
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
            ) : tags.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography>No tags found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              tags.map((tag) => (
                <TableRow key={tag.id} hover>
                  <TableCell>
                    <Typography variant="body2">{tag.name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {tag.description}
                    </Typography>
                  </TableCell>
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
                    <Typography variant="body2">
                      {formatDate(tag.createdAt)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(tag.updatedAt)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      {isAdmin && (
                        <>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={(e) => handleEdit(tag.id, e)}
                              sx={{ mr: 1 }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={(e) => handleDelete(tag.id, e)}
                              sx={{ mr: 1 }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                      <IconButton
                        size="small"
                        onClick={(e) => handleOpenActionMenu(e, tag.id)}
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
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Box>
  );
};

export default TagTable; 