import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import DeviceUnlock from './components/DeviceUnlock';
import TermsAndConditions from './components/TermsAndConditions';
import OrderStatus from './components/OrderStatus';
import DeviceCatalog from './components/DeviceCatalog';
import Help from './components/Help';
import Receipt from './components/Receipt';
import Services from './components/Services';


function ScrollToTop() {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/unlock/:model" element={<DeviceUnlock />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/services" element={<Services />} />
        <Route path="/order-status" element={<OrderStatus />} />
        <Route path="/device-catalog" element={<DeviceCatalog />} />
        <Route path="/help" element={<Help />} />
        <Route path="/receipt" element={<Receipt />} />
      </Routes>

    </>
  );
}

export default App;
