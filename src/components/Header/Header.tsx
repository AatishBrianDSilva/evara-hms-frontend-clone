// import * as React from 'react';
// import AppBar from '@mui/material/AppBar';
// import Box from '@mui/material/Box';
// import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
// import Typography from '@mui/material/Typography';
// import Menu from '@mui/material/Menu';
// import MenuIcon from '@mui/icons-material/Menu';
// import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
// import Button from '@mui/material/Button';
// import Tooltip from '@mui/material/Tooltip';
// import MenuItem from '@mui/material/MenuItem';
import { PhoneCallbackRounded, Dashboard } from '@mui/icons-material';
import "./headerStyle.css"
// import { Link } from 'react-router-dom';

// const pages = ['Products', 'Pricing', 'Blog'];
// const settings = ['Profile', 'Account', 'Logout'];

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