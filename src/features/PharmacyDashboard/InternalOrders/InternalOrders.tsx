import React from 'react';
import ContentSection from '../../../components/ContentSection/ContentSection';
import OrdersTabs from './InternalOrdersTabs';

const InternalOrders: React.FC = () => {
  return (
    <ContentSection title="Orders">
      <OrdersTabs />
    </ContentSection>
  );
};

export default InternalOrders;
