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
  CircularProgress,
} from "@mui/material";
import { useWallets } from "@/contexts/WalletsContext";
import { getRiskLevel } from "@/stores/walletsStore";

interface WalletDetailsModalProps {
  open: boolean;
  onClose: () => void;
  walletId: string | null;
}

const WalletDetailsModal = ({
  open,
  onClose,
  walletId,
}: WalletDetailsModalProps) => {
  const { selectedWallet, analysisResult, isLoading } = useWallets();

  if (!selectedWallet || !walletId) return null;

  const riskLevelValue = getRiskLevel(selectedWallet.reputationScore);
  const riskLevelLabel =
    riskLevelValue === "low"
      ? "Low"
      : riskLevelValue === "medium"
      ? "Medium"
      : "High";

  const riskLevelColor =
    riskLevelValue === "low"
      ? "success"
      : riskLevelValue === "medium"
      ? "warning"
      : "error";

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h6" fontWeight="600">
          Wallet Details
        </Typography>
      </DialogTitle>

      <DialogContent>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Address
              </Typography>
              <Typography
                variant="body1"
                fontFamily="monospace"
                sx={{ wordBreak: "break-all" }}
              >
                {selectedWallet.address}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
              <Box sx={{ flex: "1 1 200px" }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Reputation Score
                </Typography>
                <Typography variant="body1">
                  {selectedWallet.reputationScore}
                </Typography>
              </Box>

              <Box sx={{ flex: "1 1 200px" }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Risk Level
                </Typography>
                <Chip
                  label={riskLevelLabel}
                  color={riskLevelColor as any}
                  size="small"
                  variant="outlined"
                />
              </Box>

              <Box sx={{ flex: "1 1 200px" }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Role
                </Typography>
                <Chip
                  label={selectedWallet.role}
                  color={
                    selectedWallet.role === "admin" ? "primary" : "default"
                  }
                  size="small"
                />
              </Box>

              <Box sx={{ flex: "1 1 200px" }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Last Analyzed
                </Typography>
                <Typography variant="body1">
                  {formatDate(selectedWallet.lastAnalyzed)}
                </Typography>
              </Box>
            </Box>

            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Tags
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {selectedWallet.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    size="small"
                    sx={{ height: 24 }}
                  />
                ))}
              </Box>
            </Box>

            {analysisResult && (
              <>
                <Divider sx={{ my: 2 }} />
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Analysis Results
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                  <Box sx={{ flex: "1 1 200px" }}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Analysis Score
                    </Typography>
                    <Typography variant="body1">
                      {analysisResult.score}
                    </Typography>
                  </Box>

                  <Box sx={{ flex: "1 1 200px" }}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Analysis Date
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(analysisResult.timestamp)}
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Risk Factors
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {analysisResult.riskFactors.map((factor, index) => (
                      <Chip
                        key={index}
                        label={factor.name}
                        color="error"
                        size="small"
                        variant="outlined"
                        title={factor.description}
                      />
                    ))}
                  </Box>
                </Box>
              </>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default WalletDetailsModal;
