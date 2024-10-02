import React from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import PharmacyCard from "../../components/PharmacyCard/PharmacyCard";
import SkeletonPharmacyCard from "../../components/PharmacyCard/Skeleton";
import { useGetPharmacySummaryQuery } from "../../services/homeApi";
import { formatToIndianCurrencyFormat } from "../../utils/formatToIndianCurrencyFormat";

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

  console.log("Start Date", startDate);
  console.log("End Date", endDate);

  const pharmacySummary = data?.data;
  const loading = isLoading || isFetching;

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="button" color="primary">
          Pharmacy
        </Typography>
      </Box>
      <Box display="flex" gap={2}>
        {loading ? (
          <>
            <SkeletonPharmacyCard />
            <SkeletonPharmacyCard />
          </>
        ) : (
          <>
            <PharmacyCard
              title="POs Created"
              mainValue={pharmacySummary?.purchaseOrders.count || 0}
              amountValue={
                "Total Payout: " +
                formatToIndianCurrencyFormat(pharmacySummary?.purchaseOrders.totalPayout || 0)
              }
              linkUrl="/pharmacy/purchase-order/processed"
              linkText="View All PO"
            />
            <PharmacyCard
              title="Critical Stocks"
              mainValue={pharmacySummary?.criticalStock.count || 0}
              linkUrl="/pharmacy/stocks"
              linkText="View All Stocks"
            />
          </>
        )}
      </Box>
    </Box>
  );
};

export default PharmacySection;
