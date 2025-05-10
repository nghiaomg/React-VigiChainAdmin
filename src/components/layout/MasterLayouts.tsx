import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { useState, useMemo } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface MasterLayoutProps {
  children: React.ReactNode;
}

const drawerWidth = 280;

const MasterLayouts = ({ children }: MasterLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: "light",
          primary: {
            main: "#1976d2",
            light: "#42a5f5",
            dark: "#1565c0",
          },
          secondary: {
            main: "#9c27b0",
            light: "#ba68c8",
            dark: "#7b1fa2",
          },
          background: {
            default: "#f8f9fa",
            paper: "#ffffff",
          },
        },
        typography: {
          fontFamily: "'Inter', sans-serif",
        },
        shape: {
          borderRadius: 8,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: "none",
                borderRadius: 8,
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: "none",
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                backgroundImage: "none",
              },
            },
          },
        },
      }),
    []
  );

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          backgroundColor: "background.default",
        }}
      >
        <CssBaseline />
        <Navbar onMenuClick={toggleSidebar} />
        <Sidebar
          open={sidebarOpen}
          onClose={toggleSidebar}
          drawerWidth={drawerWidth}
        />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: `calc(100% - ${sidebarOpen ? drawerWidth : 0}px)`,
            marginLeft: 0,
            marginTop: "70px",
            transition: theme.transitions.create(["width", "margin"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }}
        >
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default MasterLayouts;
