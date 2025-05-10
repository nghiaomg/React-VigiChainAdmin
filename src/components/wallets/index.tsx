import { useEffect, useState } from "react";
import { Box, Typography, Card, Button, Divider } from "@mui/material";
import { FilterList, Add } from "@mui/icons-material";
import { useAuthStore } from "@/stores";
import { useWallets } from "@/contexts/WalletsContext";
import WalletFilters from "./WalletFilters";
import WalletTable from "./WalletTable";
import WalletActionMenu from "./WalletActionMenu";

const WalletsPage = () => {
  const { wallet: adminWallet } = useAuthStore();
  const {
    filteredWallets,
    fetchWallets,
    getWalletDetails,
    blockWallet,
    pagination,
  } = useWallets();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);

  useEffect(() => {
    fetchWallets(page + 1, rowsPerPage);
  }, [page, rowsPerPage, fetchWallets]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const handleCloseActionMenu = () => {
    setActionMenuAnchor(null);
    setSelectedWalletId(null);
  };

  const handleViewDetails = async (id: string) => {
    try {
      await getWalletDetails(id);
      handleCloseActionMenu();
    } catch (error) {
      console.error("Failed to get wallet details:", error);
    }
  };

  const handleBlockWallet = async (id: string) => {
    try {
      await blockWallet(id);
      handleCloseActionMenu();
    } catch (error) {
      console.error("Failed to block wallet:", error);
    }
  };

  const handleUpdateScore = async (id: string, newScore: number) => {
    try {
      console.log("Update score for wallet:", id, "to", newScore);
      await fetchWallets(page + 1, rowsPerPage);
      handleCloseActionMenu();
    } catch (error) {
      console.error("Failed to update reputation score:", error);
    }
  };

  const isAdmin = adminWallet?.role === "admin";

  return (
    <Box
      sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 2 }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            mb: 3,
            fontWeight: 700,
            color: "text.primary",
          }}
        >
          Wallet Monitoring
        </Typography>
        {isAdmin && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              mb: 4,
            }}
          >
            <Button variant="outlined" startIcon={<FilterList />}>
              Export Data
            </Button>
            {/* <Button variant="contained" color="primary" startIcon={<Add />}>
              Add Wallet
            </Button> */}
          </Box>
        )}
      </Box>

      <Card
        elevation={0}
        sx={{
          mb: 4,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            p: 3,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
            gap: 2,
          }}
        >
          <Typography variant="h6" fontWeight="600">
            Registered Wallets
          </Typography>

          <WalletFilters />
        </Box>

        <Divider />

        <WalletTable
          page={page}
          rowsPerPage={rowsPerPage}
          totalCount={pagination.total}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      <WalletActionMenu
        anchorEl={actionMenuAnchor}
        onClose={handleCloseActionMenu}
        onViewDetails={() =>
          selectedWalletId && handleViewDetails(selectedWalletId)
        }
        onSetHighReputation={() =>
          selectedWalletId && handleUpdateScore(selectedWalletId, 80)
        }
        onSetLowReputation={() =>
          selectedWalletId && handleUpdateScore(selectedWalletId, 30)
        }
        onBlockWallet={() =>
          selectedWalletId && handleBlockWallet(selectedWalletId)
        }
      />
    </Box>
  );
};

export default WalletsPage;
