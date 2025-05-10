import {
  Box,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { useWallets } from '@/contexts/WalletsContext';
import { useState } from 'react';

const roleOptions = [
  { value: '', label: 'All Roles' },
  { value: 'user', label: 'User' },
  { value: 'validator', label: 'Validator' },
  { value: 'contract', label: 'Contract' },
  { value: 'exchange', label: 'Exchange' },
  { value: 'miner', label: 'Miner' },
];

const WalletFilters = () => {
  const {
    searchTerm,
    riskLevel,
    setSearchTerm,
    setRiskLevel,
  } = useWallets();

  const [selectedRole, setSelectedRole] = useState('');

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: { xs: 'column', sm: 'row' }, 
      gap: 2,
      width: { xs: '100%', md: 'auto' } 
    }}>
      <TextField
        placeholder="Search wallet or tag"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
        size="small"
        sx={{ width: { xs: '100%', sm: 220 } }}
      />
      
      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel id="risk-filter-label">Risk Level</InputLabel>
        <Select
          labelId="risk-filter-label"
          value={riskLevel}
          label="Risk Level"
          onChange={(e) => setRiskLevel(e.target.value as 'all' | 'low' | 'medium' | 'high')}
        >
          <MenuItem value="all">All Levels</MenuItem>
          <MenuItem value="low">Low Risk</MenuItem>
          <MenuItem value="medium">Medium Risk</MenuItem>
          <MenuItem value="high">High Risk</MenuItem>
        </Select>
      </FormControl>
      
      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel id="role-filter-label">Role</InputLabel>
        <Select
          labelId="role-filter-label"
          value={selectedRole}
          label="Role"
          onChange={(e) => handleRoleChange(e.target.value as string)}
        >
          {roleOptions.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default WalletFilters; 