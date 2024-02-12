
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import { PhoneCallbackRounded, Dashboard } from '@mui/icons-material';
import "./headerStyle.css"
import { Typography, useTheme } from '@mui/material';

const Header = () => {

  const theme = useTheme()
  return (
    <header className="header">
      <div className="header-toolbar">
        <div className="header-logo-area">
          <Avatar className='header-logo' sx={{ color: theme.palette.primary.main }}>
            <Dashboard />
          </Avatar>
          <Typography variant='h4' fontWeight={'bold'} sx={{ color: theme.palette.primary.main }} >HMS</Typography>
        </div>
        <div className="header-right-section">
          <IconButton sx={{ p: 0 }}>
            <Avatar>
              <PhoneCallbackRounded />
            </Avatar>
          </IconButton>
          <div className="header-user-settings">
            <IconButton sx={{ p: 0 }}>
              <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
            </IconButton>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;