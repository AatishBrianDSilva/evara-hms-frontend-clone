import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useLocation, useNavigate } from 'react-router-dom';
import { Avatar, useTheme } from '@mui/material';
import { Dashboard } from '@mui/icons-material';

const MobileHeader: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();

  // Function to determine if the pathname contains an ID or is root "/"
  const shouldHideBackButton = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean); // Split and remove empty segments
    if (pathSegments.length === 0) return true; // Root path "/"
    // Check if any segment is numeric, assuming IDs are numeric
    return pathSegments.some(segment => !isNaN(Number(segment)));
  };

  const pageNameRaw = location.pathname.split("/").pop() || "Home";
  // If the pageNameRaw is numeric, format it as "Patient ID: [Number]"
  const pageName = !isNaN(Number(pageNameRaw))
    ? `PATIENT ${pageNameRaw}`
    : pageNameRaw.replace(/-/g, " ").toUpperCase();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar sx={{ backgroundColor: 'white' }} position="fixed">
        <Toolbar>
          {shouldHideBackButton() ? (<Avatar className='header-logo' style={{ color: theme.palette.primary.main, backgroundColor: 'transparent' }}>
            <Dashboard />
          </Avatar>) : (
            <IconButton
              size="small"
              edge="start"
              aria-label="back"
              sx={{ mr: 2 }}
              onClick={() => navigate(-1)}
            >
              <ArrowBackIosIcon />
            </IconButton>
          )}
          <Typography variant="inherit" color={theme.palette.primary.main}>
            {pageName}
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default MobileHeader;
