import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import QuickTransactionModal from '../dashboard/QuickTransactionModal';

const AppLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* Sidebar Navigation */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="app-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative' }}>
        {/* Ambient subtle background glows */}
        <div
          className="bg-ambient"
          style={{
            top: '5%',
            left: '20%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(37, 99, 235, 0.05) 0%, transparent 70%)'
          }}
        />
        <div
          className="bg-ambient"
          style={{
            bottom: '10%',
            right: '10%',
            width: '450px',
            height: '450px',
            background: 'radial-gradient(circle, rgba(14, 165, 233, 0.04) 0%, transparent 70%)'
          }}
        />

        {/* Top Navbar */}
        <Navbar
          isMobileOpen={mobileSidebarOpen}
          onMobileMenuToggle={() => setMobileSidebarOpen((prev) => !prev)}
          onQuickAddClick={() => setIsQuickAddOpen(true)}
        />

        {/* Dynamic Nested Page Content */}
        <main className="app-content" style={{ flex: 1, padding: '1.5rem', position: 'relative', zIndex: 1 }}>
          <div className="luxury-container" style={{ padding: 0 }}>
            <Outlet context={{ openQuickAdd: () => setIsQuickAddOpen(true) }} />
          </div>
        </main>
      </div>

      {/* Global Quick Add Transaction Modal */}
      <QuickTransactionModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onSuccess={() => {
          // Trigger window event so child pages like Dashboard or Transactions refresh seamlessly
          window.dispatchEvent(new Event('transaction-updated'));
        }}
      />
    </div>
  );
};

export default AppLayout;
