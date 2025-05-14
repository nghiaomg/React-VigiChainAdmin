import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Box,
  TablePagination,
  CircularProgress,
  Typography,
  Alert,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useChains } from '@/contexts/ChainsContext';
import { formatDate } from '@/utils/format';

interface ChainTableProps {
  onOpenDetails: () => void;
  isLoading: boolean;
}

const ChainTable: React.FC<ChainTableProps> = ({ onOpenDetails, isLoading }) => {
  const {
    chains,
    pagination,
    fetchChains,
    getChainById,
    error,
  } = useChains();

  const handleChangePage = (_event: unknown, newPage: number) => {
    fetchChains(newPage + 1, pagination.limit);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    fetchChains(1, parseInt(event.target.value, 10));
  };

  const handleViewDetails = async (id: string) => {
    await getChainById(id);
    onOpenDetails();
  };

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Chain ID</TableCell>
              <TableCell>RPC URL</TableCell>
              <TableCell>Explorer URL</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Updated At</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!chains || !Array.isArray(chains) || chains.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography>No chains found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              chains.map((chain) => (
                <TableRow key={chain.id}>
                  <TableCell>{chain.name}</TableCell>
                  <TableCell>
                    <Chip label={chain.chainId} size="small" />
                  </TableCell>
                  <TableCell>
                    <Box
                      component="a"
                      href={chain.rpcUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ color: 'primary.main', textDecoration: 'none' }}
                    >
                      {chain.rpcUrl}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box
                      component="a"
                      href={chain.explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ color: 'primary.main', textDecoration: 'none' }}
                    >
                      {chain.explorerUrl}
                    </Box>
                  </TableCell>
                  <TableCell>{formatDate(chain.createdAt)}</TableCell>
                  <TableCell>{formatDate(chain.updatedAt)}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleViewDetails(chain.id)}
                      title="View Details"
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={pagination.total}
        page={pagination.page - 1}
        onPageChange={handleChangePage}
        rowsPerPage={pagination.limit}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </Paper>
  );
};

export default ChainTable; 