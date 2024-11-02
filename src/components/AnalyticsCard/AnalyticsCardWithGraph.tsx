import * as React from 'react';
import { Box, Typography, Chip, useTheme, IconButton } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { ArrowForward, Event } from '@mui/icons-material'; // Importing the icons

interface BadgeData {
  color: string;
  count: number | string;
  label: string;
}

export interface AnalyticsCardWithGraphProps {
  title: string;
  mainValue: string | number;
  linkUrl?: string;
  linkText?: string;
  badgesData: BadgeData[]; // Use the badgesData for both badges and the graph
}

const AnalyticsCardWithGraph: React.FC<AnalyticsCardWithGraphProps> = ({
  title,
  mainValue,
  linkUrl,
  badgesData = [],
}) => {
  const theme = useTheme(); // Use the theme to map colors

  const getColor = (color: string) => {
    // Map color keys to the corresponding color from the theme
    switch (color) {
      case 'info':
        return theme.palette.info.main;
      case 'warning':
        return theme.palette.warning.main;
      case 'success':
        return theme.palette.success.main;
      case 'error':
        return theme.palette.error.main;
      default:
        return theme.palette.primary.main; // Fallback to primary color if not found
    }
  };

  const handleArrowClick = () => {
    if (linkUrl) {
      window.location.href = linkUrl; // Redirect to the provided link URL
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      borderRadius={4}
      border="1px solid"
      borderColor="#D8D8D8"
      flex={1}
      width="95%"
      height="358px" // Full height
      overflow="hidden"
      bgcolor="#FFFFFF"
    >
      {/* Header Section with Icon and Arrow */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        height="72px"
        bgcolor="#FEEDE2"
        px={2}
      >
        {/* Title with Icon */}
        <Box display="flex" alignItems="center" gap={1}>
          <Event fontSize="small" /> {/* Small icon next to the title */}
          <Typography variant="h6">{title}</Typography>
        </Box>

        {/* Arrow Icon */}
        <IconButton size="small" color="inherit" onClick={handleArrowClick}>
          <ArrowForward fontSize="small" />
        </IconButton>
      </Box>

      {/* Content Section */}
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        flex={1}
        p={2}
      >
        {/* Left Column - Heading, Main Value, and Graph */}
        <Box
          display="flex"
          flexDirection="column"
          width="73%"
          pr={1}
          justifyContent="space-between"
        >
          <Typography color="primary" variant="h3" mt={1} pt={2} pl={1}>
            {mainValue}
          </Typography>

          {/* Bar Graph */}
          <Box height={160} width="100%">
            {' '}
            {/* Restrict width to align graph with heading */}
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={badgesData}>
                <CartesianGrid strokeDasharray="5" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{
                    fontSize: '8px',
                    fontFamily: theme.typography.fontFamily,
                    fill: theme.palette.text.secondary,
                  }}
                />
                <YAxis
                  tick={{
                    fontSize: '10px',
                    fontFamily: theme.typography.fontFamily,
                    fill: theme.palette.text.secondary,
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: '8px',
                    fontFamily: theme.typography.fontFamily,
                    fontSize: theme.typography.fontSize,
                    color: theme.palette.text.primary,
                  }}
                />
                <Bar dataKey="count" barSize={30}>
                  {badgesData.map((badge, index) => (
                    <Cell key={index} fill={getColor(badge.color)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        {/* Right Column - Badges */}
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="flex-start"
          gap={1}
        >
          {badgesData.map((badge, index) => (
            <Chip
              key={index}
              size="small"
              variant="outlined"
              color={badge.color as any}
              label={
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography variant="body2" sx={{ mr: 1 }}>
                    {badge.label}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {badge.count}
                  </Typography>
                </Box>
              }
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default AnalyticsCardWithGraph;
