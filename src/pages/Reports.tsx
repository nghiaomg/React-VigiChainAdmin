import { useEffect } from 'react';
import Reports from '@/components/reports/index';
import { ReportsProvider } from '@/contexts/ReportsContext';
import { TagsProvider } from '@/contexts/TagsContext';
  
const ReportsPage = () => {
  useEffect(() => {
    document.title = 'Reports - Admin Portal';
  }, []);

  return (
    <ReportsProvider>
      <TagsProvider>
          <Reports />
      </TagsProvider>
    </ReportsProvider>
  );
};

export default ReportsPage;