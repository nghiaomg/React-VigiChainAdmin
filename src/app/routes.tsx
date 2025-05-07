import { createBrowserRouter } from 'react-router-dom';
import App from '@/App';
import Home from '@/pages/Dashboard';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />
      },
      // Add more routes here
    ]
  }
]);
