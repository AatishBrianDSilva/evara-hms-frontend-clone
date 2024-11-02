import React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

const semenAnalysisReferenceValues = [
  { parameter: 'Volume', referenceValue: '> 1.4 ml' },
  { parameter: 'pH', referenceValue: '7.2 - 7.8' },
  { parameter: 'Liquefication', referenceValue: '< 30 min (R.T)' },
  { parameter: 'Vitality', referenceValue: '>54% cells live' },
  { parameter: 'Agglutination', referenceValue: '<10 % spermatozoa' },
  { parameter: 'Fructose', referenceValue: 'positive' },
  { parameter: 'White Blood Cells', referenceValue: '2 - 3 /HPF' },
  { parameter: 'Sperm Concentration', referenceValue: '>= 16 million / ml' },
  {
    parameter: 'Total Ejaculate (Total sperm No)',
    referenceValue: '39 millions',
  },
  { parameter: 'Progressive Motility', referenceValue: '>= 30 %' },
  {
    parameter: 'Total Motility (Progressive + NonProgressive)',
    referenceValue: '>=42%',
  },
  { parameter: 'Morphology', referenceValue: 'Normal Forms >=4%' },
  { parameter: 'Cytoplasmic droplets', referenceValue: '<10%' },
  {
    parameter: 'Hypo-Osmotic swelling',
    referenceValue: '>50% must have coiled tails',
  },
  {
    parameter: 'Acrosome Intactness',
    referenceValue: '>50% of spermatozoa having mean head diameter of 10 min',
  },
];

const SemenAnalysisGrid: React.FC = () => (
  <Box px={2}>
    <Grid
      boxShadow={1}
      container
      spacing={1}
      sx={{ border: '1px solid #e0e0e0' }}
    >
      {semenAnalysisReferenceValues.map((value, index) => (
        <React.Fragment key={index}>
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            sx={{
              padding: '1px',
              borderRight: '1px solid #e0e0e0',
              borderBottom: '1px solid #e0e0e0',
              '&:nth-of-type(4n)': { borderRight: 'none' },
            }}
          >
            <Typography variant="subtitle2" gutterBottom>
              {value.parameter}
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            sx={{
              padding: '1px',
              borderRight: '1px solid #e0e0e0',
              borderBottom: '1px solid #e0e0e0',
              '&:nth-of-type(4n)': { borderRight: 'none' },
              '&:nth-last-of-type(-n+4)': { borderBottom: 'none' },
            }}
          >
            <Typography variant="subtitle2" color="textSecondary">
              {value.referenceValue}
            </Typography>
          </Grid>
        </React.Fragment>
      ))}
    </Grid>
  </Box>
);

export default SemenAnalysisGrid;
