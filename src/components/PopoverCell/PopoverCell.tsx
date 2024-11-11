import React, { useState, ReactNode } from 'react';
import { Box, Popover } from '@mui/material';

interface PopoverCellProps {
  children: ReactNode;
  popoverContent: ReactNode;
}

const PopoverCell: React.FC<PopoverCellProps> = ({
  children,
  popoverContent,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Box
      aria-owns={open ? 'mouse-over-popover' : undefined}
      aria-haspopup="true"
      onMouseEnter={handlePopoverOpen}
      onMouseLeave={handlePopoverClose}
      style={{
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      {children}
      <Popover
        id="mouse-over-popover"
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        disableRestoreFocus
        // slotProps={{
        //   paper: {
        //     style: {
        //       pointerEvents: 'none',
        //     },
        //   },
        // }}
      >
        <Box style={{ padding: '8px', maxWidth: '200px' }}>
          {popoverContent}
        </Box>
      </Popover>
    </Box>
  );
};

export default PopoverCell;
