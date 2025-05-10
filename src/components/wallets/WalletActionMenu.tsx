import {
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';

interface WalletActionMenuProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onViewDetails: () => void;
  onSetHighReputation: () => void;
  onSetLowReputation: () => void;
  onBlockWallet: () => void;
}

const WalletActionMenu = ({
  anchorEl,
  onClose,
  onViewDetails,
  onSetHighReputation,
  onSetLowReputation,
  onBlockWallet,
}: WalletActionMenuProps) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <MenuItem onClick={onViewDetails}>
        View Details
      </MenuItem>
      <MenuItem onClick={onSetHighReputation}>
        Set High Reputation
      </MenuItem>
      <MenuItem onClick={onSetLowReputation}>
        Set Low Reputation
      </MenuItem>
      <Divider />
      <MenuItem 
        onClick={onBlockWallet}
        sx={{ color: 'error.main' }}
      >
        Block Wallet
      </MenuItem>
    </Menu>
  );
};

export default WalletActionMenu; 