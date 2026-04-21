import React from 'react';
import { LayoutDashboard, Users, Building2, FileBadge, ShieldCheck } from 'lucide-react';
// On s'assure d'importer notre fichier magique !
import './Sidebar.css'; 

function Sidebar({ pageCourante, changerPage }) {
  
  // Fonction : Elle ajoute la classe "actif" si c'est la bonne page
  const getBoutonClass = (nomPage) => {
    if (pageCourante === nomPage) {
      return "nav-item actif";
    }
    return "nav-item";
  };

  return (
    <div className="sidebar">
      
      {/* --- LE LOGO MADA-ID 2035 --- */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <ShieldCheck size={28} color="white" />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.2rem', letterSpacing: '2px' }}>MADA-ID</h1>
          <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--mada-blue)', letterSpacing: '3px', fontWeight: 'bold' }}>VISION 2035</p>
        </div>
      </div>

      {/* --- LE MENU --- */}
      <div className="nav-menu">
        <p style={{ fontSize: '0.75rem', color: 'var(--text-gris)', fontWeight: 'bold', letterSpacing: '1px', paddingLeft: '10px' }}>
          MENU PRINCIPAL
        </p>

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

      {/* --- PIED DE PAGE --- */}
      <div className="sidebar-footer">
        <div className="user-badge">
          {/* Cercle avec les initiales */}
          <div style={{
            width: '35px', height: '35px', borderRadius: '50%',
            background: 'linear-gradient(45deg, var(--mada-blue), var(--mada-green))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
          }}>
            TJ
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 'bold' }}>Admin Tojo</p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-gris)' }}>Système L2</p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Sidebar;