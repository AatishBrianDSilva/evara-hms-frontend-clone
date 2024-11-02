import { useMemo } from 'react';
import { ContentProps } from '../types/patientDashboard/treatmentCycle';

interface ContentDetails {
  name: string;
  status: string;
  category: string;
  documentId: string;
  files?: string[];
}

const useGenerateTreatmentCyclelistDetails = (
  contentProps: ContentProps,
): ContentDetails => {
  return useMemo(() => {
    let name = '';
    let status = ''; // Default to 'Unknown', adjust based on your logic
    let category = '';
    let documentId = '';
    let files: string[] = [];

    if (contentProps.protocol) {
      name = contentProps.protocol.name;
      category = contentProps.protocol.category;
      status = contentProps.protocol.status;
      documentId = contentProps.protocol._id;
    } else if (contentProps.checklist) {
      name = contentProps.checklist.name;
      category = contentProps.checklist.category;
      documentId = contentProps.checklist._id;
      status = contentProps.checklist.status;
    } else if (contentProps.report) {
      name = contentProps.report.name;
      category = contentProps.report.category;
      documentId = contentProps.report._id;
      status = contentProps.report.status;
      files = contentProps.report.details?.files || [];
    } else if (contentProps.metric) {
      name = contentProps.metric.name;
      category = contentProps.metric.category;
      documentId = contentProps.metric._id;
      status = contentProps.metric.status;
      files = contentProps.metric.details?.files || [];
    }

    return { name, status, category, documentId, files };
  }, [contentProps]);
};

export default useGenerateTreatmentCyclelistDetails;
