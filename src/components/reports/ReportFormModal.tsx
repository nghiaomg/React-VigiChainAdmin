import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
  Box,
  FormHelperText,
  FormControl,
  InputLabel,
  Select,
  Typography,
  IconButton,
  Chip,
  Autocomplete,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { useState, useEffect } from "react";
import { useReports } from "@/contexts/ReportsContext";
import { useAuthStore } from "@/stores";
import type { Report, VerificationData } from "@/stores/reportsStore";
import { Add, Remove } from "@mui/icons-material";
import { useTags } from "@/contexts/TagsContext";

interface ReportFormModalProps {
  open: boolean;
  onClose: () => void;
  report: Report | null;
}

interface FormErrors {
  walletAddress?: string;
  reporterAddress?: string;
  txId?: string;
  description?: string;
  evidence?: string;
  suggestedTags?: string;
  stakeAmount?: string;
  verificationAction?: string;
  reason?: string;
  tags?: string;
}

const ReportFormModal = ({ open, onClose, report }: ReportFormModalProps) => {
  const { wallet } = useAuthStore();
  const { createReport, verifyReport } = useReports();
  const { tags: allTags, fetchTags } = useTags();
  const [isVerification, setIsVerification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  
  // Creation form data
  const [createFormData, setCreateFormData] = useState({
    walletAddress: "",
    reporterAddress: wallet?.address || "",
    txId: "",
    description: "",
    evidence: [""],
    suggestedTags: [] as string[],
    tags: [] as string[],
    stakeAmount: 1
  });

  // Verification form data
  const [verifyFormData, setVerifyFormData] = useState<VerificationData>({
    action: "approve",
    verifiedBy: wallet?.address || "",
    reason: "",
    assignedTags: []
  });

  useEffect(() => {
    if (report) {
      setIsVerification(true);
      // Set verification form defaults based on report data
      setVerifyFormData({
        action: "approve",
        verifiedBy: wallet?.address || "",
        reason: "",
        assignedTags: report.suggestedTags || []
      });
    } else {
      setIsVerification(false);
      // Reset creation form with user's wallet address
      setCreateFormData({
        walletAddress: "",
        reporterAddress: wallet?.address || "",
        txId: "",
        description: "",
        evidence: [""],
        suggestedTags: [],
        tags: [],
        stakeAmount: 1
      });
    }
    setErrors({});
  }, [report, wallet?.address, open]);

  useEffect(() => {
    // Fetch all tags for selection
    fetchTags(1, 100).catch(err => {
      console.error("Failed to fetch tags:", err);
    });
  }, [fetchTags]);

  const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreateFormData(prev => ({
      ...prev,
      [name]: name === "stakeAmount" ? parseFloat(value) || 0 : value
    }));
    // Clear error when field is edited
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleVerifyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVerifyFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when field is edited
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleActionChange = (event: SelectChangeEvent) => {
    const value = event.target.value as "approve" | "reject";
    setVerifyFormData(prev => ({
      ...prev,
      action: value
    }));
  };

  const addEvidenceField = () => {
    setCreateFormData(prev => ({
      ...prev,
      evidence: [...prev.evidence, ""]
    }));
  };

  const removeEvidenceField = (index: number) => {
    setCreateFormData(prev => ({
      ...prev,
      evidence: prev.evidence.filter((_, i) => i !== index)
    }));
  };

  const handleEvidenceChange = (index: number, value: string) => {
    setCreateFormData(prev => {
      const newEvidence = [...prev.evidence];
      newEvidence[index] = value;
      return {
        ...prev,
        evidence: newEvidence
      };
    });
  };

  const validateCreateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!createFormData.walletAddress.trim()) {
      newErrors.walletAddress = "Wallet address is required";
    }
    
    if (!createFormData.reporterAddress.trim()) {
      newErrors.reporterAddress = "Reporter address is required";
    }
    
    if (!createFormData.txId.trim()) {
      newErrors.txId = "Transaction ID is required";
    }
    
    if (!createFormData.description.trim()) {
      newErrors.description = "Description is required";
    }
    
    if (createFormData.evidence.some(e => !e.trim())) {
      newErrors.evidence = "All evidence URLs are required";
    }
    
    if (createFormData.stakeAmount < 1) {
      newErrors.stakeAmount = "Minimum stake amount is 1";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateVerifyForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!verifyFormData.reason.trim()) {
      newErrors.reason = "Reason is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (isVerification) {
      if (!validateVerifyForm() || !report) return;
      
      setLoading(true);
      try {
        await verifyReport(report.id, verifyFormData);
        onClose();
      } catch (error) {
        console.error("Failed to verify report:", error);
      } finally {
        setLoading(false);
      }
    } else {
      if (!validateCreateForm()) return;
      
      setLoading(true);
      try {
        await createReport(createFormData);
        onClose();
      } catch (error) {
        console.error("Failed to submit report:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isVerification 
          ? `Verify Report: ${report?.walletAddress}`
          : "Submit New Report"
        }
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {isVerification ? (
            // Verification Form
            <Stack spacing={3}>
              <FormControl>
                <InputLabel id="action-label">Action</InputLabel>
                <Select
                  labelId="action-label"
                  id="action"
                  name="action"
                  value={verifyFormData.action}
                  onChange={handleActionChange}
                  label="Action"
                >
                  <MenuItem value="approve">Approve</MenuItem>
                  <MenuItem value="reject">Reject</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                fullWidth
                label="Reason"
                name="reason"
                value={verifyFormData.reason}
                onChange={handleVerifyChange}
                error={!!errors.reason}
                helperText={errors.reason}
                disabled={loading}
                multiline
                rows={3}
                placeholder="Provide a reason for approval or rejection"
              />
              
              {verifyFormData.action === "approve" && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Assigned Tags
                  </Typography>
                  <Autocomplete
                    multiple
                    options={allTags}
                    getOptionLabel={(option) => option.name}
                    value={allTags.filter(tag => verifyFormData.assignedTags?.includes(tag.id) || false)}
                    onChange={(_, newValue) => {
                      setVerifyFormData(prev => ({
                        ...prev,
                        assignedTags: newValue.map(tag => tag.id)
                      }));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        placeholder="Assign tags to this wallet"
                      />
                    )}
                    renderOption={(props, option) => (
                      <li {...props}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2">{option.name}</Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                            ({option.category?.name})
                          </Typography>
                        </Box>
                      </li>
                    )}
                    disabled={loading}
                  />
                  <FormHelperText>Tags assigned to the reported wallet</FormHelperText>
                </Box>
              )}
            </Stack>
          ) : (
            // Creation Form
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Wallet Address"
                name="walletAddress"
                value={createFormData.walletAddress}
                onChange={handleCreateChange}
                error={!!errors.walletAddress}
                helperText={errors.walletAddress}
                disabled={loading}
                placeholder="0x..."
              />
              
              <TextField
                fullWidth
                label="Reporter Address"
                name="reporterAddress"
                value={createFormData.reporterAddress}
                onChange={handleCreateChange}
                error={!!errors.reporterAddress}
                helperText={errors.reporterAddress}
                disabled={true} // Use connected wallet
              />
              
              <TextField
                fullWidth
                label="Transaction ID"
                name="txId"
                value={createFormData.txId}
                onChange={handleCreateChange}
                error={!!errors.txId}
                helperText={errors.txId}
                disabled={loading}
                placeholder="0x..."
              />
              
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={createFormData.description}
                onChange={handleCreateChange}
                error={!!errors.description}
                helperText={errors.description}
                disabled={loading}
                multiline
                rows={3}
                placeholder="Describe the suspicious activity in detail"
              />
              
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Evidence
                </Typography>
                <Stack spacing={2}>
                  {createFormData.evidence.map((url, index) => (
                    <Box key={index} sx={{ display: 'flex', gap: 1 }}>
                      <TextField
                        fullWidth
                        placeholder="https://..."
                        value={url}
                        onChange={(e) => handleEvidenceChange(index, e.target.value)}
                        error={!!errors.evidence}
                        disabled={loading}
                      />
                      {index > 0 && (
                        <IconButton 
                          color="error" 
                          onClick={() => removeEvidenceField(index)}
                          disabled={loading}
                        >
                          <Remove />
                        </IconButton>
                      )}
                    </Box>
                  ))}
                  <Button
                    startIcon={<Add />}
                    onClick={addEvidenceField}
                    disabled={loading}
                    sx={{ alignSelf: 'flex-start' }}
                  >
                    Add Evidence
                  </Button>
                </Stack>
                {errors.evidence && (
                  <FormHelperText error>{errors.evidence}</FormHelperText>
                )}
              </Box>
              
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Tags
                </Typography>
                <Autocomplete
                  multiple
                  options={allTags}
                  getOptionLabel={(option) => option.name}
                  value={allTags.filter(tag => createFormData.tags.includes(tag.id))}
                  onChange={(_, newValue) => {
                    setCreateFormData(prev => ({
                      ...prev,
                      tags: newValue.map(tag => tag.id)
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder="Select tags"
                      error={!!errors.tags}
                      helperText={errors.tags}
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2">{option.name}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                          ({option.category?.name})
                        </Typography>
                      </Box>
                    </li>
                  )}
                  disabled={loading}
                />
              </Box>

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Suggested Tags
                </Typography>
                <Autocomplete
                  multiple
                  options={allTags}
                  getOptionLabel={(option) => option.name}
                  value={allTags.filter(tag => createFormData.suggestedTags.includes(tag.id))}
                  onChange={(_, newValue) => {
                    setCreateFormData(prev => ({
                      ...prev,
                      suggestedTags: newValue.map(tag => tag.id)
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder="Suggest tags for this wallet"
                      error={!!errors.suggestedTags}
                      helperText={errors.suggestedTags}
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2">{option.name}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                          ({option.category?.name})
                        </Typography>
                      </Box>
                    </li>
                  )}
                  disabled={loading}
                />
              </Box>

              <TextField
                fullWidth
                type="number"
                label="Stake Amount"
                name="stakeAmount"
                value={createFormData.stakeAmount}
                onChange={handleCreateChange}
                error={!!errors.stakeAmount}
                helperText={errors.stakeAmount || "Minimum stake amount is 1"}
                disabled={loading}
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Stack>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={loading}
        >
          {loading 
            ? "Submitting..." 
            : isVerification 
              ? "Verify Report" 
              : "Submit Report"
          }
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReportFormModal; 