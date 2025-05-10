import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  TextField,
  InputAdornment,
  CircularProgress,
  Button,
  IconButton,
  Tooltip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Paper,
  Divider,
  Alert,
  Menu,
} from '@mui/material';
import {
  Search,
  FilterList,
  VisibilityOutlined,
  Block,
  Check,
  ErrorOutline,
  TrendingUp,
  TrendingDown,
  MoreVert,
  Add,
} from '@mui/icons-material';
import { useAuthStore } from '@/stores';
import { useWallets } from '@/contexts/WalletsContext';
import { getRiskLevel } from '@/stores/walletsStore';

const roleOptions = [
  { value: '', label: 'All Roles' },
  { value: 'user', label: 'User' },
  { value: 'validator', label: 'Validator' },
  { value: 'contract', label: 'Contract' },
  { value: 'exchange', label: 'Exchange' },
  { value: 'miner', label: 'Miner' },
];

const WalletsPage = () => {
  const { wallet: adminWallet } = useAuthStore();
  const {
    wallets,
    filteredWallets,
    isLoading,
    error,
    searchTerm,
    riskLevel,
    setSearchTerm,
    setRiskLevel,
    blockWallet,
    markWalletSafe,
    fetchWallets,
    getWalletDetails,
  } = useWallets();
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRole, setSelectedRole] = useState('');
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  // Refresh wallets data when component mounts
  useEffect(() => {
    const loadWallets = async () => {
      try {
        await fetchWallets();
        setTotalCount(filteredWallets.length);
      } catch (error) {
        console.error('Failed to load wallets:', error);
      }
    };
    
    loadWallets();
  }, [fetchWallets]);

  // Pagination handlers
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  // Role filter handler
  const handleRoleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const role = event.target.value as string;
    setSelectedRole(role);
    // Custom filtering for role
    if (role) {
      const filtered = wallets.filter(wallet => wallet.role === role);
      setTotalCount(filtered.length);
    } else {
      setTotalCount(wallets.length);
    }
  };

  // Action menu handlers
  const handleOpenActionMenu = (event: React.MouseEvent<HTMLElement>, walletId: string) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedWalletId(walletId);
  };

  const handleCloseActionMenu = () => {
    setActionMenuAnchor(null);
    setSelectedWalletId(null);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Handle actions
  const handleViewDetails = async (id: string) => {
    try {
      await getWalletDetails(id);
      // In a real app, we would navigate to a detail page or open a modal
      console.log('View details for wallet:', id);
    } catch (error) {
      console.error('Failed to get wallet details:', error);
    }
    handleCloseActionMenu();
  };

  const handleBlockWallet = async (id: string) => {
    try {
      await blockWallet(id);
    } catch (error) {
      console.error('Failed to block wallet:', error);
    }
    handleCloseActionMenu();
  };

  const handleMarkSafe = async (id: string) => {
    try {
      await markWalletSafe(id);
    } catch (error) {
      console.error('Failed to mark wallet as safe:', error);
    }
    handleCloseActionMenu();
  };

  const handleUpdateScore = async (id: string, newScore: number) => {
    try {
      // We can create this function when the API supports it
      console.log('Update score for wallet:', id, 'to', newScore);
      // Mock implementation for now
      await fetchWallets();
    } catch (error) {
      console.error('Failed to update reputation score:', error);
    }
    handleCloseActionMenu();
  };

  // Check if user is admin
  const isAdmin = adminWallet?.role === 'admin';

  // Apply pagination
  const paginatedWallets = filteredWallets.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          fontWeight: 700,
          color: 'text.primary',
        }}
      >
        Wallet Monitoring
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Card 
        elevation={0}
        sx={{ 
          mb: 4,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <Box sx={{ 
          p: 3, 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 2
        }}>
          <Typography variant="h6" fontWeight="600">
            Registered Wallets
          </Typography>
          
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
                onChange={(e) => setRiskLevel(e.target.value as any)}
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
                onChange={(e: any) => handleRoleChange(e)}
              >
                {roleOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
        
        <Divider />
        
        <TableContainer component={Paper} elevation={0}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : filteredWallets.length === 0 ? (
            <Box sx={{ textAlign: 'center', p: 4 }}>
              <ErrorOutline sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No wallets found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {searchTerm || riskLevel !== 'all' || selectedRole
                  ? 'Try adjusting your search or filters'
                  : 'No wallet data is available'}
              </Typography>
            </Box>
          ) : (
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Address</TableCell>
                  <TableCell>Reputation Score</TableCell>
                  <TableCell>Risk Level</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Last Analyzed</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedWallets.map((wallet) => {
                  const riskLevelValue = getRiskLevel(wallet.reputationScore);
                  const riskLevelLabel = 
                    riskLevelValue === 'low' ? 'Low' : 
                    riskLevelValue === 'medium' ? 'Medium' : 'High';
                    
                  const riskLevelColor = 
                    riskLevelValue === 'low' ? 'success' : 
                    riskLevelValue === 'medium' ? 'warning' : 'error';
                    
                  const scoreIcon = wallet.reputationScore >= 70 
                    ? <TrendingUp fontSize="small" /> 
                    : <TrendingDown fontSize="small" />;
                    
                  return (
                    <TableRow key={wallet.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace" fontWeight="medium">
                          {wallet.address.slice(0, 8)}...{wallet.address.slice(-6)}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                          {wallet.tags.map((tag, index) => (
                            <Chip 
                              key={index} 
                              label={tag} 
                              size="small" 
                              sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                          ))}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {scoreIcon}
                          <Typography variant="body2" fontWeight="medium">
                            {wallet.reputationScore}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={riskLevelLabel} 
                          color={riskLevelColor as any} 
                          size="small" 
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={wallet.role} 
                          color={wallet.role === 'admin' ? 'primary' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {formatDate(wallet.lastAnalyzed)}
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                          <Tooltip title="View Details">
                            <IconButton 
                              size="small"
                              onClick={() => handleViewDetails(wallet.id)}
                            >
                              <VisibilityOutlined fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {isAdmin && (
                            <>
                              <Tooltip title={wallet.reputationScore < 30 ? 'Block Wallet' : 'Mark as Safe'}>
                                <IconButton 
                                  size="small" 
                                  color={wallet.reputationScore < 30 ? 'error' : 'success'}
                                  onClick={() => wallet.reputationScore < 30 
                                    ? handleBlockWallet(wallet.id)
                                    : handleMarkSafe(wallet.id)
                                  }
                                >
                                  {wallet.reputationScore < 30 ? (
                                    <Block fontSize="small" />
                                  ) : (
                                    <Check fontSize="small" />
                                  )}
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="More Actions">
                                <IconButton
                                  size="small"
                                  onClick={(e) => handleOpenActionMenu(e, wallet.id)}
                                >
                                  <MoreVert fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Card>
      
      {isAdmin && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 4 }}>
          <Button 
            variant="outlined" 
            startIcon={<FilterList />}
          >
            Export Data
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<Add />}
          >
            Add Wallet
          </Button>
        </Box>
      )}
      
      {/* Action Menu */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleCloseActionMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => selectedWalletId && handleViewDetails(selectedWalletId)}>
          View Details
        </MenuItem>
        <MenuItem onClick={() => selectedWalletId && handleUpdateScore(selectedWalletId, 80)}>
          Set High Reputation
        </MenuItem>
        <MenuItem onClick={() => selectedWalletId && handleUpdateScore(selectedWalletId, 30)}>
          Set Low Reputation
        </MenuItem>
        <Divider />
        <MenuItem 
          onClick={() => selectedWalletId && handleBlockWallet(selectedWalletId)}
          sx={{ color: 'error.main' }}
        >
          Block Wallet
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default WalletsPage;
