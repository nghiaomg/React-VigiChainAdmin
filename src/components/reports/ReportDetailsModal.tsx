import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
  Stack,
  Link,
  IconButton,
} from "@mui/material";
import { Check, ContentCopy } from "@mui/icons-material";
import type { Report } from "@/stores/reportsStore";

interface ReportDetailsModalProps {
  report: Report | null;
  open: boolean;
  onClose: () => void;
  onVerify?: () => void;
}

const ReportDetailsModal = ({ report, open, onClose, onVerify }: ReportDetailsModalProps) => {
  if (!report) return null;

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Ideally would show a snackbar/toast here
    alert("Copied to clipboard");
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" component="div">
            Report Details
          </Typography>
          {onVerify && report.status === "pending" && (
            <Button 
              startIcon={<Check />} 
              variant="outlined" 
              color="success"
              size="small"
              onClick={() => {
                onVerify();
                onClose();
              }}
            >
              Verify
            </Button>
          )}
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Reported Wallet
              </Typography>
              <Box display="flex" alignItems="center">
                <Typography variant="body1" sx={{ mr: 1 }}>
                  {report.walletAddress}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => copyToClipboard(report.walletAddress)}
                >
                  <ContentCopy fontSize="small" />
                </IconButton>
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Reporter
              </Typography>
              <Box display="flex" alignItems="center">
                <Typography variant="body1" sx={{ mr: 1 }}>
                  {report.reporterAddress}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => copyToClipboard(report.reporterAddress)}
                >
                  <ContentCopy fontSize="small" />
                </IconButton>
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Transaction ID
              </Typography>
              <Box display="flex" alignItems="center">
                <Typography variant="body1" sx={{ mr: 1 }}>
                  {report.txId}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => copyToClipboard(report.txId)}
                >
                  <ContentCopy fontSize="small" />
                </IconButton>
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Description
              </Typography>
              <Typography variant="body1">{report.description}</Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Evidence
              </Typography>
              <Stack spacing={1}>
                {report.evidence.map((item, index) => (
                  <Link
                    key={index}
                    href={item}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ wordBreak: "break-all" }}
                  >
                    {item}
                  </Link>
                ))}
              </Stack>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Stake Amount
              </Typography>
              <Typography variant="body1">{report.stakeAmount}</Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Status
              </Typography>
              <Chip
                label={report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                color={getStatusColor(report.status) as any}
                size="small"
              />
            </Box>

            {report.verificationResult && (
              <>
                <Divider />
                <Typography variant="h6">Verification Details</Typography>
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Verified By
                  </Typography>
                  <Typography variant="body1">{report.verificationResult.verifiedBy}</Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Verification Date
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(report.verificationResult.verifiedAt)}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Reason
                  </Typography>
                  <Typography variant="body1">{report.verificationResult.reason}</Typography>
                </Box>
                
                {report.verificationResult.assignedTags && report.verificationResult.assignedTags.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Assigned Tags
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                      {report.verificationResult.assignedTags.map((tag, index) => (
                        <Chip key={index} label={tag} size="small" />
                      ))}
                    </Box>
                  </Box>
                )}
              </>
            )}

            <Divider />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
              <Box flex={1}>
                <Typography variant="subtitle2" color="text.secondary">
                  Created At
                </Typography>
                <Typography variant="body2">
                  {formatDate(report.createdAt)}
                </Typography>
              </Box>

              <Box flex={1}>
                <Typography variant="subtitle2" color="text.secondary">
                  Updated At
                </Typography>
                <Typography variant="body2">
                  {formatDate(report.updatedAt)}
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReportDetailsModal; 