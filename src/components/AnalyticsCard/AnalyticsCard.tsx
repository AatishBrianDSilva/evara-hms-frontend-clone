import * as React from "react";
import { Box, Typography, Link, Chip, Button, Grid } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";

interface BadgeData {
  color: string;
  count: number | string;
  label: string;
}

export interface AnalyticsCardProps {
  title: string;
  mainValue: string | number;
  linkUrl?: string;
  linkText?: string;
  badgesData?: BadgeData[];
  paymentBadgesData?: BadgeData[];
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  mainValue,
  linkUrl,
  linkText,
  badgesData = [],
  paymentBadgesData = [],
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      borderRadius={4}
      border="1px solid"
      borderColor="primary.main"
      flex={1}
      width={250}
      height={200}
      p={2}
      overflow={"hidden"}
    >
      <Box display="flex" justifyContent="space-between" flex={1}>
        <Box display="flex" flexDirection="column" flex={2}>
          <Typography variant="h6" color={"secondary"}>
            {title}
          </Typography>
          <Box
            display={"flex"}
            justifyContent={"flex-start"}
            alignItems={"center"}
            flex={1}
            flexWrap={"wrap"}
          >
            <Typography color={"primary"} variant="h4">
              {mainValue}
            </Typography>
          </Box>
        </Box>
        {badgesData.length > 0 && (
          <Box display="flex" flexDirection="column" justifyContent="flex-start" flex={1} gap={1}>
            {badgesData.map((badge, index) => (
              <Chip
                key={index}
                size="small"
                variant="outlined"
                color={badge.color as any}
                label={
                  <Box display="flex" alignItems="center" justifyContent={"space-between"}>
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      {badge.label}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      {badge.count}
                    </Typography>
                  </Box>
                }
              />
            ))}
          </Box>
        )}
      </Box>

      {paymentBadgesData.length > 0 && (
        <Box mt={2}>
          <Grid container spacing={1}>
            {paymentBadgesData.map((badge, index) => (
              <Grid item xs={6} key={index}>
                {" "}
                {/* Automatically takes half width */}
                <Chip
                  size="small"
                  variant="outlined"
                  color={badge.color as any}
                  sx={{
                    width: "100%", // Ensure the Chip takes full width
                    paddingLeft: 2, // Add padding for left
                    paddingRight: 2, // Add padding for right
                    justifyContent: "center", // Center align the content
                  }}
                  label={
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{ width: "100%" }} // Ensure the Box inside the Chip also takes full width
                    >
                      <Typography variant="body2" sx={{ mr: 1 }}>
                        {badge.label}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        {badge.count}
                      </Typography>
                    </Box>
                  }
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {linkUrl && linkText && (
        <Box display="flex" justifyContent="flex-end">
          <Button
            variant="text"
            color="primary"
            endIcon={<ArrowForward />}
            component={Link}
            href={linkUrl}
          >
            {linkText}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default AnalyticsCard;
