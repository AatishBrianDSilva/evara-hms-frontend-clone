import React from 'react'
import { navList, patientNavList } from '../../utils/constants'
import clinicLogo from '../../assets/clinic-logo.png'
import SideBarNavTab from '../../components/SideBarNavTab/SideBarNavTab'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useDispatch, useSelector } from 'react-redux'
import { closeMoreModal } from './moreSlice'
import { RootState } from '../../app/store'

const More: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMoreModalOpen = true;
  const modalType = 'patient';

  const patientId = useSelector((state: RootState) => state.patients.patientId);
  const currentNavList = modalType === "patient" ? patientNavList : navList;

  const updatedNavList = currentNavList.map((navItem) => {
    const updatedPath = modalType === "patient" ? `/patients/dashboard/${patientId}${navItem.path}` : navItem.path;
    return {
      ...navItem,
      path: updatedPath,
      onSelect: () => {
        navigate(updatedPath);
        dispatch(closeMoreModal());
      },
      isAccordion: !!navItem.accordionItems,
      logoSrc: navItem.icon,
      accordionItems: navItem.accordionItems?.map((accItem) => ({
        ...accItem,
        path: `/patients/dashboard/${patientId}${accItem.path}`,
        onSelect: () => {
          navigate(`/patients/dashboard/${patientId}${accItem.path}`);
          dispatch(closeMoreModal());
        }
      }))
    };
  });

  return (
    <Modal
      open={isMoreModalOpen}
      onClose={() => dispatch(closeMoreModal())}
      aria-labelledby="more-modal-title"
      aria-describedby="more-modal-description"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Box
        sx={{
          width: '100%', // Takes full width
          height: '100%', // Takes full height
          maxHeight: '60vh', // Adjusts max height to ensure it doesn't overflow the viewport
          overflow: 'auto', // Adds scroll to the content if overflow
          borderRadius: '10px', // Rounded borders
          bgcolor: 'background.paper', // Background color from theme
          boxShadow: 24, // Shadow depth
          p: 3, // Padding around the content
          marginLeft: 3,
          marginRight: 3
        }}
      >
        <Box className='clinic-logo'>
          <img src={clinicLogo} alt="logo" />
        </Box>
        <Box className='sidebar-nav-list'>
          {updatedNavList.map((navItem, index) => (
            <SideBarNavTab key={index} {...navItem} />
          ))}
        </Box>
      </Box>
    </Modal>
  );
}

export default More;
