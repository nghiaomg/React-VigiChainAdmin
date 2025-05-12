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
import { Check, ContentCopy, Add } from "@mui/icons-material";
import { useReports } from "@/contexts/ReportsContext";
import { useTags } from "@/contexts/TagsContext";
import { useState, useEffect } from "react";
import type { Report } from "@/stores/reportsStore";
import type { Tag } from "@/types/tag";

interface ReportDetailsModalProps {
  report: Report | null;
  open: boolean;
  onClose: () => void;
  onVerify?: () => void;
}

const ReportDetailsModal = ({ report, open, onClose, onVerify }: ReportDetailsModalProps) => {
  const { addTagToReport, removeTagFromReport } = useReports();
  const { tags: allTags, getMultipleTags } = useTags();
  const [reportTags, setReportTags] = useState<Tag[]>([]);
  const [suggestedTagsData, setSuggestedTagsData] = useState<Tag[]>([]);
  
  useEffect(() => {
    if (report) {
      if (report.tags && report.tags.length > 0) {
        getMultipleTags(report.tags).catch(err => {
          console.error("Failed to fetch report tags:", err);
        });
      }
      
      if (report.suggestedTags && report.suggestedTags.length > 0) {
        getMultipleTags(report.suggestedTags).catch(err => {
          console.error("Failed to fetch suggested tags:", err);
        });
      }
    }
  }, [report, getMultipleTags]);
  
  useEffect(() => {
    if (report && allTags.length > 0) {
      // Filter tags for this report
      const matchingTags = allTags.filter(tag => 
        report.tags && report.tags.includes(tag.id)
      );
      setReportTags(matchingTags);
      
      // Filter suggested tags
      const matchingSuggested = allTags.filter(tag => 
        report.suggestedTags && report.suggestedTags.includes(tag.id)
      );
      setSuggestedTagsData(matchingSuggested);
    }
  }, [report, allTags]);
  
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
  
  const handleAddTag = (tagId: string) => {
    if (report) {
      addTagToReport(report.id, tagId).catch(error => {
        console.error("Failed to add tag:", error);
      });
    }
  };
  
  const handleRemoveTag = (tagId: string) => {
    if (report) {
      removeTagFromReport(report.id, tagId).catch(error => {
        console.error("Failed to remove tag:", error);
      });
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
                Tags
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {reportTags.length > 0 ? (
                  reportTags.map((tag) => (
                    <Chip 
                      key={tag.id} 
                      label={tag.name}
                      size="small"
                      color={getTagColorByCategory(tag.category) as any}
                      onDelete={() => handleRemoveTag(tag.id)}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No tags assigned
                  </Typography>
                )}
                <Button
                  size="small"
                  startIcon={<Add />}
                  onClick={() => {
                    // This would typically open a dialog to select a tag
                    const tagId = prompt("Enter tag ID to add:");
                    if (tagId) handleAddTag(tagId);
                  }}
                >
                  Add Tag
                </Button>
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Suggested Tags
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {suggestedTagsData.length > 0 ? (
                  suggestedTagsData.map((tag) => (
                    <Chip 
                      key={tag.id} 
                      label={tag.name}
                      size="small"
                      variant="outlined"
                      color={getTagColorByCategory(tag.category) as any}
                      onClick={() => handleAddTag(tag.id)}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No suggested tags
                  </Typography>
                )}
              </Box>
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
                      {report.verificationResult.assignedTags.map((tagId, index) => {
                        const tag = allTags.find(t => t.id === tagId);
                        return (
                          <Chip 
                            key={index} 
                            label={tag ? tag.name : tagId} 
                            size="small"
                            color={tag ? getTagColorByCategory(tag.category) as any : "default"}
                          />
                        );
                      })}
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