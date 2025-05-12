import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Collapse,
  alpha,
} from "@mui/material";
import {
  Dashboard,
  Category,
  AccountBalanceWallet,
  LocalOffer,
  ExpandLess,
  ExpandMore,
  Report,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  drawerWidth: number;
}

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  { text: "Dashboard", icon: <Dashboard />, path: "/" },
  { text: "Categories", icon: <Category />, path: "/categories" },
  { text: "Wallets", icon: <AccountBalanceWallet />, path: "/wallets" },
  { text: "Tags", icon: <LocalOffer />, path: "/tags" },
  { text: "Reports", icon: <Report />, path: "/reports" },
];;

const Sidebar = ({ open, onClose, drawerWidth }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const handleItemClick = (item: MenuItem) => {
    if (item.children) {
      setExpandedItems((prev) =>
        prev.includes(item.text)
          ? prev.filter((i) => i !== item.text)
          : [...prev, item.text]
      );
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const renderMenuItem = (item: MenuItem, depth = 0) => {
    const isSelected = item.path === location.pathname;
    const isExpanded = expandedItems.includes(item.text);

    return (
      <Box key={item.text}>
        <ListItem
          disablePadding
          sx={{
            display: "block",
            mb: 0.5,
          }}
        >
          <ListItemButton
            onClick={() => handleItemClick(item)}
            sx={{
              minHeight: 48,
              px: 2.5,
              py: 1,
              ml: depth * 2,
              borderRadius: 2,
              backgroundColor: isSelected
                ? (theme) => alpha(theme.palette.primary.main, 0.1)
                : "transparent",
              color: isSelected ? "primary.main" : "text.primary",
              "&:hover": {
                backgroundColor: (theme) =>
                  alpha(theme.palette.primary.main, 0.08),
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 36,
                color: isSelected ? "primary.main" : "inherit",
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                fontSize: 14,
                fontWeight: isSelected ? 600 : 400,
              }}
            />
            {item.children && (isExpanded ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>
        </ListItem>
        {item.children && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map((child) => renderMenuItem(child, depth + 1))}
            </List>
          </Collapse>
        )}
      </Box>
    );
  };

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        width: open ? drawerWidth : 0,
        flexShrink: 0,
        display: open ? 'block' : 'none',
        transition: (theme) =>
          theme.transitions.create(['width', 'display'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        "& .MuiDrawer-paper": {
          width: open ? drawerWidth : 0,
          boxSizing: "border-box",
          borderRight: "1px dashed",
          borderColor: "divider",
          backgroundColor: "background.default",
          marginTop: "70px",
          paddingX: 2,
          paddingTop: 2,
          transition: (theme) =>
            theme.transitions.create(['width', 'display'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          overflowX: "hidden",
          display: open ? 'block' : 'none',
        },
      }}
    >
      <List>{menuItems.map((item) => renderMenuItem(item))}</List>
    </Drawer>
  );
};

export default Sidebar;