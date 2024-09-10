import { DialogTitle, IconButton, List, ListItem, ListItemText, Typography } from "@mui/material";
import React from "react";
import { usePrint } from "../../context/PrintPDFContext";
import { Visibility } from "@mui/icons-material";

type Props = { files: string[] };

const ViewUserUploadedReports: React.FC<Props> = ({ files }) => {
  const { fetchAndPrintUploadedPDF } = usePrint();

  const fetchContentType = async (fileUrl: string): Promise<string> => {
    const response = await fetch(fileUrl, {
      method: "HEAD",
    });
    return response.headers.get("Content-Type") || "";
  };

  const handleViewReportsClick = async (fileUrl: string) => {
    const contentType = await fetchContentType(fileUrl);
    if (contentType.startsWith("application/")) {
      console.log("File type : PDF");
      fetchAndPrintUploadedPDF(fileUrl);
    } else if (contentType.startsWith("image/")) {
      console.log("File type : Image");
      downloadImage(fileUrl);
    } else {
      console.log("Manage other?");
    }
  };

  const downloadImage = async (fileUrl: string) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileUrl.split("/").pop() || "downloaded_image";
      document.body.appendChild(link); // Required for this to work in FireFox
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  return (
    <>
      <DialogTitle>View Reports</DialogTitle>
      {files.length === 0 ? (
        <Typography sx={{ p: 3 }}>No Files Have Been Uploaded</Typography>
      ) : (
        <List>
          {files.map((file, index) => (
            <ListItem
              key={index}
              onClick={() => handleViewReportsClick(file)}
              secondaryAction={
                <IconButton edge="end" aria-label="View Report" sx={{ mr: 2 }}>
                  <Visibility />
                </IconButton>
              }
              sx={{ pl: 3 }}
            >
              <ListItemText primary={file.split("/").pop()} />
            </ListItem>
          ))}
        </List>
      )}
    </>
  );
};

export default ViewUserUploadedReports;
