import { Grid, Paper, Typography } from "@mui/material";
import type { GridProps } from "@mui/material";

const DashboardContent = () => {
  return (
    <Grid container spacing={3} sx={{ width: "100%" }}>
      <Grid
        component="div"
        {...({ item: true, xs: 12, md: 6, flex: 1 } as GridProps)}
      >
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            backgroundImage: "none",
            boxShadow: "0px 4px 20px rgba(145, 158, 171, 0.08)",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}
          >
            Recent Activity
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No recent activity to display.
          </Typography>
        </Paper>
      </Grid>

      <Grid
        component="div"
        {...({ item: true, xs: 12, md: 6, flex: 1 } as GridProps)}
      >
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            backgroundImage: "none",
            boxShadow: "0px 4px 20px rgba(145, 158, 171, 0.08)",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}
          >
            Quick Actions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No quick actions available.
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default DashboardContent;
