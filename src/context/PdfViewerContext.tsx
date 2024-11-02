import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { Modal } from '@mui/material';

interface PdfViewerContextProps {
  openViewer: (pdfBase64: string) => void;
  closeViewer: () => void;
}

const PdfViewerContext = createContext<PdfViewerContextProps | undefined>(
  undefined,
);

export const PdfViewerProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [pdfData, setPdfData] = useState<string | null>(null);

  const openViewer = (pdfBase64: string) => {
    setPdfData(pdfBase64);
    setOpen(true);
  };

  const closeViewer = () => {
    setOpen(false);
    setPdfData(null);
  };

  return (
    <PdfViewerContext.Provider value={{ openViewer, closeViewer }}>
      {children}
      {open && pdfData && (
        <Modal open={open} onClose={closeViewer}>
          <div style={{ width: '100%', height: '100%' }}>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
              <Viewer fileUrl={`data:application/pdf;base64,${pdfData}`} />
            </Worker>
          </div>
        </Modal>
      )}
    </PdfViewerContext.Provider>
  );
};

export const usePdfViewer = (): PdfViewerContextProps => {
  const context = useContext(PdfViewerContext);
  if (!context) {
    throw new Error('usePdfViewer must be used within a PdfViewerProvider');
  }
  return context;
};
