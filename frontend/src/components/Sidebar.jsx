import React from 'react';
import { LayoutDashboard, Users, Building2, FileBadge, ShieldCheck } from 'lucide-react';
import './Sidebar.css'; 

function Sidebar({ pageCourante, changerPage }) {
  
  const getBoutonClass = (nomPage) => {
    return pageCourante === nomPage ? "nav-item actif" : "nav-item";
  };

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <ShieldCheck size={28} />
        </div>
        <div className="logo-text">
          <h1>MADA-ID</h1>
          <p>VISION 2035</p>
        </div>
      </div>

      {/* Menu */}
      <div className="nav-menu">
        <div className="menu-section-title">MENU PRINCIPAL</div>

        <div onClick={() => changerPage('dashboard')} className={getBoutonClass('dashboard')}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </div>

        <div onClick={() => changerPage('citoyens')} className={getBoutonClass('citoyens')}>
          <Users size={20} />
          <span>Citoyens</span>
        </div>

        <div onClick={() => changerPage('institutions')} className={getBoutonClass('institutions')}>
          <Building2 size={20} />
          <span>Institutions</span>
        </div>

        <div onClick={() => changerPage('certificats')} className={getBoutonClass('certificats')}>
          <FileBadge size={20} />
          <span>Certificats</span>
        </div>
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="user-badge">
          <div className="user-avatar">TJ</div>
          <div className="user-info">
            <p className="user-name">Admin Tojo</p>
            <p className="user-role">Système L2</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;