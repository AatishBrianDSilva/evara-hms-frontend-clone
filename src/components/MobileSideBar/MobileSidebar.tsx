import React from 'react'
import { navList } from '../../utils/constants'
import clinicLogo from '../../assets/clinic-logo.png'
import SideBarNavTab from '../SideBarNavTab/SideBarNavTab'
import { useNavigate } from 'react-router-dom'

const MobileSidebar: React.FC = () => {
  const navigate = useNavigate();

  for (let navItem of navList) {
    navItem.onSelect = () => navigate(navItem.path);
  }

  return (
    <div className='main-container'>
      <div className='clinic-logo'>
        <img src={clinicLogo} alt="logo" />
      </div>
      <div className='sidebar-nav-list'>
        {navList.map((navItem, index) => (
          <SideBarNavTab
            key={index}
            logoSrc={navItem.icon}
            title={navItem.title}
            path={navItem.path}
            onSelect={navItem.onSelect}
          />
        ))}
      </div>
    </div>
  )
}

export default MobileSidebar