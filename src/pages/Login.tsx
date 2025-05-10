import React, { useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LockIcon from '@mui/icons-material/Lock';
import { useAuth } from '../contexts/AuthContext';
import { useAuthStore } from '@/store';

const Login: React.FC = () => {
  const { login, isLoading, error, account } = useAuth();
  const { isAuthenticated, wallet, isNewAccount } = useAuthStore();

  useEffect(() => {
    if (account) {
      console.log('MetaMask connected:', account);
      console.log('Server authenticated:', isAuthenticated);
    }
  }, [account, isAuthenticated, isNewAccount]);

  const handleConnectWallet = async () => {
    try {
      await login();
    } catch (err) {
      // Error is handled by the AuthProvider
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={4}
          sx={{
            p: 4,
            width: '100%',
            borderRadius: 3,
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
            <AdminPanelSettingsIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h4" component="h1" fontWeight="bold">
              Admin Portal
            </Typography>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: 1,
            mb: 4, 
            p: 1, 
            borderRadius: 1, 
            bgcolor: 'error.light',
            color: 'error.contrastText'
          }}>
            <LockIcon fontSize="small" />
            <Typography variant="body2" fontWeight="medium">
              ADMIN ACCESS ONLY
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {account && !isAuthenticated && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              Wallet connected. Admin verification required.
            </Alert>
          )}

          {isAuthenticated && isNewAccount && (
            <Alert severity="info" sx={{ mb: 3 }}>
              Admin account created successfully.
            </Alert>
          )}

          {isAuthenticated && !isNewAccount && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Admin verified. Redirecting to dashboard...
            </Alert>
          )}

          <Button
            variant="contained"
            size="large"
            startIcon={<AccountBalanceWalletIcon />}
            onClick={handleConnectWallet}
            disabled={isLoading}
            fullWidth
            sx={{
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1.1rem',
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2 30%, #00BCD4 90%)',
              },
              mb: 3
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : account ? (
              isAuthenticated ? 'Access Admin Dashboard' : 'Verify Admin Access'
            ) : (
              'Connect Admin Wallet'
            )}
          </Button>

          {account && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Connected: {account.slice(0, 6)}...{account.slice(-4)}
              </Typography>
              {wallet && (
                <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center', gap: 1 }}>
                  <Chip 
                    size="small" 
                    color="error" 
                    icon={<AdminPanelSettingsIcon />}
                    label={`Role: ${wallet.role}`} 
                  />
                  {wallet.reputationScore !== undefined && (
                    <Chip 
                      size="small" 
                      color="success" 
                      label={`Score: ${wallet.reputationScore}`} 
                    />
                  )}
                </Box>
              )}
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 