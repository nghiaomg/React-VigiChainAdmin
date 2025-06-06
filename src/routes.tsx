import { createBrowserRouter } from 'react-router-dom';
import MasterLayouts from '@/components/layout/MasterLayouts';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import WalletsPage from './components/wallets';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import TagsPage from './pages/Tags';
import CategoriesPage from '@/pages/Categories';
import ReportsPage from '@/pages/Reports';
import ChainsPage from '@/pages/Chains';

const RootLayout = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/',
        element: (
          <ProtectedRoute>
            <MasterLayouts>
              <Outlet />
            </MasterLayouts>
          </ProtectedRoute>
        ),
        children: [
          {
            path: 'dashboard',
            element: <Dashboard />,
          },
          {
            path: 'wallets',
            element: <WalletsPage />,
          },
          {
            path: 'tags',
            element: <TagsPage />,
          },
          {
            path: 'categories',
            element: <CategoriesPage />,
          },
          {
            path: 'reports',
            element: <ReportsPage />,
          },
          {
            path: 'chains',
            element: <ChainsPage />,
          },
        ],
      },
    ],
  },
]);

export default router; 