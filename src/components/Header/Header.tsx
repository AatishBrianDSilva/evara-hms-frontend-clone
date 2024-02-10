
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import { PhoneCallbackRounded, Dashboard } from '@mui/icons-material';
import "./headerStyle.css"

const Header = () => {

  return (
    <header className="header">
      <div className="header-toolbar">
        <div className="header-logo-area">
          <Avatar className='header-logo' style={{ color: '#3B4CB8' }}>
            <Dashboard />
          </Avatar>
          <h1 className='header-logo-text'>HMS</h1>
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