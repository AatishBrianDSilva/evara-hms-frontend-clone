import React from 'react';
import { Box, Link, Typography } from '@mui/material';
import { OpenInNew } from '@mui/icons-material';

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
      <Box
        display={'flex'}
        flexDirection={'column'}
        border={1}
        borderColor="grey.300"
        borderRadius={1}
        p={2}
      >
        {fileArray.map((file, index) => {
          const fileName = file.split('/').pop();
          return (
            <Link href={file} target="_blank" key={index}>
              <Typography
                display={'flex'}
                alignItems={'center'}
                variant="body1"
              >
                {`${index + 1}. ${fileName}`}
                <OpenInNew sx={{ ml: 1, cursor: 'pointer', fontSize: 16 }} />
              </Typography>
            </Link>
          );
        })}
      </Box>
    </div>
  );
};

export default FileList;
