import { Box, Button, Container, Typography } from '@mui/material';

export const ErrorBoundaryFallback = () => {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <Container
      maxWidth="sm"
      style={{ textAlign: 'center', paddingTop: '50px' }}
    >
      <Box>
        <Typography variant="h4" gutterBottom>
          Oops! Something went wrong.
        </Typography>
        <Typography variant="body1" paragraph>
          We apologize for the inconvenience. Please try refreshing the page or
          contact support if the problem persists.
        </Typography>
        <Button variant="contained" color="primary" onClick={handleReload}>
          Reload Page
        </Button>
      </Box>
    </Container>
  );
};
