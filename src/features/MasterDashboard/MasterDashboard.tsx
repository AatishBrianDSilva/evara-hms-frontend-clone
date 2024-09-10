import React from 'react'
import { Box } from '@mui/material'
import MasterDashboardTabs from './MasterDashboardTabs'

const MasterDashboard: React.FC = () => {

  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      flex={'1 1 auto'}
    >
      <MasterDashboardTabs />
    </Box >
  )
}

export default MasterDashboard
