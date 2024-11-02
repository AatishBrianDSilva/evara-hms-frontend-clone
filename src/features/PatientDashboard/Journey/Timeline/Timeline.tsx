import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import { CheckCircle, Circle, Launch } from '@mui/icons-material';
import Button from '@mui/material/Button';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../app/store';
import { useGetPatientTimelineQuery } from '../../../../services/patientDashboardService/patientTimelineApi';
import { useNavigate } from 'react-router-dom';
import { EJourneyTabPaths } from '../../../../types/global';
import { format } from 'date-fns';

interface IItem {
  _id: string;
  name: string;
  type: string;
  status: string;
}

interface ITimelineEntry {
  date: string;
  items: IItem[];
}

const Timeline = () => {
  const { patient } = useSelector((state: RootState) => state.patients);

  const navigate = useNavigate();

  const handleNavigation = (tab: EJourneyTabPaths, itemId: string) => {
    navigate(`/patient/${patient?.patientId}/journey/${tab}/${itemId}`);
  };

  const {
    data: patientTimeline,
    error,
    isLoading,
  } = useGetPatientTimelineQuery(
    { patientId: patient?.patientId as string },
    { skip: !patient?.patientId },
  );

  const patientTimelineData = patientTimeline?.data as
    | ITimelineEntry[]
    | undefined;

  const renderItems = (date: string, items: IItem[]) => {
    const formattedDate = format(new Date(date), 'dd/MM/yy');
    return (
      <List>
        {items.map(item => (
          <ListItem
            key={item._id}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{ textAlign: 'left', fontWeight: 'bold' }}
                color="primary"
              >
                {`${item.name} (${item.type})`}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="body2">{`Date: ${formattedDate}`}</Typography>
                <Typography variant="body2">{`Status: ${item.status}`}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() =>
                      handleNavigation(
                        EJourneyTabPaths[
                          item.type as keyof typeof EJourneyTabPaths
                        ],
                        item._id,
                      )
                    }
                  >
                    <Launch fontSize="small" />
                  </IconButton>
                  {/* <IconButton size="small"> */}
                  {item.status === 'Scheduled' ? (
                    <Circle color="warning" />
                  ) : (
                    <CheckCircle color="success" />
                  )}
                  {/* </IconButton> */}
                </Box>
              </Box>
            </Box>
          </ListItem>
        ))}
      </List>
    );
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>Error loading timeline</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6">Patient Timeline</Typography>
      <Stepper orientation="vertical">
        {Array.isArray(patientTimelineData) &&
        patientTimelineData.length > 0 ? (
          patientTimelineData.map((entry, index) => (
            <Step key={index} active>
              <StepLabel
                StepIconComponent={() => (
                  <Button
                    disabled
                    variant="contained"
                    color="primary"
                    sx={{
                      borderRadius: '4px',
                      minWidth: 40,
                      height: 30,
                      textAlign: 'center',
                      backgroundColor: theme => theme.palette.primary.main,
                      color: 'white',
                      '&:disabled': {
                        backgroundColor: theme => theme.palette.primary.main,
                        color: 'white',
                        opacity: 1,
                      },
                    }}
                  >
                    {format(new Date(entry.date), 'dd/MM/yy')}
                  </Button>
                )}
              ></StepLabel>
              <StepContent>
                <Card sx={{ mb: 4 }}>
                  <CardContent>
                    {renderItems(entry.date, entry.items)}
                    {index < patientTimelineData.length - 1 && <Divider />}
                  </CardContent>
                </Card>
              </StepContent>
            </Step>
          ))
        ) : (
          <Typography>No timeline data available</Typography>
        )}
      </Stepper>
    </Box>
  );
};

export default Timeline;
