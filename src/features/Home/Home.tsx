import { CalendarMonth } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import React from 'react'
import ContentSection from '../../components/ContentSection/ContentSection'

const Home: React.FC = () => {

  const appointments = []

  return (
    <ContentSection title="Appointments" icon={<CalendarMonth />}>
      <Box>
        <Box display={"flex"} justifyContent={"flex-end"} alignItems={"center"} mb={2}>
          <DatePicker
            value={new Date()}
            onChange={(date) => console.log(date)}
          />
        </Box>
        {appointments.length === 0 ? (
          <Box minHeight={200} display={"flex"} justifyContent={"center"} alignItems={"center"}>
            <Typography variant="body2" color="textSecondary">
              No appointments available
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