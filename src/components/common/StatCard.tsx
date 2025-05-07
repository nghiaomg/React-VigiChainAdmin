import { Box, Card, CardContent, Typography } from "@mui/material";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

const StatCard = ({ title, value, icon, color }: StatCardProps) => (
  <Card
    elevation={0}
    sx={{
      height: "100%",
      backgroundColor: "background.paper",
      backgroundImage: "none",
      borderRadius: 3,
      p: 1,
      boxShadow: "0px 4px 20px rgba(145, 158, 171, 0.08)",
      transition: "all 0.3s ease-in-out",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0px 8px 25px rgba(145, 158, 171, 0.15)",
      },
    }}
  >
    <CardContent>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Box
          sx={{
            backgroundColor: `${color}15`,
            borderRadius: 2,
            p: 1.5,
            mr: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </Box>
        <Typography
          variant="subtitle1"
          component="div"
          sx={{ fontWeight: 600, color: "text.primary" }}
        >
          {title}
        </Typography>
      </Box>
      <Typography
        variant="h4"
        component="div"
        sx={{ fontWeight: 700, color: "text.primary" }}
      >
        {value}
      </Typography>
    </CardContent>
  </Card>
);

export default StatCard;
