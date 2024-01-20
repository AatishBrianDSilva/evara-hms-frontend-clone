import { BottomNavigation, BottomNavigationAction, Paper, useMediaQuery } from '@mui/material'
import React from 'react'

import { Home, Call, AccountCircleOutlined, MoreHoriz } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';


const BottomTabNavigator: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 600px)');
  const navigate = useNavigate();

  const [value, setValue] = React.useState(0);

  return (
    <>
      {isMobile && (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
          <BottomNavigation
            showLabels
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
          >
            <BottomNavigationAction label="Home" icon={<Home />} onClick={() => navigate("/")} />
            <BottomNavigationAction label="Support" icon={<Call />} />
            <BottomNavigationAction label="Profile" icon={<AccountCircleOutlined />} />
            <BottomNavigationAction label="More" icon={<MoreHoriz />} onClick={() => navigate("/more")} />
          </BottomNavigation>
        </Paper>
      )}
    </>
  );
}

export default BottomTabNavigator