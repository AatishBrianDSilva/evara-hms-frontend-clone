import React, { createContext, useState, useEffect, useContext } from "react";
import axios, { AxiosRequestConfig } from "axios";
import printJS from "print-js";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { API_BASE_URL } from "../utils/apiConfig";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface PrintPDFContextProps {
  fetchAndPrintPdf: (
    id: string,
    type?: "report" | "invoice" | "uploadedFiles",
    sourceType?: "patient" | "pharmacy"
  ) => void;
  fetchAndPrintUploadedPDF: (fileUrl: string) => void;
}

const PrintContext = createContext<PrintPDFContextProps | undefined>(undefined);

export const PrintProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const token = useSelector((state: RootState) => state.auth.tokens?.authToken);

  const axiosConfig: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
      // "Content-Type": "application/pdf",
    },
    responseType: "arraybuffer", // Ensure the response is binary
    onDownloadProgress: (progressEvent) => {
      const { loaded, total } = progressEvent;
      if (total) {
        const progress = Math.floor((loaded / total) * 100);
        toast.update("fetch-toast", {
          render: `Downloading PDF: ${progress}%`,
          type: toast.TYPE.INFO,
          autoClose: false,
        });
      }
    },
  };

  const [pdfData, setPdfData] = useState<string | null>(null);

  const fetchAndPrintPdf = async (
    reportId: string,
    type: "report" | "invoice" | "uploadedFiles" = "report",
    sourceType: "patient" | "pharmacy" = "patient"
  ) => {
    if (reportId) {
      let url = "";
      // Determine the URL based on type and sourceType
      if (type === "report" && sourceType === "patient") {
        url = `${API_BASE_URL}/reports/download/${reportId}`;
      } else if (type === "invoice" && sourceType === "patient") {
        url = `${API_BASE_URL}/invoices/download/${reportId}`;
      } else if (sourceType === "pharmacy" && type === "invoice") {
        url = `${API_BASE_URL}/pharmacy-dashboard/invoice/download/${reportId}`;
      } else if (type === "uploadedFiles") {
        url = `${API_BASE_URL}/files/download/${reportId}`;
      } else {
        console.error("Invalid type or sourceType");
        toast.error("Invalid document type or source type");
        return;
      }

      toast.info("Fetching PDF...", {
        autoClose: false,
        toastId: "fetch-toast",
      });

      try {
        const response = await axios.get(url, axiosConfig);

        // Convert binary data to base64
        const base64String = btoa(
          new Uint8Array(response.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );

        setPdfData(base64String);
        toast.dismiss("fetch-toast");
        toast.success("PDF fetched successfully!");
      } catch (error) {
        console.error("Error fetching PDF:", error);
        toast.dismiss("fetch-toast");
        toast.error("Error fetching PDF");
      }
    } else {
      toast.error("No report ID provided");
      setPdfData(null);
    }
  };

  const fetchAndPrintUploadedPDF = async (fileUrl: string) => {
    if (fileUrl) {
      const url = `${API_BASE_URL}/files/user-files/download`;

      toast.info("Sending file URL to backend for processing...", {
        autoClose: false,
        toastId: "send-toast",
      });

      try {
        const response = await axios.post(url, { fileUrl }, axiosConfig);

        // Convert binary data to base64
        const base64String = btoa(
          new Uint8Array(response.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );

        setPdfData(base64String);
        toast.dismiss("send-toast");
        toast.success("File URL processed successfully!");
      } catch (error) {
        console.error("Error sending file URL to backend:", error);
        toast.dismiss("send-toast");
        toast.error("Error sending file URL to backend");
      }
    } else {
      toast.error("No file URL provided");
      setPdfData(null);
    }
  };

  useEffect(() => {
    if (pdfData) {
      try {
        printJS({
          printable: pdfData,
          base64: true,
          type: "pdf",
          showModal: true,
        });
      } catch (error) {
        console.error("Error printing PDF:", error);
        toast.error("Error printing PDF");
      }
    }
    return () => setPdfData(null); // Reset the PDF data after printing
  }, [pdfData]);

  return (
    <PrintContext.Provider
      value={{ fetchAndPrintPdf, fetchAndPrintUploadedPDF }}
    >
      {children}
    </PrintContext.Provider>
  );
};

export const usePrint = () => {
  const context = useContext(PrintContext);
  if (context === undefined) {
    throw new Error("usePrint must be used within a PrintProvider");
  }
  return context;
};
