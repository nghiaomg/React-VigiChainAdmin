import { Box, Typography } from "@mui/material";
import StatsOverview from "@/components/dashboard/StatsOverview";
import DashboardContent from "@/components/dashboard/DashboardContent";

const Dashboard = () => {
  return (
    <Box sx={{ width: "100%", backgroundColor: "red" }}>
      <Typography
        variant="h4"
        sx={{
          mb: 5,
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
