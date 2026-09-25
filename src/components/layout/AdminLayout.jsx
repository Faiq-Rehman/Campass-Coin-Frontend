import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#070B14' }}>
      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main Admin Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative' }}>
        {/* Subtle purple admin glow */}
        <div
          className="bg-ambient"
          style={{
            top: '0%',
            right: '15%',
            width: '450px',
            height: '450px',
            background: 'radial-gradient(circle, rgba(167, 139, 250, 0.08) 0%, transparent 70%)'
          }}
        />

        <main style={{ flex: 1, padding: '2rem 1.5rem', position: 'relative', zIndex: 1 }}>
          <div className="luxury-container" style={{ padding: 0 }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
