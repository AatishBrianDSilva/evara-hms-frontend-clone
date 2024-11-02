import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import { NestedListItem } from '../../../components/SideBar/NestedList';
import MasterSidebar from '../../../components/SideBar/MasterSidebar';

const Global = () => {
  const menuItems: NestedListItem[] = [
    {
      icon: CorporateFareIcon,
      primaryText: 'Branch',
      path: '/master/global/branch',
    },
    {
      icon: CorporateFareIcon,
      primaryText: 'Consultant Doctors',
      path: '/master/global/doctors',
    },
    {
      icon: CorporateFareIcon,
      primaryText: 'Users',
      path: '/master/global/user',
    },
  ];

  return (
    <Box display={'flex'} flex={1} overflow={'auto'}>
      <MasterSidebar menuItems={menuItems} heading={'Global'} />

      <Box
        display={'flex'}
        flex={'1 1 auto'}
        flexDirection={'column'}
        overflow={'auto'}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Global;
