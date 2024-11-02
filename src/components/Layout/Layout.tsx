import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import Box from '@mui/material/Box';

const Layout: React.FC = () => {
  return (
    <>
      <Header />
      <Box
        component={'main'}
        display={'flex'}
        px={2}
        mt={'64px'}
        sx={{ flex: '1 1 auto' }}
        height={'calc(100vh - 80px)'}
        maxWidth={'100vw'}
      >
        <Outlet />
      </Box>
      {/* <BottomTabNavigator /> */}
    </>
  );
};

export default Layout;
