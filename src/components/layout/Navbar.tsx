import { AppBar, Toolbar, IconButton, Typography, Box, Menu, MenuItem, Badge, Avatar, Tooltip, Divider } from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications,
  Mail,
  Search,
  Settings,
  Logout,
  Person,
  AccountBalanceWallet,
} from '@mui/icons-material';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthStore } from '@/store';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { account, logout } = useAuth();
  const { wallet } = useAuthStore();
  const navigate = useNavigate();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
    navigate('/login');
  };

  // Get first letter of the role for avatar
  const avatarLetter = wallet?.role ? wallet.role.charAt(0).toUpperCase() : 'A';
  
  // Format wallet address for display
  const formattedWallet = account ? `${account.slice(0, 6)}...${account.slice(-4)}` : '';

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'background.paper',
        backdropFilter: 'blur(6px)',
        boxShadow: 'none',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
      color="transparent"
    >
      <Toolbar sx={{ minHeight: '70px !important' }}>
        <IconButton
          onClick={onMenuClick}
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            backgroundColor: 'action.hover',
            color: 'text.primary',
            '&:hover': {
              backgroundColor: 'action.selected',
            },
            mr: 2,
          }}
        >
          <MenuIcon />
        </IconButton>

        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            fontWeight: 600,
            background: 'linear-gradient(45deg, #1976d2, #9c27b0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          VigiChain Admin
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton 
            sx={{ 
              width: 40, 
              height: 40, 
              borderRadius: 2,
              backgroundColor: 'action.hover',
              '&:hover': {
                backgroundColor: 'action.selected',
              },
            }}
          >
            <Search />
          </IconButton>

          <IconButton
            sx={{ 
              width: 40, 
              height: 40, 
              borderRadius: 2,
              backgroundColor: 'action.hover',
              '&:hover': {
                backgroundColor: 'action.selected',
              },
            }}
          >
            <Badge badgeContent={4} color="error">
              <Mail />
            </Badge>
          </IconButton>

          <IconButton
            sx={{ 
              width: 40, 
              height: 40, 
              borderRadius: 2,
              backgroundColor: 'action.hover',
              '&:hover': {
                backgroundColor: 'action.selected',
              },
            }}
          >
            <Badge badgeContent={3} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          <Tooltip title="Account settings">
            <IconButton
              onClick={handleMenu}
              sx={{ 
                width: 40, 
                height: 40, 
                borderRadius: 2,
                ml: 1,
                backgroundColor: 'action.hover',
                '&:hover': {
                  backgroundColor: 'action.selected',
                },
              }}
            >
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32,
                  backgroundColor: 'primary.main',
                }}
              >
                {avatarLetter}
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            sx={{
              '& .MuiPaper-root': {
                borderRadius: 2,
                minWidth: 220,
                boxShadow: 'rgb(145 158 171 / 24%) 0px 0px 2px 0px, rgb(145 158 171 / 24%) 0px 16px 32px -4px',
              },
            }}
          >
            <Box sx={{ py: 1.5, px: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" noWrap>
                {wallet?.role === 'admin' ? 'Administrator' : 'User'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                <AccountBalanceWallet fontSize="small" color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2" sx={{ color: 'text.secondary', fontFamily: 'monospace' }} noWrap>
                  {formattedWallet}
                </Typography>
              </Box>
            </Box>
            
            <Divider />
            
            {wallet && (
              <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 1, mx: 1, my: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Reputation Score
                </Typography>
                <Typography variant="subtitle2" fontWeight="bold">
                  {wallet.reputationScore}
                </Typography>
              </Box>
            )}
            
            <MenuItem onClick={handleClose} sx={{ py: 1.5 }}>
              <Person sx={{ mr: 2 }} /> Profile
            </MenuItem>
            <MenuItem onClick={handleClose} sx={{ py: 1.5 }}>
              <Settings sx={{ mr: 2 }} /> Settings
            </MenuItem>
            <Box sx={{ borderTop: 1, borderColor: 'divider', mt: 1 }}>
              <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: 'error.main' }}>
                <Logout sx={{ mr: 2 }} /> Logout
              </MenuItem>
            </Box>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
