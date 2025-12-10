import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProductionOverview from './production/ProductionOverview';
import SectionPage from './production/SectionPage';

function ProductionPage() {
  return (
    <Routes>
      <Route index element={<ProductionOverview />} />
      <Route path=":sectionId" element={<SectionPage />} />
    </Routes>
  );
}

export default ProductionPage;