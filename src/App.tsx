import { Outlet } from 'react-router-dom';
import MasterLayout from './components/layout/MasterLayouts';

const App = () => {
  return (
    <MasterLayout>
      <Outlet />
    </MasterLayout>
  );
};

export default App;