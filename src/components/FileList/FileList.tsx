import React from 'react';
import { List, ListItem, ListItemText, Typography } from '@mui/material';

interface FileListProps {
  files: string | string[];
  title?: string;
}

const FileList: React.FC<FileListProps> = ({ files, title }) => {
  const fileArray = Array.isArray(files) ? files : [files];

  return (
    <div>
      <Typography variant="subtitle1" gutterBottom>
        {title || 'File List'}
      </Typography>
      <List component={'ol'}>
        {fileArray.map((file, index) => {
          const fileName = file.split('/').pop();
          return (
            <ListItem key={index}>
              <ListItemText primary={`${index + 1}. ${fileName}`} />
            </ListItem>
          );
        })}
      </List>
    </div>
  );
};

export default FileList;
