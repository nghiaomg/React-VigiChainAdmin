import { useEffect, useState } from "react";
import { Box, Typography, Card, Button, Divider } from "@mui/material";
import { FilterList, Add } from "@mui/icons-material";
import { useAuthStore } from "@/stores";
import { useReports } from "@/contexts/ReportsContext";
import ReportFilters from "@/components/reports/ReportFilters";
import ReportTable from "@/components/reports/ReportTable";
import ReportDetailsModal from "@/components/reports/ReportDetailsModal";
import ReportFormModal from "@/components/reports/ReportFormModal";
import type { Report } from "@/stores/reportsStore";

const ReportsPage = () => {
  const { wallet: adminWallet } = useAuthStore();
  const {
    fetchReports,
    getReportById,
    deleteReport,
    pagination,
    selectedReport,
  } = useReports();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [reportToEdit, setReportToEdit] = useState<Report | null>(null);

  useEffect(() => {
    fetchReports(page + 1, rowsPerPage);
  }, [page, rowsPerPage, fetchReports]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const handleViewDetails = async (id: string) => {
    try {
      await getReportById(id);
      setDetailsModalOpen(true);
    } catch (error) {
      console.error("Failed to get report details:", error);
    }
  };

  const handleVerifyReport = async (id: string) => {
    try {
      await getReportById(id);
      setReportToEdit(selectedReport);
      setFormModalOpen(true);
    } catch (error) {
      console.error("Failed to get report details for verification:", error);
    }
  };

  const handleVerifyFromDetails = () => {
    if (selectedReport) {
      setReportToEdit(selectedReport);
      setFormModalOpen(true);
    }
  };

  const handleCreateReport = () => {
    setReportToEdit(null);
    setFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setFormModalOpen(false);
    setReportToEdit(null);
    // Refresh the reports list after adding/verifying
    fetchReports(page + 1, rowsPerPage);
  };

  const handleDeleteReport = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      try {
        await deleteReport(id);
      } catch (error) {
        console.error("Failed to delete report:", error);
      }
    }
  };

  const isAdmin = adminWallet?.role === "admin";

  return (
    <Box sx={{ width: "100%" }}>
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          fontWeight: 700,
          color: "text.primary",
        }}
      >
        Report Management
      </Typography>

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
            Submitted Reports
          </Typography>

          <ReportFilters />
        </Box>

        <Divider />

        <ReportTable
          page={page}
          rowsPerPage={rowsPerPage}
          totalCount={pagination?.total || 0}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          onViewDetails={handleViewDetails}
          onVerify={isAdmin ? handleVerifyReport : undefined}
          onDelete={isAdmin ? handleDeleteReport : undefined}
        />
      </Card>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mb: 4 }}>
        <Button variant="outlined" startIcon={<FilterList />}>
          Export Data
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<Add />}
          onClick={handleCreateReport}
        >
          Submit Report
        </Button>
      </Box>

      <ReportDetailsModal
        report={selectedReport}
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        onVerify={isAdmin ? handleVerifyFromDetails : undefined}
      />

      <ReportFormModal
        open={formModalOpen}
        onClose={handleCloseFormModal}
        report={reportToEdit}
      />
    </Box>
  );
};

export default ReportsPage; 