import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  CircularProgress,
} from '@mui/material';
import { useChains } from '@/contexts/ChainsContext';

interface ChainFormModalProps {
  open: boolean;
  onClose: () => void;
  chainId?: string;
}

const ChainFormModal: React.FC<ChainFormModalProps> = ({
  open,
  onClose,
  chainId,
}) => {
  const { createChain, updateChain, selectedChain, isLoading } = useChains();
  const [formData, setFormData] = useState({
    name: '',
    chainId: '',
    rpcUrl: '',
    explorerUrl: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  React.useEffect(() => {
    if (selectedChain && chainId) {
      setFormData({
        name: selectedChain.name,
        chainId: selectedChain.chainId.toString(),
        rpcUrl: selectedChain.rpcUrl,
        explorerUrl: selectedChain.explorerUrl,
      });
    } else {
      setFormData({
        name: '',
        chainId: '',
        rpcUrl: '',
        explorerUrl: '',
      });
    }
  }, [selectedChain, chainId]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) {
      newErrors.name = 'Name is required';
    }

    if (!formData.chainId) {
      newErrors.chainId = 'Chain ID is required';
    } else if (isNaN(Number(formData.chainId))) {
      newErrors.chainId = 'Chain ID must be a number';
    }

    if (!formData.rpcUrl) {
      newErrors.rpcUrl = 'RPC URL is required';
    } else if (!formData.rpcUrl.startsWith('http://') && !formData.rpcUrl.startsWith('https://')) {
      newErrors.rpcUrl = 'RPC URL must start with http:// or https://';
    }

    if (!formData.explorerUrl) {
      newErrors.explorerUrl = 'Explorer URL is required';
    } else if (!formData.explorerUrl.startsWith('http://') && !formData.explorerUrl.startsWith('https://')) {
      newErrors.explorerUrl = 'Explorer URL must start with http:// or https://';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const chainData = {
        name: formData.name,
        chainId: parseInt(formData.chainId, 10),
        rpcUrl: formData.rpcUrl,
        explorerUrl: formData.explorerUrl,
      };

      if (chainId) {
        await updateChain(chainId, chainData);
      } else {
        await createChain(chainData);
      }

      onClose();
    } catch (error) {
      console.error('Failed to save chain:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {chainId ? 'Edit Chain' : 'Add New Chain'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Chain Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              disabled={isLoading}
            />
            <TextField
              fullWidth
              label="Chain ID"
              name="chainId"
              type="number"
              value={formData.chainId}
              onChange={handleChange}
              error={!!errors.chainId}
              helperText={errors.chainId}
              disabled={isLoading}
            />
            <TextField
              fullWidth
              label="RPC URL"
              name="rpcUrl"
              value={formData.rpcUrl}
              onChange={handleChange}
              error={!!errors.rpcUrl}
              helperText={errors.rpcUrl}
              disabled={isLoading}
            />
            <TextField
              fullWidth
              label="Explorer URL"
              name="explorerUrl"
              value={formData.explorerUrl}
              onChange={handleChange}
              error={!!errors.explorerUrl}
              helperText={errors.explorerUrl}
              disabled={isLoading}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
          >
            {chainId ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ChainFormModal; 