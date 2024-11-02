import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

const PrintHideBox = styled(Box)(() => ({
  '@media print': {
    display: 'none',
  },
}));

const FullPagePrintBox = styled(Box)(({ theme }) => ({
  '@media print': {
    position: 'absolute',
    left: 0,
    top: 0,
    margin: 0,
    padding: theme.spacing(2),
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
  },
}));

export { PrintHideBox, FullPagePrintBox };
