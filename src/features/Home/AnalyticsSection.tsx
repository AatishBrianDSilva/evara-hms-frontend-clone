import React from "react";
import Box from "@mui/material/Box";
import AnalyticsCard from "../../components/AnalyticsCard/AnalyticsCard";
import { SkeletonAnalyticsCard } from "../../components/AnalyticsCard/SkeletonAnalyticsCard";
import { useGetSummaryQuery } from "../../services/homeApi";
import { formatToIndianCurrencyFormat } from "../../utils/formatToIndianCurrencyFormat";
import AnalyticsCardWithGraph from "../../components/AnalyticsCard/AnalyticsCardWithGraph";
import AnalyticsPharmacyCard from "../../components/AnalyticsCard/AnalyticsPharmacyCard";

interface AnalyticsSectionProps {
  startDate: Date | null;
  endDate: Date | null;
}

const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ startDate, endDate }) => {
  const { data, isLoading, isFetching } = useGetSummaryQuery(
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

  const summaryData = data?.data;
  const loading = isLoading || isFetching;

  console.log("Summary Data", summaryData);

  const defaultPaymentBadges = [
    { label: "Cash", count: "₹ 0", color: "info" },
    { label: "UPI", count: "₹ 0", color: "warning" },
    { label: "Online", count: "₹ 0", color: "success" },
    { label: "CreditCard", count: "₹ 0", color: "error" },
    { label: "BankTransfer", count: "₹ 0", color: "info" },
  ];

  const billingBadges = summaryData?.billing.badges || [];
  const statusBadges = billingBadges
    .filter(
      (badge) => badge.label === "Paid" || badge.label === "Pending" || badge.label === "Refunded"
    )
    .map((badge) => ({
      ...badge,
      count: formatToIndianCurrencyFormat(badge.count),
    }));

  const paymentBadges = defaultPaymentBadges.map((defaultBadge) => {
    const actualBadge = billingBadges.find((badge) => badge.label === defaultBadge.label);
    return actualBadge
      ? { ...actualBadge, count: actualBadge.count >= 0 ? formatToIndianCurrencyFormat(actualBadge.count) : formatToIndianCurrencyFormat(0) }
      : defaultBadge;
  });

  return (
    <Box display="flex" flexDirection="column" gap={2} height="100%">
      {/* Layout for cards in a single row */}
      <Box
        display="flex"
        justifyContent="space-between" // Ensures equal spacing between cards
        gap={2}
        height="100%"
      >
        {loading ? (
          [0, 1, 2, 3].map((index) => <SkeletonAnalyticsCard key={index} />)
        ) : (
          <>
            <AnalyticsCardWithGraph
              title="Appointments"
              mainValue={summaryData?.appointment.total || 0}
              linkUrl="/appointments"
              linkText="View All"
              badgesData={summaryData?.appointment.badges || []}
            />
            <AnalyticsCardWithGraph
              title="Treatments"
              mainValue={summaryData?.treatment.total || 0}
              badgesData={summaryData?.treatment.badges || []}
              linkUrl="/treatments"
            />
            <AnalyticsCard
              title="Billings"
              mainValue={formatToIndianCurrencyFormat(summaryData?.billing.totalBillings || 0)}
              badgesData={statusBadges}
              paymentBadgesData={paymentBadges}
              linkUrl="/analytics/billings/patient-billings"
            />
            <AnalyticsPharmacyCard
              title="Pharmacy"
              mainValue={formatToIndianCurrencyFormat(summaryData?.pharmacy.totalAmount || 0)}
              // badgesData={[]}
              linkUrl="/analytics/pharmacy/pharmacy-reports"
            />
          </>
        )}
      </Box>
    </Box>
  );
};

export default AnalyticsSection;
