import { CalendarMonth, HomeMax, HomeOutlined } from '@mui/icons-material'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers'
import React from 'react'
import ContentSection from '../../components/ContentSection/ContentSection'

const Home: React.FC = () => {

  const appointments = []

  return (
    <ContentSection title="Home" icon={<HomeOutlined />}>
      <Box>
        <Box display={"flex"} justifyContent={"flex-end"} alignItems={"center"} mb={2}>
          <DatePicker
            value={new Date()}
          />
        </Box>
        {appointments.length === 0 ? (
          <Box minHeight={200} display={"flex"} justifyContent={"center"} alignItems={"center"}>
            <Typography variant="body2" color="textSecondary">
              No appointments today
            </Typography>
          </Box>) : (
          <Box>
            {/* Render appointments */}
          </Box>
        )}
      </Box>
    </ContentSection>
  )
}

export default Home