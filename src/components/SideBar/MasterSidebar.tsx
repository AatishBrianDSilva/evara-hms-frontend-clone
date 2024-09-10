import React from 'react'
import { Drawer, List, Typography } from '@mui/material'
import NestedList, { NestedListItem } from './NestedList'

interface MasterSidebarProps {
  menuItems: NestedListItem[]
  heading: string
}

const MasterSidebar: React.FC<MasterSidebarProps> = ({
  menuItems,
  heading,
}) => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 230,
          top: '128px',
          left: '18px',
          height: 'calc(100% - 146px)',
          boxSizing: 'border-box',
          borderRadius: 1,
        },
      }}
      PaperProps={{
        elevation: 2,
        style: {
          position: 'absolute',
        },
      }}
    >
      <List
        sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <Typography
            textAlign={'center'}
            variant="button"
            color={'primary'}
            fontSize={20}
            p={1}
            component="div"
            id="nested-list-subheader"
          >
            {heading}
          </Typography>
        }
      >
        <NestedList items={menuItems} />
      </List>
    </Drawer>
  )
}

export default MasterSidebar
