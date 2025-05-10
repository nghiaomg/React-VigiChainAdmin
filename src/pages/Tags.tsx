import { useEffect } from 'react';
import Tags from '@/components/tags/index';
import { TagsProvider } from '@/contexts/TagsContext';
  
const TagsPage = () => {
  useEffect(() => {
    document.title = 'Tags - Admin Portal';
  }, []);

  return (
    <TagsProvider>
      <Tags />
    </TagsProvider>
  );
};

export default TagsPage;

