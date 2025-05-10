import {
  TableRow,
  TableCell,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  VisibilityOutlined,
  Block,
  Check,
  TrendingUp,
  TrendingDown,
  MoreVert,
} from "@mui/icons-material";
import { getRiskLevel } from "@/stores/walletsStore";
import { useWallets } from "@/contexts/WalletsContext";
import type { Wallet } from "@/types/wallet";
import { useState } from "react";
import WalletDetailsModal from "./WalletDetailsModal";

interface WalletTableRowProps {
  wallet: Wallet;
}

const WalletTableRow = ({ wallet }: WalletTableRowProps) => {
  const { getWalletDetails, blockWallet, markWalletSafe } = useWallets();
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const riskLevelValue = getRiskLevel(wallet.reputationScore);
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

  const scoreIcon =
    wallet.reputationScore >= 70 ? (
      <TrendingUp fontSize="small" />
    ) : (
      <TrendingDown fontSize="small" />
    );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleViewDetails = async () => {
    try {
      await getWalletDetails(wallet.id);
      setIsDetailsModalOpen(true);
    } catch (error) {
      console.error("Failed to get wallet details:", error);
    }
  };

  const handleBlockWallet = async () => {
    try {
      await blockWallet(wallet.id);
    } catch (error) {
      console.error("Failed to block wallet:", error);
    }
  };

  const handleMarkSafe = async () => {
    try {
      await markWalletSafe(wallet.id);
    } catch (error) {
      console.error("Failed to mark wallet as safe:", error);
    }
  };

  return (
    <>
      <TableRow hover>
        <TableCell>
          <Typography variant="body2" fontFamily="monospace" fontWeight="medium">
            {wallet.address.slice(0, 8)}...{wallet.address.slice(-6)}
          </Typography>
          <Box sx={{ display: "flex", gap: 0.5, mt: 0.5, flexWrap: "wrap" }}>
            {wallet.tags.map((tag: string, index: number) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                sx={{ height: 20, fontSize: "0.7rem" }}
              />
            ))}
          </Box>
        </TableCell>
        <TableCell>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
            color={wallet.role === "admin" ? "primary" : "default"}
            size="small"
          />
        </TableCell>
        <TableCell>{formatDate(wallet.lastAnalyzed)}</TableCell>
        <TableCell align="right">
          <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
            <Tooltip title="View Details">
              <IconButton size="small" onClick={handleViewDetails}>
                <VisibilityOutlined fontSize="small" />
              </IconButton>
            </Tooltip>
            {wallet.role === "admin" && (
              <>
                <Tooltip
                  title={
                    wallet.reputationScore < 30 ? "Block Wallet" : "Mark as Safe"
                  }
                >
                  <IconButton
                    size="small"
                    color={wallet.reputationScore < 30 ? "error" : "success"}
                    onClick={
                      wallet.reputationScore < 30
                        ? handleBlockWallet
                        : handleMarkSafe
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
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <MoreVert fontSize="small" />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Box>
        </TableCell>
      </TableRow>

      <WalletDetailsModal
        open={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        walletId={wallet.id}
      />
    </>
  );
};

export default WalletTableRow;
