import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import CancelIcon from '@mui/icons-material/Cancel';

const Input = styled('input')({
  display: 'none',
});

interface FilePreviewProps {
  file: File;
  onRemove: (file: File) => void; // Prop to handle removal
  lastFile: Boolean;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, onRemove, lastFile }) => {
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  useEffect(() => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      // Reset or set a default for non-image files if necessary
      setPreviewUrl(null);
    }
  }, [file]);

  return (
    <Box mt={2} display="flex" alignItems="center">
      {previewUrl ? (
        <Box display={"flex"} flexDirection={"column"} justifyContent={"space-between"}>
          <img src={previewUrl} alt="Preview" style={{ width: '100px', height: 'auto' }} />
          <Box display="flex" alignItems="center">
            <Typography variant='body2' color={"GrayText"} >{file.name}</Typography>
            <IconButton color='error' onClick={() => onRemove(file)} size="small">
              <CancelIcon />
            </IconButton>
            {!lastFile && <Typography style={{ width: '20px' }}>,</Typography>}
          </Box>
        </Box>
      ) : (
        <>
          <Typography variant='body2' color={"GrayText"} >{file.name}</Typography>
          <IconButton color='error' onClick={() => onRemove(file)} size="small">
            <CancelIcon />
          </IconButton>
          {!lastFile && <Typography style={{ width: '20px' }}>,</Typography>}
        </>
      )}
    </Box>
  );
};

interface FileUploadAndPreviewProps {
  acceptTypes?: string; // Defines the types of files that the component accepts
  labelName?: string; // Custom label name for the upload button
  handleUpload?: (files: File[]) => void; // Callback function to handle the uploaded files
}

export const FileUploadAndPreview: React.FC<FileUploadAndPreviewProps> = ({
  acceptTypes = "image/*, application/pdf, .doc, .txt", // Default accepted types
  labelName = "Upload", // Default label name,
  handleUpload
}) => {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setFiles([...files, ...newFiles]);
      handleUpload && handleUpload([...files, ...newFiles]);
    }
  };

  const handleRemoveFile = (fileToRemove: File) => {
    setFiles(prevFiles => prevFiles.filter(file => file !== fileToRemove)); // Using functional update form
  };

  return (
    <>
      <Box >
        <label htmlFor="upload-button">
          <Input accept={acceptTypes} id="upload-button" multiple type="file" onChange={handleFileChange} />
          <Button variant="outlined" component="span" sx={{ width: 'fit-content' }} startIcon={<CloudUploadIcon />}>
            {labelName}
          </Button>
        </label>
      </Box>
      <Box display="flex" flexDirection="row" flexWrap="wrap" mt={2}>
        {files.map((file, index) => (
          <FilePreview key={index} file={file} onRemove={handleRemoveFile} lastFile={index === files.length - 1} />
        ))}
      </Box>
    </>
  );
};
