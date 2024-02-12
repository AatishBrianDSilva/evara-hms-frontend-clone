import React, { useState } from 'react';
import './sidebarNavTabStyle.css'; // This is where you'll put the CSS
import { Avatar, SvgIconTypeMap, useTheme } from '@mui/material';
import { ChevronRight, ChevronLeftOutlined } from '@mui/icons-material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { useLocation } from 'react-router-dom';
import { navListType } from '../../utils/types';

interface SideBarNavTabProps {
  isAccordion: boolean; // Whether this tab is an accordion tab
  accordionItems: navListType[] | undefined; // The list of items to show in the accordion
  logoSrc: OverridableComponent<SvgIconTypeMap<{}, "svg">> | null; // The material icon component for the logo
  title: string; // The text title for the tab
  path: string; // The path to navigate to when this tab is selected
  onSelect: () => void; // The function to call when this tab is selected
}

const SideBarNavTab: React.FC<SideBarNavTabProps> = ({ logoSrc, title, path, onSelect, isAccordion, accordionItems }) => {

  const location = useLocation();
  const theme = useTheme();

  const isSelected = location.pathname === path;

  const iconColor = isSelected ? theme.palette.primary.main : '#3E4954';

  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const toggleAccordion = () => {
    setIsAccordionOpen(!isAccordionOpen);
  };

  const renderAccordionContent = () => {
    return accordionItems?.map((item, index) => {
      const isAccSelected = location.pathname === item.path;
      return (
        <button key={index} className={`sidebar-nav-tab-accordion ${isAccSelected ? 'selected' : ''}`} onClick={item.onSelect}>
          <div className='left-items'>
            {item.icon && (<Avatar sx={{ color: iconColor, height: '24px', width: '24px', bgcolor: 'transparent' }} alt='Right arrow'>
              {React.createElement(item.icon)}
            </Avatar>)}

            <span className={`title ${isAccSelected ? 'selected' : ''}`}>{item.title}</span>
          </div>
        </button>
      )
    });
  };

  const renderAccordionTab = () => {
    return (
      <>
        <button className={`sidebar-nav-tab ${isSelected ? 'selected' : ''}`} onClick={toggleAccordion}>
          <div className='left-items'>
            {logoSrc && (<Avatar sx={{ color: iconColor, height: '24px', width: '24px', bgcolor: 'transparent' }} alt='Logo'>
              {React.createElement(logoSrc)}
            </Avatar>)}

            <span className={`title ${isSelected ? 'selected' : ''}`}>{title}</span>
          </div>

          <div className='right-items'>
            <Avatar sx={{ color: iconColor, height: '24px', width: '24px', bgcolor: 'transparent' }} alt='Accordion toggle'>
              {isAccordionOpen ? <ChevronLeftOutlined /> : <ChevronRight />}
            </Avatar>
          </div>
        </button>
        {isAccordionOpen && (
          <div className="accordion-content">
            {renderAccordionContent()}
          </div>
        )}
      </>
    )
  };

  const renderNormalTab = () => {
    return (
      <button className={`sidebar-nav-tab ${isSelected ? 'selected' : ''}`} onClick={onSelect}>
        <div className='left-items'>
          {logoSrc && (<Avatar sx={{ color: iconColor, height: '24px', width: '24px', bgcolor: 'transparent' }} alt='Right arrow'>
            {React.createElement(logoSrc)}
          </Avatar>)}

          <span className={`title ${isSelected ? 'selected' : ''}`}>{title}</span>
        </div>

        <div className='right-items'>
          <Avatar sx={{ color: iconColor, height: '24px', width: '24px', bgcolor: 'transparent' }} alt='Right arrow'>
            <ChevronRight />
          </Avatar>
        </div>
      </button>
    )
  }

  if (!isAccordion) {
    return renderNormalTab();
  }

  return renderAccordionTab();
};

export default SideBarNavTab;
