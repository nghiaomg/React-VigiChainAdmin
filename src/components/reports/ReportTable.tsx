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
import { MoreVert, Delete, Visibility, Check, Close, Label } from "@mui/icons-material";
import { useReports } from "@/contexts/ReportsContext";
import { useTags } from "@/contexts/TagsContext";
import { useAuthStore } from "@/stores";
import { useState, useEffect } from "react";
import type { Tag } from "@/types/tag";

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
  const { tags: allTags, getMultipleTags } = useTags();
  const [tagMap, setTagMap] = useState<Record<string, Tag>>({});
  
  useEffect(() => {
    if (reports && reports.length > 0) {
      // Collect all tag IDs from all reports
      const allTagIds = reports.flatMap(report => report.tags || []);
      
      if (allTagIds.length > 0) {
        // Fetch all tag data for these IDs
        getMultipleTags(allTagIds).catch(err => {
          console.error("Failed to fetch report tags:", err);
        });
      }
    }
  }, [reports, getMultipleTags]);
  
  useEffect(() => {
    // Create a map of tag ID to tag object for quick lookups
    const newTagMap: Record<string, Tag> = {};
    allTags.forEach(tag => {
      newTagMap[tag.id] = tag;
    });
    setTagMap(newTagMap);
  }, [allTags]);

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
  
  const getTagColorByCategory = (category: any) => {
    if (!category) return "default";
    
    switch (category.type) {
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
              <TableCell>Tags</TableCell>
              <TableCell>Stake Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography>Loading...</Typography>
                </TableCell>
              </TableRow>
            ) : reports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
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
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxWidth: 150 }}>
                      {report.tags && report.tags.length > 0 ? (
                        report.tags.slice(0, 2).map((tagId, index) => {
                          const tag = tagMap[tagId];
                          return (
                            <Chip 
                              key={index} 
                              label={tag ? tag.name : tagId.split('-')[0]}
                              size="small"
                              icon={<Label fontSize="small" />}
                              color={tag ? getTagColorByCategory(tag.category) as any : "default"}
                              sx={{ maxWidth: '100%' }}
                            />
                          );
                        })
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No tags
                        </Typography>
                      )}
                      {report.tags && report.tags.length > 2 && (
                        <Chip 
                          label={`+${report.tags.length - 2}`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
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