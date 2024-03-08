import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import CancelIcon from '@mui/icons-material/Cancel';
import FilePresentIcon from '@mui/icons-material/FilePresent'; // For non-image files

const Input = styled('input')({
  display: 'none',
});

interface FilePreviewProps {
  file: File;
  onRemove: (file: File) => void;
  lastFile: boolean;
  previewStyle?: React.CSSProperties;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, onRemove, lastFile, previewStyle }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null); // Consider setting a default image for non-image files if needed
    }
  }, [file]);

  return (
    <Box mt={2} display="flex" alignItems="center" style={previewStyle}>
      {previewUrl ? (
        <img src={previewUrl} alt="Preview" style={{ width: '60px', height: 'auto', borderRadius: "4px" }} />
      ) : (
        <FilePresentIcon color='secondary' style={{ fontSize: 40 }} /> // Placeholder for non-image files
      )}
      <Box display="flex" alignItems="center" ml={1}>
        <Typography variant="body2" color={"GrayText"}>{file.name}</Typography>
        <IconButton color="error" onClick={() => onRemove(file)}>
          <CancelIcon sx={{ fontSize: "14px" }} />
        </IconButton>
        {!lastFile && <Typography style={{ width: '15px' }}>,</Typography>}
      </Box>
    </Box>
  );
};

interface FileUploadAndPreviewProps {
  acceptTypes?: string;
  labelName?: string;
  color?: "primary" | "secondary";
  variant?: "text" | "outlined" | "contained";
  previewDirection?: "row" | "column";
  handleUpload?: (files: File[]) => void;
  maxFiles?: number;
  buttonStyle?: React.CSSProperties;
  previewStyle?: React.CSSProperties;
  onError?: (error: string) => void;
}

export const FileUploadAndPreview: React.FC<FileUploadAndPreviewProps> = ({
  acceptTypes = "image/*, application/pdf, .doc, .txt",
  labelName = "Upload",
  handleUpload,
  maxFiles,
  buttonStyle,
  previewStyle,
  color = "primary",
  variant = "outlined",
  previewDirection = "row",
  onError,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null); // Reset error state
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      if (maxFiles && files.length + newFiles.length > maxFiles) {
        const errorMessage = `Maximum allowed files exceeded. Limit: ${maxFiles}.`;
        setError(errorMessage);
        onError && onError(errorMessage);
        return;
      }

      const updatedFiles = [...files, ...newFiles];
      setFiles(updatedFiles);
      handleUpload && handleUpload(updatedFiles);
    }
  };

  const handleRemoveFile = (fileToRemove: File) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove));
  };

  const uniqueId = `upload-button-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <Box display={"flex"} flexDirection={"column"}>
      <Box>
        <label htmlFor={uniqueId}>
          <Input accept={acceptTypes} id={uniqueId} multiple type="file" onChange={handleFileChange} />
          <Button variant={variant} color={color} component="span" startIcon={<CloudUploadIcon />} style={buttonStyle}>
            {labelName}
          </Button>
        </label>
        {error && <Typography color="error" variant='subtitle2'>{error}</Typography>}
      </Box>
      <Box display="flex" overflow={"scroll"} flex={1} flexDirection={previewDirection} flexWrap="wrap" mt={2}>
        {files.map((file, index) => (
          <FilePreview
            key={index}
            file={file}
            onRemove={handleRemoveFile}
            lastFile={index === files.length - 1}
            previewStyle={previewStyle}
          />
        ))}
      </Box>
    </Box>
  );
};
