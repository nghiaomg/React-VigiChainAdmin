import { useEffect } from 'react';
import Chains from '@/components/chains/index';
import { ChainsProvider } from '@/contexts/ChainsContext';

const ChainsPage = () => {
  useEffect(() => {
    document.title = 'Chains - Admin Portal';
  }, []);

  return (
    <ChainsProvider>
      <Chains />
    </ChainsProvider>
  );
};

export default ChainsPage; 