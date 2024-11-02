import React from 'react';
import ContentSection from '../../../components/ContentSection/ContentSection';
import PurchaseOrderTabs from './PurchaseOrderTabs';

const PurchaseOrder: React.FC = () => {
  return (
    <ContentSection title="Purchase Order">
      <PurchaseOrderTabs />
    </ContentSection>
  );
};

export default PurchaseOrder;
