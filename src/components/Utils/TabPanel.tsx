import Box from '@mui/material/Box';
import React from 'react';

interface ITabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
  id: string;
}

const TabPanel: React.FC<ITabPanelProps> = props => {
  const { children, value, index, id, ...other } = props;

  return (
    <Box
      height={'100%'}
      role="tabpanel"
      hidden={value !== index}
      id={`${id}-tabpanel-${index}`}
      aria-labelledby={`${id}-tab-${index}`}
      {...other}
    >
      {value === index && <>{children}</>}
    </Box>
  );
};

export default TabPanel;
