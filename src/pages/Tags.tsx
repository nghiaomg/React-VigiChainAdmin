import { useEffect } from 'react';
import Tags from '@/components/tags/index';
import { TagsProvider } from '@/contexts/TagsContext';
import { CategoriesProvider } from '@/contexts/CategoriesContext';
  
const TagsPage = () => {
  useEffect(() => {
    document.title = 'Tags - Admin Portal';
  }, []);

  return (
    <TagsProvider>
      <CategoriesProvider>
        <Tags />
      </CategoriesProvider>
    </TagsProvider>
  );
};

export default TagsPage;

