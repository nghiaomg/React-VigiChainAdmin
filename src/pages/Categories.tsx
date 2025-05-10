import { useEffect } from 'react';
import Categories from '@/components/categories';
import { CategoriesProvider } from '@/contexts/CategoriesContext';

const CategoriesPage = () => {
  useEffect(() => {
    document.title = 'Categories - Admin Portal';
  }, []);

  return (  
    <CategoriesProvider>
      <Categories />
    </CategoriesProvider>
  );
};

export default CategoriesPage;

