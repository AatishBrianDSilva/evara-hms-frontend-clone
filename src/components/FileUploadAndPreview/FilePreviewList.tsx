import Cancel from "@mui/icons-material/Cancel";
import FilePresent from "@mui/icons-material/FilePresent";
import { Box, IconButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";

interface FilePreviewListProps {
  files: File[];
  onRemove?: (file: File) => void;
  previewStyle?: React.CSSProperties;
}

interface FilePreviewProps {
  file: File;
  onRemove?: (file: File) => void;
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
    (<Box mt={2} display="flex" alignItems="center" style={previewStyle}>
      {previewUrl ? (
        <img src={previewUrl} alt="Preview" style={{ width: '60px', height: 'auto', borderRadius: "4px" }} />
      ) : (
        (<FilePresent color='secondary' style={{ fontSize: 40 }} />) // Placeholder for non-image files
      )}
      <Box display="flex" alignItems="center" ml={1}>
        <Typography variant="body2" color={"GrayText"}>{file.name}</Typography>
        {onRemove && (<IconButton color="error" onClick={() => onRemove(file)}>
          <Cancel sx={{ fontSize: "14px" }} />
        </IconButton>)}
        {!lastFile && <Typography style={{ width: '15px' }}>,</Typography>}
      </Box>
    </Box>)
  );
};

const FilePreviewList: React.FC<FilePreviewListProps> = ({ files, onRemove, previewStyle }) => {

  return (
    <Box display="flex" overflow="scroll" flexDirection="row" flexWrap="wrap" mt={2}>
      {files.map((file, index) => (
        <FilePreview
          key={file.name + index} // Consider using a more unique identifier if possible
          file={file}
          onRemove={onRemove}
          lastFile={index === files.length - 1}
          previewStyle={previewStyle}
        />
      ))}
    </Box>
  );
};

export default FilePreviewList;