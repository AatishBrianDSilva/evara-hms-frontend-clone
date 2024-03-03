import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Dashboard from '@mui/icons-material/Dashboard';
import AppsIcon from '@mui/icons-material/Apps';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Grid } from '@mui/material';
import { DateRangeIcon } from '@mui/x-date-pickers';
import { Analytics, Diversity1, Diversity3, LocalPharmacy, Settings } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const DesktopHeader: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [appsAnchorEl, setAppsAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigation = useNavigate();

  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAppsMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAppsAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setAppsAnchorEl(null);
  };

  const handleAppsMenuNavigation = (path: string) => {
    navigation(path);
    setAppsAnchorEl(null);
  }

  const accountMenuId = 'desktop-header-account-menu';
  const appsMenuId = 'desktop-header-apps-menu';

  const renderAccountMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      id={accountMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const renderAppsMenu = (
    <Menu
      anchorEl={appsAnchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      id={appsMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(appsAnchorEl)}
      onClose={handleMenuClose}
    >
      <Grid container columnSpacing={1} rowSpacing={4} py={4}>
        {/* Example grid items, replace with your actual app icons and functionality */}
        <Grid item display={"flex"} flexDirection={"column"} md={6} lg={4}>
          <IconButton sx={{ color: 'gray', width: 'fit-content', margin: 'auto' }} onClick={() => handleAppsMenuNavigation("/")}>
            <Dashboard />
          </IconButton>
          <Typography variant="caption" align="center">
            Dashboard
          </Typography>
        </Grid>
        <Grid item display={"flex"} flexDirection={"column"} md={6} lg={4}>
          <IconButton sx={{ color: 'gray', width: 'fit-content', margin: 'auto' }} onClick={() => handleAppsMenuNavigation("/ivf-registration")}>
            <PersonAddIcon />
          </IconButton>
          <Typography variant="caption" align="center">
            Registration
          </Typography>
        </Grid>
        <Grid item display={"flex"} flexDirection={"column"} md={6} lg={4}>
          <IconButton sx={{ color: 'gray', width: 'fit-content', margin: 'auto' }}>
            <DateRangeIcon />
          </IconButton>
          <Typography variant="caption" align="center">
            Appointments
          </Typography>
        </Grid>
        <Grid item display={"flex"} flexDirection={"column"} md={6} lg={4}>
          <IconButton sx={{ color: 'gray', width: 'fit-content', margin: 'auto' }}>
            <LocalPharmacy />
          </IconButton>
          <Typography variant="caption" align="center">
            Pharmacy
          </Typography>
        </Grid>
        <Grid item display={"flex"} flexDirection={"column"} md={6} lg={4}>
          <IconButton sx={{ color: 'gray', width: 'fit-content', margin: 'auto' }}>
            <Analytics />
          </IconButton>
          <Typography variant="caption" align="center">
            Analytics
          </Typography>
        </Grid>
        <Grid item display={"flex"} flexDirection={"column"} md={6} lg={4}>
          <IconButton sx={{ color: 'gray', width: 'fit-content', margin: 'auto' }}>
            <Settings />
          </IconButton>
          <Typography variant="caption" align="center">
            Admin
          </Typography>
        </Grid>
        <Grid item display={"flex"} flexDirection={"column"} md={6} lg={4}>
          <IconButton sx={{ color: 'gray', width: 'fit-content', margin: 'auto' }}>
            <Diversity3 />
          </IconButton>
          <Typography variant="caption" align="center">
            Donors
          </Typography>
        </Grid>
        <Grid item display={"flex"} flexDirection={"column"} md={6} lg={4}>
          <IconButton sx={{ color: 'gray', width: 'fit-content', margin: 'auto' }} onClick={() => handleAppsMenuNavigation("/patients")}>
            <Diversity1 />
          </IconButton>
          <Typography variant="caption" align="center">
            Patients
          </Typography>
        </Grid>
      </Grid>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar variant='dense'>
          <IconButton
            size="small"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <Dashboard />
          </IconButton>
          <Typography
            variant="h5"
            noWrap
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            Evara
          </Typography>

          <Box sx={{ flexGrow: 1 }} />
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search patients…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton size="large" aria-label="show 4 new mails" color="inherit">
              <Badge badgeContent={4} color="secondary">
                <MailIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={17} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-label="open-apps-drawer"
              aria-controls={appsMenuId}
              aria-haspopup="true"
              onClick={handleAppsMenuOpen}
              color="inherit"
            >
              <AppsIcon />
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={accountMenuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderAccountMenu}
      {renderAppsMenu}
    </Box>
  );
}


export default DesktopHeader;