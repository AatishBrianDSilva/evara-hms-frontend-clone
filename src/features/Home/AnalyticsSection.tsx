import React from "react";
import Box from "@mui/material/Box";
import AnalyticsCard from "../../components/AnalyticsCard/AnalyticsCard";
import { SkeletonAnalyticsCard } from "../../components/AnalyticsCard/SkeletonAnalyticsCard";
import { Typography } from "@mui/material";
import { useGetSummaryQuery } from "../../services/homeApi";
import { formatToIndianCurrencyFormat } from "../../utils/formatToIndianCurrencyFormat";

interface AnalyticsSectionProps {
  startDate: Date | null;
  endDate: Date | null;
}

const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ startDate, endDate }) => {
  console.log(startDate, endDate);

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
  //   // Simulate loading data
  //   setTimeout(() => {
  //     setData([
  //       {
  //         title: 'Appointments',
  //         mainValue: 12,
  //         linkUrl: '/appointments',
  //         linkText: 'View All',
  //         badgesData: [
  //           { color: 'error', count: 4, label: 'Scheduled' },
  //           { color: 'warning', count: 0, label: 'Reported' },
  //           { color: 'success', count: 0, label: 'Completed' },
  //         ],
  //       },
  //       {
  //         title: 'Treatments',
  //         mainValue: 5,
  //         linkUrl: '/treatments',
  //         linkText: 'View All',
  //         badgesData: [
  //           { color: 'error', count: 0, label: 'In Progress' },
  //           { color: 'warning', count: 0, label: 'Pending' },
  //           { color: 'success', count: 1, label: 'Completed' },
  //         ],
  //       },
  //       {
  //         title: 'Billings',
  //         mainValue: 'Rs. 4,45,670',
  //         linkUrl: '/billings',
  //         linkText: 'View All',
  //         badgesData: [
  //           { color: 'error', count: 0, label: 'Unpaid' },
  //           { color: 'warning', count: 1, label: 'Pending' },
  //         ],
  //       },
  //       {
  //         title: 'Medicines Sold',
  //         mainValue: 'Rs. 1,00,670',
  //         linkUrl: '/medicines',
  //         linkText: 'View All',
  //         badgesData: [
  //           { color: 'error', count: 0, label: 'Out of Stock' },
  //           { color: 'warning', count: 0, label: 'Low Stock' },
  //           { color: 'success', count: 102, label: 'In Stock' },
  //         ],
  //       },
  //     ]);
  //     setLoading(false);
  //   }, 2000);
  // }, []);

  const defaultPaymentBadges = [
    { label: "Cash", count: "0", color: "info" },
    { label: "UPI", count: "0", color: "warning" },
    { label: "Online", count: "0", color: "success" },
    { label: "CreditCard", count: "0", color: "error" },
    { label: "BankTransfer", count: "0", color: "info" },
  ];

  // Separate badges for Billings (status and payment method badges)
  const billingBadges = summaryData?.billing.badges || [];
  const statusBadges = billingBadges.filter(
    (badge) => badge.label === "Paid" || badge.label === "Pending"
  );

  // Merge default payment methods with actual data, replacing defaults where necessary
  const paymentBadges = defaultPaymentBadges.map((defaultBadge) => {
    const actualBadge = billingBadges.find((badge) => badge.label === defaultBadge.label);
    return actualBadge
      ? { ...actualBadge, count: formatToIndianCurrencyFormat(actualBadge.count) } // Format actual values to Indian currency
      : defaultBadge;
  });

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Box display="flex" justifyContent="space-between">
        <Box display="flex" justifyContent="flex-start" alignItems={"center"} flex={1}>
          <Typography variant="button" color={"primary"}>
            Summary
          </Typography>
        </Box>
      </Box>

      <Box display="flex" justifyContent="space-between" gap={2}>
        {loading ? (
          [0, 1, 2, 3].map((index) => <SkeletonAnalyticsCard key={index} />)
        ) : (
          <>
            <AnalyticsCard
              title="Appointments"
              mainValue={summaryData?.appointment.total || 0}
              linkUrl="/appointments"
              linkText="View All"
              badgesData={summaryData?.appointment.badges || []}
            />
            <AnalyticsCard
              title="Treatments"
              mainValue={summaryData?.treatment.total || 0}
              badgesData={summaryData?.treatment.badges || []}
            />
            <AnalyticsCard
              title="Billings"
              mainValue={formatToIndianCurrencyFormat(summaryData?.billing.totalBillings || 0)}
              badgesData={statusBadges}
              paymentBadgesData={paymentBadges}
            />
            <AnalyticsCard
              title="Pharmacy"
              mainValue={formatToIndianCurrencyFormat(summaryData?.pharmacy.totalAmount || 0)}
              badgesData={[]}
            />
          </>
        )}
      </Box>
    </Box>
  );
};

export default AnalyticsSection;
