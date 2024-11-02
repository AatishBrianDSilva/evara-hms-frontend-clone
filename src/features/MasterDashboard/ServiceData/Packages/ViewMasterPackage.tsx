import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
  Grid,
  Skeleton,
} from '@mui/material';
import { useGetMasterPackageByIdQuery } from '../../../../services/masterDashboardService/serviceData/masterPackagesApi';

interface ViewMasterPackageProps {
  openModal: boolean;
  onClose: () => void;
  id: string;
}

const ViewMasterPackage: React.FC<ViewMasterPackageProps> = ({
  openModal,
  onClose,
  id,
}) => {
  const {
    data: packageData,
    isLoading,
    isFetching,
  } = useGetMasterPackageByIdQuery(id);
  const packageDetails = packageData?.data;
  const isLoadingPackage = isLoading || isFetching;

  const capitalizeFirstLetter = (str: string | undefined) => {
    if (!str) return '-';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const renderItems = (items: any[], title: string) => (
    <>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Grid container spacing={2}>
        {isLoadingPackage ? (
          Array.from({ length: 2 }).map((_, index) => (
            <Grid item xs={12} key={index}>
              <Skeleton width="100%" height={30} />
            </Grid>
          ))
        ) : items.length > 0 ? (
          items.map((item, index) => (
            <Grid
              container
              spacing={2}
              key={index}
              sx={{ mb: 1, pl: 2, pt: 1 }}
            >
              <Grid item xs={12}>
                <Typography>{item.name || '-'}</Typography>
              </Grid>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography>No {title.toLowerCase()} available.</Typography>
          </Grid>
        )}
      </Grid>
      <Divider sx={{ my: 2 }} />
    </>
  );

  return (
    <Dialog open={openModal} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle color={'primary'}>Package Details</DialogTitle>
      <DialogContent>
        {isLoadingPackage ? (
          <Box padding={2}>
            <Skeleton variant="text" width="30%" height={40} />
            <Skeleton variant="text" width="25%" height={30} />
            <Skeleton variant="text" width="50%" height={30} />
            <Divider sx={{ my: 2 }} />
            <Skeleton variant="text" width="40%" height={30} />
            <Skeleton variant="rectangular" width="100%" height={300} />
          </Box>
        ) : (
          <Box>
            <Typography variant="h4" gutterBottom>
              {packageDetails?.name}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="h6">Price</Typography>
                <Typography>
                  ₹ {(packageDetails as any)?.cost || '-'}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6">Gender</Typography>
                <Typography>
                  {capitalizeFirstLetter((packageDetails as any)?.gender)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6">Status</Typography>
                <Typography>
                  {(packageDetails as any)?.isActive ? 'Active' : 'Inactive'}
                </Typography>
              </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />

            {/* Render Sections */}
            {renderItems(
              (packageDetails as any)?.procedures || [],
              'Procedures',
            )}
            {renderItems(
              (packageDetails as any)?.investigations || [],
              'Investigations',
            )}
            {renderItems((packageDetails as any)?.services || [], 'Services')}
            {renderItems(
              (packageDetails as any)?.cryoPreservations || [],
              'Cryo Preservations',
            )}
            {renderItems((packageDetails as any)?.cycles || [], 'Cycles')}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewMasterPackage;
