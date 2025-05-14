import React from 'react';
import {
  Box,
  TextField,
  Button,
  Stack,
} from '@mui/material';
import { useChains } from '@/contexts/ChainsContext';

const ChainFilters: React.FC = () => {
  const { filters, setFilters } = useChains();

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, name: event.target.value });
  };

  const handleChainIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFilters({
      ...filters,
      chainId: value ? parseInt(value, 10) : undefined,
    });
  };

  const handleReset = () => {
    setFilters({});
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        spacing={2} 
        alignItems={{ xs: 'stretch', sm: 'center' }}
      >
        <Box width={{ xs: '100%', sm: '33%' }}>
          <TextField
            fullWidth
            label="Chain Name"
            value={filters.name || ''}
            onChange={handleNameChange}
            size="small"
          />
        </Box>
        <Box width={{ xs: '100%', sm: '33%' }}>
          <TextField
            fullWidth
            label="Chain ID"
            type="number"
            value={filters.chainId || ''}
            onChange={handleChainIdChange}
            size="small"
          />
        </Box>
        <Box width={{ xs: '100%', sm: '33%' }}>
          <Button
            variant="outlined"
            onClick={handleReset}
            sx={{ height: '40px', width: { xs: '100%', sm: 'auto' } }}
          >
            Reset Filters
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default ChainFilters; 