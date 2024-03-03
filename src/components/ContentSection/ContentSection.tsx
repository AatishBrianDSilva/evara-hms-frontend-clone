import React, { ReactNode } from 'react';
import { Box, Paper, Typography, Divider, SxProps, Theme } from '@mui/material';
import { SvgIconProps } from '@mui/material/SvgIcon';

interface ContentSectionProps {
  title?: string;
  icon?: React.ReactElement<SvgIconProps>;
  children: ReactNode;
  titleSx?: SxProps<Theme>;
}

const ContentSection: React.FC<ContentSectionProps> = ({ title, icon, children, titleSx }) => {
  return (
    <Box component="section" sx={{
      height: 'calc(100vh - 75px)',
    }}>
      <Paper sx={{ height: "100%", overflow: 'auto' }}>
        <Box padding={2}>
          {title ? (
            <>
              <Typography variant="button" color="secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1, ...titleSx }}>
                {icon && React.cloneElement(icon, { sx: { mr: 1, ...icon.props.sx } })}
                {title}
              </Typography>
              <Divider />
              <Box mt={2}>
                {children}
              </Box>
            </>
          ) : (
            <Box>
              {children}
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default ContentSection;
