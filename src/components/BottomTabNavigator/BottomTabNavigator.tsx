import React, { useEffect, useState } from 'react';
import { BottomNavigation, BottomNavigationAction, Paper, useMediaQuery, useTheme } from '@mui/material';
import { Home, Call, HealingSharp, AccountCircleOutlined, MoreHoriz } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { openMoreModal } from '../../features/More/moreSlice';
import More from '../../features/More/More';
import { RootState } from '../../app/store';

interface NavItem {
  value?: string;
  label: string;
  icon: React.ReactElement;
  modal?: string;
}

const BottomTabNavigator: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const theme = useTheme()

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const patientId = useSelector((state: RootState) => state.patients.selectedPatientId);

  const [value, setValue] = useState(location.pathname);

  useEffect(() => {
    setValue(location.pathname);
  }, [location]);

  const patientDashboardNavItems: NavItem[] = [
    { value: `/patients/dashboard/${patientId}`, label: 'Home', icon: <Home /> },
    { value: `/patients/dashboard/${patientId}/treatment/treatment-cycle`, label: 'Treatment', icon: <HealingSharp /> },
    { value: `/patients/dashboard/${patientId}/demographics`, label: 'Patient', icon: <AccountCircleOutlined /> },
    { label: 'More', icon: <MoreHoriz />, modal: "patient" },
  ];

  const generalNavItems: NavItem[] = [
    { value: "/", label: "Home", icon: <Home /> },
    { value: "/support", label: "Support", icon: <Call /> },
    { value: "/profile", label: "Profile", icon: <AccountCircleOutlined /> },
    { label: 'More', icon: <MoreHoriz />, modal: "home" },
  ];

  const navItems = location.pathname.startsWith("/patients/dashboard") ? patientDashboardNavItems : generalNavItems;

  if (!isMobile) {
    return null; // Do not render this component on non-mobile devices
  }

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 2 }} elevation={3}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(_, newValue) => {
          const selectedItem = navItems.find(item => item.value === newValue || item.label === newValue);
          if (selectedItem?.modal) {
            dispatch(openMoreModal(selectedItem.modal));
          } else if (selectedItem?.value) {
            setValue(newValue);
            navigate(newValue);
          }
        }}
      >
        {navItems.map(({ value, label, icon, modal }) => (
          <BottomNavigationAction key={label} value={value || label} label={label} icon={icon} onClick={modal ? () => dispatch(openMoreModal(modal)) : undefined} />
        ))}
      </BottomNavigation>
      <More />
    </Paper>
  );
};

export default BottomTabNavigator;
