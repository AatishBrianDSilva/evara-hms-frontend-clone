import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SendIcon from '@mui/icons-material/Send';
import { styled } from '@mui/material/styles';
import Delete from '@mui/icons-material/Delete';
import axios from 'axios';
import { useGetSignedUrlMutation } from '../../services/filesApi';
import { EBuckets, EDocumentTypes } from '../../types/global';
import { useToast } from '../../context/ToastContext';
import { CircularProgress } from '@mui/material';

const Input = styled('input')({
  display: 'none',
});

interface FileUploadButtonProps {
  acceptTypes?: string;
  labelName?: string;
  color?: 'primary' | 'secondary';
  variant?: 'text' | 'outlined' | 'contained';
  buttonStyle?: React.CSSProperties;
  onUploadFiles: (files: string[]) => void;
  maxFiles?: number;
  uploadedFiles?: number;
  maxFileSizeinMB?: number;
  user: string;
  bucket: EBuckets;
  documentType?: EDocumentTypes;
  reportId?: string;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({
  acceptTypes = 'image/*, application/pdf, .doc, .txt',
  labelName = 'Select files',
  onUploadFiles,
  buttonStyle,
  color = 'primary',
  variant = 'outlined',
  maxFiles = 1,
  maxFileSizeinMB = 5, // 5MB
  uploadedFiles = 0,
  user,
  bucket,
  documentType,
  reportId,
}) => {
  const maxFileSizeInBytes = maxFileSizeinMB * 1024 * 1024;

  const { showProgressToast } = useToast(); // Use the Toast context

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false); // Loading state

  const [getSignedUrl] = useGetSignedUrlMutation();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setUploadSuccess(false); // Reset success state on new file selection
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      const totalFiles = uploadedFiles + newFiles.length;

      if (maxFiles && totalFiles > maxFiles) {
        setError(`Cannot upload more than ${maxFiles} file(s).`);
        return;
      }

      let fileSizeError = false;
      newFiles.forEach(file => {
        if (file.size > maxFileSizeInBytes) {
          fileSizeError = true;
        }
      });

      if (fileSizeError) {
        setError(`File size should not exceed ${maxFileSizeinMB} MB.`);
        return;
      }

