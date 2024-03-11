import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const ErrorAlertWithRetry: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
    <Alert
      severity="error"
      action={
        <Button color="inherit" size="small" onClick={onRetry}>
          Retry
        </Button>
      }
    >
      An error occurred while fetching patients. Please try again.
    </Alert>
  </Box>
);

export default ErrorAlertWithRetry;

