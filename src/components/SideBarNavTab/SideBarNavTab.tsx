import React from 'react';
import './sidebarNavTabStyle.css'; // This is where you'll put the CSS
import { Avatar, SvgIconTypeMap } from '@mui/material';
import { ChevronRight } from '@mui/icons-material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { useLocation } from 'react-router-dom';

interface SideBarNavTabProps {
  logoSrc: OverridableComponent<SvgIconTypeMap<{}, "svg">>; // The material icon component for the logo
  title: string; // The text title for the tab
  path: string; // The path to navigate to when this tab is selected
  onSelect: () => void; // The function to call when this tab is selected
}

const SideBarNavTab: React.FC<SideBarNavTabProps> = ({ logoSrc, title, path, onSelect }) => {

  const location = useLocation();
  const isSelected = location.pathname === path;

  const iconColor = isSelected ? '#3B4CB8' : '#3E4954';

  return (
    <button className={`sidebar-nav-tab ${isSelected ? 'selected' : ''}`} onClick={onSelect}>
      <div className='left-items'>
        <Avatar sx={{ color: iconColor, height: '24px', width: '24px', bgcolor: 'transparent' }} alt='Right arrow'>
          {React.createElement(logoSrc)}
        </Avatar>
        <span className={`title ${isSelected ? 'selected' : ''}`}>{title}</span>
      </div>

      <div className='right-items'>
        <Avatar sx={{ color: iconColor, height: '24px', width: '24px', bgcolor: 'transparent' }} alt='Right arrow'>
          <ChevronRight />
        </Avatar>
      </div>
    </button>
  );
};

export default SideBarNavTab;
