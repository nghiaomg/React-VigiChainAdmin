import { Box, Typography } from "@mui/material";
import StatsOverview from "@/components/dashboard/StatsOverview";
import DashboardContent from "@/components/dashboard/DashboardContent";

const Dashboard = () => {
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
        Dashboard
      </Typography>

      <StatsOverview />
      <DashboardContent />
    </Box>
  );
};

export default Dashboard;
