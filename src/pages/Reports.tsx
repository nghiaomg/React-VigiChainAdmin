import { useEffect } from 'react';
import Reports from '@/components/reports/index';
import { ReportsProvider } from '@/contexts/ReportsContext';
  
const ReportsPage = () => {
  useEffect(() => {
    document.title = 'Reports - Admin Portal';
  }, []);

  return (
    <ReportsProvider>
      <Reports />
    </ReportsProvider>
  );
};

export default ReportsPage;