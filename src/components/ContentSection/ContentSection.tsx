import React, { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
// Import Theme, SvgIconProps, and SxProps from the main package or specific utilities
import { Theme, SvgIconProps, SxProps } from '@mui/material';


interface ContentSectionProps {
  title?: string;
  icon?: React.ReactElement<SvgIconProps>;
  children: ReactNode;
  titleSx?: SxProps<Theme>;
}

const ContentSection: React.FC<ContentSectionProps> = ({ title, icon, children, titleSx }) => {
  return (
    <Box component="section" sx={{ display: "flex", flexDirection: "column", flex: "1 1 auto", maxWidth: "100%" }}>
      <Paper sx={{ height: "100%", display: "flex", maxWidth: "100%" }}>
        <Box padding={2} sx={{ display: "flex", flexDirection: "column", flex: "1 1 auto", overflow: 'auto' }}>
          {title ? (
            <>
              <Typography variant="button" color="secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1, ...titleSx }}>
                {icon && React.cloneElement(icon, { sx: { mr: 1, ...icon.props.sx } })}
                {title}
              </Typography>
              <Divider />
              <Box mt={2} sx={{ display: "flex", flexDirection: "column", flex: "1 1 auto", }}>
                {children}
              </Box>
            </>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", flex: "1 1 auto" }}>
              {children}
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};


export default ContentSection;
