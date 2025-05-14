import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Chip,
  IconButton,
  CircularProgress,
  Stack,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useChains } from '@/contexts/ChainsContext';
import { formatDate } from '@/utils/format';
import ChainFormModal from './ChainFormModal';

interface ChainDetailsModalProps {
  open: boolean;
  onClose: () => void;
}

const ChainDetailsModal: React.FC<ChainDetailsModalProps> = ({
  open,
  onClose,
}) => {
  const { selectedChain, deleteChain, isLoading } = useChains();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditModalOpen(false);
  };

  const handleDelete = async () => {
    if (!selectedChain) return;

    if (window.confirm('Are you sure you want to delete this chain?')) {
      try {
        setIsDeleting(true);
        await deleteChain(selectedChain.id);
        onClose();
      } catch (error) {
        console.error('Failed to delete chain:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (!selectedChain) {
    return null;
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6">Chain Details</Typography>
            <Box>
              <IconButton
                onClick={handleEdit}
                disabled={isLoading}
                title="Edit Chain"
              >
                <EditIcon />
              </IconButton>
              <IconButton
                onClick={handleDelete}
                disabled={isLoading || isDeleting}
                color="error"
                title="Delete Chain"
              >
                {isDeleting ? <CircularProgress size={24} /> : <DeleteIcon />}
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Name
              </Typography>
              <Typography variant="body1">{selectedChain.name}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Chain ID
              </Typography>
              <Chip label={selectedChain.chainId} size="small" />
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                RPC URL
              </Typography>
              <Box
                component="a"
                href={selectedChain.rpcUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: 'primary.main', textDecoration: 'none' }}
              >
                {selectedChain.rpcUrl}
              </Box>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Explorer URL
              </Typography>
              <Box
                component="a"
                href={selectedChain.explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: 'primary.main', textDecoration: 'none' }}
              >
                {selectedChain.explorerUrl}
              </Box>
            </Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
              <Box flex={1}>
                <Typography variant="subtitle2" color="text.secondary">
                  Created At
                </Typography>
                <Typography variant="body1">
                  {formatDate(selectedChain.createdAt)}
                </Typography>
              </Box>
              <Box flex={1}>
                <Typography variant="subtitle2" color="text.secondary">
                  Updated At
                </Typography>
                <Typography variant="body1">
                  {formatDate(selectedChain.updatedAt)}
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <ChainFormModal
        open={isEditModalOpen}
        onClose={handleCloseEdit}
        chainId={selectedChain.id}
      />
    </>
  );
};

export default ChainDetailsModal; 