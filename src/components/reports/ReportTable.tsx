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
import { MoreVert, Delete, Visibility, Check, Close } from "@mui/icons-material";
import { useReports } from "@/contexts/ReportsContext";
import { useAuthStore } from "@/stores";

interface ReportTableProps {
  page: number;
  rowsPerPage: number;
  totalCount: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onViewDetails?: (id: string) => void;
  onVerify?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const ReportTable = ({
  page,
  rowsPerPage,
  totalCount,
  onPageChange,
  onRowsPerPageChange,
  onViewDetails,
  onVerify,
  onDelete,
}: ReportTableProps) => {
  const { wallet: adminWallet } = useAuthStore();
  const { reports, isLoading, error } = useReports();

  const isAdmin = adminWallet?.role === "admin";

  const handleViewDetails = (id: string, event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    if (onViewDetails) {
      onViewDetails(id);
    }
  };

  const handleVerify = (id: string, event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    if (onVerify) {
      onVerify(id);
    }
  };

  const handleDelete = (id: string, event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    if (onDelete) {
      onDelete(id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "success";
      case "rejected":
        return "error";
      case "pending":
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

  const truncateWalletAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
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
              <TableCell>Reported Wallet</TableCell>
              <TableCell>Reporter</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Stake Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
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
            ) : reports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography>No reports found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              reports.map((report) => (
                <TableRow key={report.id} hover>
                  <TableCell>
                    <Typography variant="body2">
                      {truncateWalletAddress(report.walletAddress)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {truncateWalletAddress(report.reporterAddress)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 200 }}>
                      {report.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{report.stakeAmount}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      color={getStatusColor(report.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(report.createdAt)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={(e) => handleViewDetails(report.id, e)}
                          sx={{ mr: 1 }}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      
                      {isAdmin && report.status === "pending" && (
                        <Tooltip title="Verify Report">
                          <IconButton
                            size="small"
                            color="success"
                            onClick={(e) => handleVerify(report.id, e)}
                            sx={{ mr: 1 }}
                          >
                            <Check fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      
                      {isAdmin && (
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={(e) => handleDelete(report.id, e)}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
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

export default ReportTable; 