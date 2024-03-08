import React from 'react';
import './sidebarStyle.css';
import clinicLogo from '../../assets/clinic-logo.png';
import SideBarNavTab from '../SideBarNavTab/SideBarNavTab';
import { patientNavList } from '../../utils/constants';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';

const PatientSidebar: React.FC = () => {

  const navigate = useNavigate();
  const patientId = useSelector((state: RootState) => state.patients.patientId);

  // Create a new array with updated nav items
  const updatedNavList = patientNavList.map((navItem) => ({
    ...navItem,
    path: `/patients/dashboard/${patientId}${navItem.path}`,
    onSelect: () => {
      navigate(`/patients/dashboard/${patientId}${navItem.path}`);
    },
    accordionItems: navItem.accordionItems?.map((accItem) => ({
      ...accItem,
      path: `/patients/dashboard/${patientId}${accItem.path}`,
      onSelect: () => {
        navigate(`/patients/dashboard/${patientId}${accItem.path}`);
      }
    }))
  }));

  return (
    <aside className="sidebar">
      {/* Sidebar content */}
      <div className='clinic-logo'>
        <img src={clinicLogo} alt="logo" />
      </div>
      <div className='sidebar-nav-list'>
        {updatedNavList.map((navItem, index) => (
          <SideBarNavTab
            isAccordion={navItem.isAccordion || false}
            key={index}
            logoSrc={navItem.icon}
            title={navItem.title}
            path={navItem.path}
            onSelect={navItem.onSelect}
            accordionItems={navItem.accordionItems || []}
          />
        ))}
      </div>
    </aside>
  );
};

export default PatientSidebar;

