import { useEffect, useState } from "react";
import { Box, Typography, Card, Button, Divider } from "@mui/material";
import { FilterList, Add } from "@mui/icons-material";
import { useAuthStore } from "@/stores";
import { useTags } from "@/contexts/TagsContext";
import TagFilters from "@/components/tags/TagFilters";
import TagTable from "@/components/tags/TagTable";
import TagActionMenu from "@/components/tags/TagActionMenu";
import TagDetailsModal from "@/components/tags/TagDetailsModal";
import TagFormModal from "@/components/tags/TagFormModal";
import type { Tag } from "@/types/tag";

const TagsPage = () => {
  const { wallet: adminWallet } = useAuthStore();
  const {
    fetchTags,
    getTagById,
    deleteTag,
    pagination,
    selectedTag,
    filters,
    setActionMenuAnchor: setContextActionMenuAnchor,
    setSelectedTagId: setContextSelectedTagId,
  } = useTags();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [tagToEdit, setTagToEdit] = useState<Tag | null>(null);

  useEffect(() => {
    setContextActionMenuAnchor(actionMenuAnchor);
  }, [actionMenuAnchor, setContextActionMenuAnchor]);

  useEffect(() => {
    setContextSelectedTagId(selectedTagId);
  }, [selectedTagId, setContextSelectedTagId]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const handleCloseActionMenu = () => {
    setActionMenuAnchor(null);
    setSelectedTagId(null);
  };

  const handleViewDetails = async (id: string) => {
    try {
      await getTagById(id);
      setDetailsModalOpen(true);
      handleCloseActionMenu();
    } catch (error) {
      console.error("Failed to get tag details:", error);
    }
  };

  const handleEditTag = async (id: string) => {
    try {
      await getTagById(id);
      setTagToEdit(selectedTag);
      setFormModalOpen(true);
      handleCloseActionMenu();
    } catch (error) {
      console.error("Failed to get tag details for edit:", error);
    }
  };

  const handleEditFromDetails = () => {
    if (selectedTag) {
      setTagToEdit(selectedTag);
      setFormModalOpen(true);
    }
  };

  const handleAddTag = () => {
    setTagToEdit(null);
    setFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setFormModalOpen(false);
    setTagToEdit(null);
    
    fetchTags(page + 1, rowsPerPage);
  };

  const handleDeleteTag = async (id: string) => {
    try {
      await deleteTag(id);
      handleCloseActionMenu();
    } catch (error) {
      console.error("Failed to delete tag:", error);
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
        Tag Management
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
            Registered Tags
          </Typography>

          <TagFilters onAddTag={handleAddTag} />
        </Box>

        <Divider />

        <TagTable
          page={page}
          rowsPerPage={rowsPerPage}
          totalCount={pagination?.total || 0}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          onEdit={handleEditTag}
        />
      </Card>

      <TagActionMenu
        anchorEl={actionMenuAnchor}
        onClose={handleCloseActionMenu}
        onViewDetails={() => selectedTagId && handleViewDetails(selectedTagId)}
        onEdit={() => selectedTagId && handleEditTag(selectedTagId)}
        onDelete={() => selectedTagId && handleDeleteTag(selectedTagId)}
      />

      <TagDetailsModal
        tag={selectedTag}
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        onEdit={isAdmin ? handleEditFromDetails : undefined}
      />

      <TagFormModal
        open={formModalOpen}
        onClose={handleCloseFormModal}
        editTag={tagToEdit}
      />
    </Box>
  );
};

export default TagsPage;
