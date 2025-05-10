import { useEffect } from 'react';
import Wallets from '@/components/wallets';
import { WalletsProvider } from '@/contexts/WalletsContext';

const WalletsPage = () => {
  useEffect(() => {
    document.title = 'Wallets - Admin Portal';
  }, []);

  return (
    <WalletsProvider>
      <Wallets />
    </WalletsProvider>
  );
};

export default WalletsPage;

