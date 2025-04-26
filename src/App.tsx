import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import DeviceUnlock from './components/DeviceUnlock';
import TermsAndConditions from './components/TermsAndConditions';
import OrderStatus from './components/OrderStatus';
import DeviceCatalog from './components/DeviceCatalog';
import Help from './components/Help';

import Services from './components/Services';
import IcloudUnlockPage from './components/icloudUnlockPage';
import MdmBypassPage from './components/MdmBypassPage';
import SimUnlockPage from './components/SimUnlockPage';
import IMEICheckPage from './components/IMEICheckPage';
import WhatsAppButton from './components/WhatsAppButton';

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
      <div className="fixed top-4 right-4 z-50">
        {/* You can add the WhatsApp button here */}
      </div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/unlock/:model" element={<DeviceUnlock />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/services" element={<Services />} />
        <Route path="/order-status" element={<OrderStatus />} />
        <Route path="/device-catalog" element={<DeviceCatalog />} />
        <Route path="/help" element={<Help />} />

        <Route path="/services/icloud-unlock" element={<IcloudUnlockPage />} />
        <Route path="/services/mdm-bypass" element={<MdmBypassPage />} />
        <Route path="/services/sim-unlock" element={<SimUnlockPage />} />
        <Route path="/imei-check" element={<IMEICheckPage />} />
      </Routes>
      <WhatsAppButton />
    </>
  );
}

export default App;