import React, { useState } from 'react';
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Button,
} from '@mui/material';
import { DocumentScanner, Download as DownloadIcon } from '@mui/icons-material';
import SummarizeIcon from '@mui/icons-material/Summarize';

interface DownloadMenuProps {
  handleDownload: (allData: boolean) => void;
}

const DownloadMenu: React.FC<DownloadMenuProps> = ({ handleDownload }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const onDownloadClick = (allData: boolean) => {
    handleMenuClose();
    handleDownload(allData);
  };

  return (
    <>
      <Button
        aria-label="download options"
        aria-controls="download-menu"
        aria-haspopup="true"
        onClick={handleMenuOpen}
        variant="outlined"
        startIcon={<DownloadIcon />}
      >
        Export CSV
      </Button>
      <Menu
        id="download-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        MenuListProps={{
          'aria-labelledby': 'download-button',
        }}
      >
        <MenuItem onClick={() => onDownloadClick(false)}>
          <ListItemIcon>
            <DocumentScanner fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Current page" />
        </MenuItem>
        <MenuItem onClick={() => onDownloadClick(true)}>
          <ListItemIcon>
            <SummarizeIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="All Data" />
        </MenuItem>
      </Menu>
    </>
  );
};

export default DownloadMenu;
