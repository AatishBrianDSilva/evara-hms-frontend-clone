import React from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import PharmacyCard from "../../components/PharmacyCard/PharmacyCard";
import SkeletonPharmacyCard from "../../components/PharmacyCard/Skeleton";
import { useGetPharmacySummaryQuery } from "../../services/homeApi";

interface PharmacySectionProps {
  startDate: Date | null;
  endDate: Date | null;
}

const PharmacySection: React.FC<PharmacySectionProps> = ({ startDate, endDate }) => {
  const { data, isLoading, isFetching } = useGetPharmacySummaryQuery(
    {
      dateRange: {
        startDate: startDate?.toISOString() || "",
        endDate: endDate?.toISOString() || "",
      },
    },
    {
      skip: !startDate || !endDate,
    }
  );

  const pharmacySummary = data?.data;
  const loading = isLoading || isFetching;

  return (
    <Box display="flex" flexDirection="column" gap={2} overflow={"hidden"} width="100%">
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Pharmacy
        </Typography>
      </Box>

      <Box display="flex" width="100%" justifyContent={"start"} gap={2}>
        {/* First part: POs Created Summary (30% width) */}
        <Box width="31%" minWidth="200px" display="flex" flexDirection="column" borderRadius={4}>
          {loading ? (
            <SkeletonPharmacyCard />
          ) : (
            <PharmacyCard
              title="POs Created"
              mainValue={pharmacySummary?.purchaseOrders.count || 0}
              // amountValue={
              //   "Total Payout: " +
              //   formatToIndianCurrencyFormat(pharmacySummary?.purchaseOrders.totalPayout || 0)
              // }
              linkUrl="/pharmacy/purchase-order/draft"
            />
          )}
        </Box>

        {/* Second part: Critical Stocks (65% width) */}
        <Box width="31%" minWidth="200px" display="flex" flexDirection="column" borderRadius={4}>
          {/* <Typography variant="button" color="primary">
            Critical Stocks
          </Typography> */}
          <Box
            display="flex"
            flex={1}
            flexDirection="row"
            flexWrap="nowrap"
            gap={2}
            overflow="auto"
            pb={2}
          >
            {loading ? (
              [1, 2].map((_, index) => <SkeletonPharmacyCard key={index} />)
            ) : (
              <PharmacyCard
                title="Critical Stocks"
                mainValue={pharmacySummary?.criticalStock.count || 0}
                linkUrl="/analytics/pharmacy/critical-stocks"
                linkText="View All Stocks"
              />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PharmacySection;
