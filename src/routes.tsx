import { createBrowserRouter } from 'react-router-dom';
import MasterLayouts from '@/components/layout/MasterLayouts';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

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
        ],
      },
    ],
  },
]);

export default router; 