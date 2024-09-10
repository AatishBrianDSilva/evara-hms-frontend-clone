import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';
import useTabNavigation from '../../hooks/useTabNavigation';
import { EIVFRegistrationTabPaths } from '../../types/global';
import ContentSection from '../../components/ContentSection/ContentSection';

const IVFRegistrationTab = () => {
  const theme = useTheme()

  const basePath = `/ivf-registration`;
  const { activeTab, handleTabChange } = useTabNavigation(basePath, Object.values(EIVFRegistrationTabPaths));

  return (
    <Box display={"flex"} flexDirection={"column"} flex={1}>
      <ContentSection>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="secondary"
          textColor="secondary"
          aria-label="Patient Main Tabs"
          sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}
        >
          <Tab label="Patients" id='ivf-regisrtation-main-tabpanel-0' />
          <Tab label="Donor From Bank" id='ivf-regisrtation-main-tabpanel-1' />
          <Tab label="Donor From Hospital" id='ivf-regisrtation-main-tabpanel-2' />
        </Tabs>


        <Box
          p={2}
          display={"flex"} flexDirection={"column"}
          flex={"1 1 auto"}
        >
          <Outlet />
        </Box>
      </ContentSection>
    </Box>
  )
}

export default IVFRegistrationTab