      setSelectedFiles(newFiles);
    }
  };

  const handleUploadClick = async () => {
    if (selectedFiles.length > 0 && user) {
      let toastId = undefined;

      try {
        setLoading(true); // Set loading to true when the upload starts
        const uploadedFileUrls: string[] = [];
        // let toastId = null;
        let toastId: string | number | undefined = undefined;

        // Initialize the persistent toast with the initial message
        toastId = showProgressToast(`Uploading files...`, 0, toastId, {
          position: 'top-right',
          autoClose: false, // Make the toast persistent
        });

        // Loop through each file
        for (let i = 0; i < selectedFiles.length; i++) {
          const file = selectedFiles[i];

          // Get the signed URL
          const signedUrlResponse = await getSignedUrl({
            userId: user,
            bucket: bucket,
            documentType: documentType,
            operation: 'putObject',
            expires: 600,
            fileName: file.name,
            isImage: file.type.startsWith('image/'),
            reportId,
          }).unwrap();

          if (
            signedUrlResponse?.status === 'success' &&
            signedUrlResponse.data
          ) {
            const { url, key, bucketName, region } = signedUrlResponse.data;

            // Update the toast to show the current file number being uploaded
            // console.log(`Uploading file ${i + 1} out of ${selectedFiles.length}`);

            showProgressToast(
              `Uploading file ${i + 1} out of ${selectedFiles.length}...`,
              0,
              toastId,
              {
                position: 'top-right',
                autoClose: false, // Keep the toast persistent
              },
            );

            // Upload the file to S3
            const res = await axios.put(url, file, {
              headers: {
                'Content-Type': file.type,
              },
              onUploadProgress: progressEvent => {
                if (progressEvent.progress) {
                  // Calculate the overall progress across all files
                  const currentFileProgress = Math.round(
                    progressEvent.progress * 100,
                  );
                  const overallProgress = Math.round(
                    ((i + progressEvent.progress) / selectedFiles.length) * 100,
                  );

                  // Update the persistent toast with the current progress and file number
                  showProgressToast(
                    `Uploading file ${i + 1} out of ${
                      selectedFiles.length
                    }... (${currentFileProgress}%)`,
                    overallProgress,
                    toastId,
                    {
                      position: 'top-right',
                      autoClose: false, // Keep the toast persistent
                    },
                  );
                }
              },
            });

            if (res.status === 200) {
              const uploadedUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
              uploadedFileUrls.push(uploadedUrl);
            } else {
              setError('Error uploading file to S3.');
              // Update the toast to indicate error
              showProgressToast('Error uploading file to S3.', 0, toastId, {
                position: 'top-right',
                autoClose: 3000, // Auto close after 3 seconds
                type: 'error',
              });
              break;
            }
          } else {
            setError('Error getting signed URL.');
            // Update the toast to indicate error
            showProgressToast('Error getting signed URL.', 0, toastId, {
              position: 'top-right',
              autoClose: 3000, // Auto close after 3 seconds
              type: 'error',
            });
            break;
          }
        }

        if (uploadedFileUrls.length === selectedFiles.length) {
          onUploadFiles(uploadedFileUrls);
          setUploadSuccess(true);
          setSelectedFiles([]); // Clear selected files
          // Update the toast to indicate success
          showProgressToast('All files uploaded successfully!', 100, toastId, {
            position: 'top-right',
            autoClose: 3000, // Auto close after 3 seconds
            type: 'success',
          });
        }
      } catch (err) {
        setError('Error uploading files.');
        console.error(err);
        // Update the toast to indicate error
        showProgressToast('Error uploading files.', 0, toastId, {
          position: 'top-right',
          autoClose: 3000, // Auto close after 3 seconds
          type: 'error',
        });
      } finally {
        setLoading(false); // Set loading to false when the upload ends
      }
    } else if (!user) {
      setError('User is required.');
    } else {
      setError('No files selected for upload.');
    }
  };

  const handleClearFiles = () => {
    setSelectedFiles([]);
    setError(null);
    setUploadSuccess(false); // Reset success state when files are cleared
  };

  const uniqueId = `upload-button-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <Box>
      <label htmlFor={uniqueId}>
        <Input
          accept={acceptTypes}
          id={uniqueId}
          multiple={maxFiles > 1}
          type="file"
          onChange={handleFileChange}
          aria-label="file-upload-input"
        />
        <Button
          variant={variant}
          color={color}
          component="span"
          startIcon={<CloudUploadIcon />}
          style={buttonStyle}
        >
          {labelName}
        </Button>
      </label>
      {selectedFiles.length > 0 && !uploadSuccess && (
        <Button
          variant="text"
          onClick={handleClearFiles}
          style={{ marginLeft: 8 }}
          startIcon={<Delete />}
        >
          Clear Files
        </Button>
      )}
      <Button
        variant="contained"
        color="secondary"
        onClick={handleUploadClick}
        startIcon={
          loading ? <CircularProgress color="info" size={20} /> : <SendIcon />
        }
        style={{ marginLeft: 8 }}
        disabled={selectedFiles.length <= 0 || loading}
      >
        {loading ? 'Uploading...' : 'Upload'}
      </Button>

      {selectedFiles.length > 0 && (
        <Box mt={2}>
          <Typography variant="subtitle1">Selected Files:</Typography>
          <ul>
            {selectedFiles.map((file, index) => (
              <li
                key={index}
                style={{ color: uploadSuccess ? 'green' : 'inherit' }}
              >
                {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </li>
            ))}
          </ul>
        </Box>
      )}
      {uploadSuccess && (
        <Typography variant="subtitle1" style={{ color: 'green' }}>
          Files uploaded successfully!
        </Typography>
      )}
      {error && (
        <Typography color="error" variant="subtitle2">
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default FileUploadButton;
