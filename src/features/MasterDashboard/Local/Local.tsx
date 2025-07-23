import { Box } from '@mui/material';
import MasterSidebar from '../../../components/SideBar/MasterSidebar';
import { Outlet } from 'react-router-dom';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { NestedListItem } from '../../../components/SideBar/NestedList';

const Local = () => {
  const menuItems: NestedListItem[] = [
    {
      icon: CorporateFareIcon,
      primaryText: 'Patients',
      children: [
        {
          icon: FiberManualRecordIcon,
          primaryText: 'Referral Doctor',
          path: '/master/local/patient/referral-doctor',
        },
        {
          icon: FiberManualRecordIcon,
          primaryText: 'ID Type',
          path: '/master/local/patient/id-type',
        },
        {
          icon: FiberManualRecordIcon,
          primaryText: 'Source',
          path: '/master/local/patient/source',
        },
      ],
    },

    {
      icon: CorporateFareIcon,
      primaryText: 'Appointments',

      children: [
        {
          icon: FiberManualRecordIcon,
          primaryText: ' Reason ',
          path: '/master/local/appointment/reason',
        },
        {
          icon: FiberManualRecordIcon,
          primaryText: ' Source',
          path: '/master/local/appointment/source',
        },
      ],
    },
    {
      icon: CorporateFareIcon,
      primaryText: 'Consents',

      path: '/master/local/consents',
    },
    // {
    //   icon: CorporateFareIcon,
    //   primaryText: "Cryo Parameters",

    //   path: "/master/local/cryo-parameters",
    // },
    {
      icon: CorporateFareIcon,
      primaryText: 'Consultant Doctors ',

      path: '/master/local/consultant-doctors',
    },
    // {
    //   icon: CorporateFareIcon,
    //   primaryText: "Roles",
    //   path: "/master/local/roles",
    // },
    // {
    //   icon: CorporateFareIcon,
    //   primaryText: "Discounts",

    //   path: "",
    // },
    // {
    //   icon: CorporateFareIcon,
    //   primaryText: "Reports",

    //   path: "/master/local/reports",
    // },

    {
      icon: CorporateFareIcon,
      primaryText: 'Notes',
      children: [
        {
          icon: FiberManualRecordIcon,
          primaryText: 'Advice',
          path: '/master/local/notes/advice',
        },
        {
          icon: FiberManualRecordIcon,
          primaryText: 'Observation',
          path: '/master/local/notes/observation',
        },
      ],
    },
    {
      icon: CorporateFareIcon,
      primaryText: 'Donors',

      path: '/master/local/donors',
    },
    {
      icon: CorporateFareIcon,
      primaryText: 'Patient List',

      path: '/master/local/patient-list',
    },
  ];

  return (
    <Box display={'flex'} flex={1} overflow={'auto'}>
      <MasterSidebar menuItems={menuItems} heading={'Local'} />

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

export default Local;
