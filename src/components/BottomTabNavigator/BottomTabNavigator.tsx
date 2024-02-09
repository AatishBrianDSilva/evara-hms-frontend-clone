import { BottomNavigation, BottomNavigationAction, Paper, useMediaQuery } from '@mui/material'
import React, { useEffect } from 'react'

import { Home, Call, HealingSharp, AccountCircleOutlined, MoreHoriz } from '@mui/icons-material';
import { Location, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { openMoreModal } from '../../features/More/moreSlice';
import More from '../../features/More/More';
import { RootState } from '../../app/store';


const BottomTabNavigator: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 600px)');
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [value, setValue] = React.useState(location.pathname);
  const patientId = useSelector((state: RootState) => state.patients.selectedPatientId);

  useEffect(() => {
    // Update the current value based on location changes
    const handleLocationChange = (location: Location<any>) => {
      setValue(location.pathname);
    };

    // Listen for location changes
    handleLocationChange(location);
    // Optionally, listen for changes in history if using react-router's history to manage navigation
  }, [location]);

  if (isMobile && location.pathname.startsWith("/patients/dashboard")) {
    return (
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(_, newValue) => {
            setValue(newValue);
            navigate(newValue);
          }}
        >
          <BottomNavigationAction value={`/patients/dashboard/${patientId}`} label="Home" icon={<Home />} />
          <BottomNavigationAction value={`/patients/dashboard/${patientId}/treatment/treatment-cycle`} label="Treatment" icon={<HealingSharp />} />
          <BottomNavigationAction value={`/patients/dashboard/${patientId}/demographics`} label="Patient" icon={<AccountCircleOutlined />} />
          <BottomNavigationAction onClick={() => dispatch(openMoreModal("patient"))} label="More" icon={<MoreHoriz />} />
        </BottomNavigation>
        <More />
      </Paper>
    )
  }
  else if (isMobile) {
    return (
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(_, newValue) => {
            setValue(newValue);
            navigate(newValue);
          }}
        >
          <BottomNavigationAction value={"/"} label="Home" icon={<Home />} />
          <BottomNavigationAction value={"/support"} label="Support" icon={<Call />} />
          <BottomNavigationAction value={"/profile"} label="Profile" icon={<AccountCircleOutlined />} />
          <BottomNavigationAction onClick={() => dispatch(openMoreModal("home"))} label="More" icon={<MoreHoriz />} />
        </BottomNavigation>
        <More />
      </Paper>
    )
  }
}

export default BottomTabNavigator