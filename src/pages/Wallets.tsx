import { useEffect } from 'react';
import Wallets from '@/components/wallets';

const WalletsPage = () => {
  useEffect(() => {
    document.title = 'Wallets - Admin Portal';
  }, []);

  return (
      <Wallets />
  );
};

export default WalletsPage;

