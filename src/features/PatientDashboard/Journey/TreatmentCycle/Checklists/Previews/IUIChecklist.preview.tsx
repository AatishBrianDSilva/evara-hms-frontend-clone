import React from 'react';
import { Box, Typography } from '@mui/material';

interface IUIChecklistPreviewProps {
  data: any;
}

const IUIChecklistPreview: React.FC<IUIChecklistPreviewProps> = ({ data }) => {
  return (
    <Box mt={2}>
      <Typography variant="h6">Preview:</Typography>
      <Typography>
        Female History Sheet Complete:{' '}
        {data.femaleHistorySheetComplete ? 'Yes' : 'No'}
      </Typography>
      <Typography>
        Male History Sheet Complete:{' '}
        {data.maleHistorySheetComplete ? 'Yes' : 'No'}
      </Typography>
      <Typography>Uterus: {data.uterus}</Typography>
      <Typography>
        Hysteroscopy Findings: {data.hysteroScopyFindings ? 'Yes' : 'No'}
      </Typography>
      <Typography>Total Patency Status: {data.totalPatencyStatus}</Typography>
      <Typography>
        IUI Consent Form Signed: {data.consentForm ? 'Yes' : 'No'}
      </Typography>
      {data.otherInformation && (
        <Typography>Other Information: {data.otherInformation}</Typography>
      )}
    </Box>
  );
};

export default IUIChecklistPreview;
