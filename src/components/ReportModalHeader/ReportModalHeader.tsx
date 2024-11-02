import { Box, Grid, Typography } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';

interface ReportModalHeaderProps {
  reportName?: string;
  date?: string;
  doctor?: string;
}

const ReportModalHeader: React.FC<ReportModalHeaderProps> = ({
  reportName,
  date,
  doctor,
}) => {
  const patient = useSelector((state: RootState) => state.patients.patient);
  return (
    <Box>
      <Grid
        container
        direction={'column'}
        justifyContent="space-between"
        alignItems="center"
        borderBottom={1}
        py={2}
      >
        <Typography
          variant="h5"
          position={'absolute'}
          display={'flex'}
          justifyContent={'center'}
          width={'100%'}
        >
          {reportName}
        </Typography>
        <Grid
          container
          justifyContent={'space-between'}
          position={'relative'}
          alignItems="center"
          sx={{ width: '100%' }}
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="start"
            justifyContent="flex-start"
          >
            <Typography>
              <strong>Name: </strong>
              {patient?.firstName} {patient?.lastName}
            </Typography>
            <Typography>
              <strong>Gender: </strong>
              {patient?.gender}
            </Typography>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="start"
            justifyContent="flex-start"
          >
            <Typography>
              <strong>Date: </strong> {date}
            </Typography>
            <Typography>
              <strong>Doc: </strong> {doctor}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReportModalHeader;
