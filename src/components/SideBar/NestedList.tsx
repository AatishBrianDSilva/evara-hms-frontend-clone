import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

export interface NestedListItem {
  icon: React.ElementType;
  primaryText: string;
  children?: NestedListItem[];
  path?: string; // Add an optional path property for navigation
}

export interface NestedListProps {
  items: NestedListItem[];
  depth?: number;
}

const NestedList: React.FC<NestedListProps> = ({ items, depth = 0 }) => {
  const [open, setOpen] = useState<string | null>(null);
  const navigate = useNavigate(); // Hook for navigation

  const handleClick = (item: NestedListItem) => {
    if (item.children && item.children.length > 0) {
      // If the item has children, expand or collapse the list
      setOpen(open === item.primaryText ? null : item.primaryText);
    } else if (item.path) {
      // If the item has a path and no children, navigate to the path
      navigate(item.path);
    }
  };

  return (
    <List component="div" disablePadding>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ListItemButton
            onClick={() => handleClick(item)}
            sx={{ pl: depth ? 4 : 2 }}
          >
            <ListItemIcon
              sx={{
                minWidth: 'auto',
                mr: 1,
                '.MuiSvgIcon-root': {
                  fontSize: depth ? 18 : 20,
                  color: depth ? 'primary.main' : 'secondary.main',
                },
              }}
            >
              <item.icon />
            </ListItemIcon>
            <ListItemText
              disableTypography
              primary={
                <Typography
                  variant={depth ? 'body2' : 'button'}
                  color={depth ? 'primary' : 'secondary'}
                >
                  {item.primaryText}
                </Typography>
              }
            />
            {item.children ? (
              open === item.primaryText ? (
                <ExpandLess color={depth ? 'primary' : 'secondary'} />
              ) : (
                <ExpandMore color={depth ? 'primary' : 'secondary'} />
              )
            ) : null}
          </ListItemButton>
          {item.children && (
            <Collapse
              in={open === item.primaryText}
              timeout="auto"
              unmountOnExit
            >
              <NestedList items={item.children} depth={depth + 1} />
            </Collapse>
          )}
        </React.Fragment>
      ))}
    </List>
  );
};

export default NestedList;
