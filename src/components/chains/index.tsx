import React, { useState } from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useChains } from '@/contexts/ChainsContext';
import ChainTable from './ChainTable';
import ChainFormModal from './ChainFormModal';
import ChainDetailsModal from './ChainDetailsModal';
import ChainFilters from './ChainFilters';

const Chains: React.FC = () => {
  const { isLoading, error } = useChains();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const handleOpenFormModal = () => {
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
  };

  const handleOpenDetailsModal = () => {
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
  };

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1">
            Chains
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenFormModal}
          >
            Add Chain
          </Button>
        </Box>

        <ChainFilters />

        <ChainTable
          onOpenDetails={handleOpenDetailsModal}
          isLoading={isLoading}
        />

        <ChainFormModal
          open={isFormModalOpen}
          onClose={handleCloseFormModal}
        />

        <ChainDetailsModal
          open={isDetailsModalOpen}
          onClose={handleCloseDetailsModal}
        />
      </Box>
    </Container>
  );
};

export default Chains; 