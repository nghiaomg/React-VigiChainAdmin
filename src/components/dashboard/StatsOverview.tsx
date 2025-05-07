import { Grid } from "@mui/material";
import type { GridProps } from "@mui/material";
import { TrendingUp, People, Security, Assessment } from "@mui/icons-material";
import StatCard from "../common/StatCard";

const StatsOverview = () => {
  return (
    <Grid container spacing={3} sx={{ mb: 3, width: "100%" }}>
      <Grid
        component="div"
        {...({ item: true, xs: 12, sm: 6, md: 3, flex: 1 } as GridProps)}
      >
        <StatCard
          title="Total Users"
          value="1,234"
          icon={<People sx={{ color: "#1976d2", fontSize: 24 }} />}
          color="#1976d2"
        />
      </Grid>
      <Grid
        component="div"
        {...({ item: true, xs: 12, sm: 6, md: 3, flex: 1 } as GridProps)}
      >
        <StatCard
          title="Active Sessions"
          value="89"
          icon={<Security sx={{ color: "#2e7d32", fontSize: 24 }} />}
          color="#2e7d32"
        />
      </Grid>
      <Grid
        component="div"
        {...({ item: true, xs: 12, sm: 6, md: 3, flex: 1 } as GridProps)}
      >
        <StatCard
          title="Total Reports"
          value="456"
          icon={<Assessment sx={{ color: "#ed6c02", fontSize: 24 }} />}
          color="#ed6c02"
        />
      </Grid>
      <Grid
        component="div"
        {...({ item: true, xs: 12, sm: 6, md: 3, flex: 1 } as GridProps)}
      >
        <StatCard
          title="Growth Rate"
          value="+12.5%"
          icon={<TrendingUp sx={{ color: "#9c27b0", fontSize: 24 }} />}
          color="#9c27b0"
        />
      </Grid>
    </Grid>
  );
};

export default StatsOverview;
