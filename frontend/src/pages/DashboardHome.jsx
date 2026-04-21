import React, { useState, useEffect } from 'react';
import { Users, Building2, FileBadge, TrendingUp } from 'lucide-react';
import { getCitoyens, getInstitutions, getCertificats } from '../services/api';
import './DashboardHome.css';

function DashboardHome() {
  //  1. TON CERVEAU (Les données réelles du Backend)
  const [citoyens, setCitoyens] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [certificats, setCertificats] = useState([]);

  // Charge les données au démarrage de la page
  useEffect(() => {
    // Si tes API renvoient des erreurs parfois, c'est bien de mettre un .catch() plus tard !
    getCitoyens().then(data => setCitoyens(data || []));
    getInstitutions().then(data => setInstitutions(data || []));
    getCertificats().then(data => setCertificats(data || []));
  }, []);

  //  LA CARROSSER
  return (
    <div className="page-content">
      
      {/* --- HEADER --- */}
      <div className="dashboard-header">
        <div>
          <h1 className="title-futuriste">Centre de Contrôle</h1>
          <p style={{ color: 'var(--text-gris)', marginTop: '5px' }}>
          </p>
        </div>
        
        {/* Feedback Système */}
        <div className="system-status">
          <div className="pulse-dot"></div>
          Connecté à PostgreSQL
        </div>
      </div>

      {/* --- GRILLE DES STATISTIQUES --- */}
      <div className="stats-grid">
        
        {/* Carte Citoyens (Bleue) */}
        <div className="stat-card card-blue">
          <div className="stat-header">
            <span>Citoyens Inscrits</span>
            <Users size={24} color="var(--mada-blue)" />
          </div>
          {/* On utilise length sur tes vraies données ! */}
          <div className="stat-value">
            {citoyens.length.toString().padStart(3, '0')}
          </div>
          <div className="stat-desc">
            <TrendingUp size={14} />
          </div>
        </div>

        {/* Carte Institutions (Verte) */}
        <div className="stat-card card-green">
          <div className="stat-header">
            <span>Institutions Agréées</span>
            <Building2 size={24} color="var(--mada-green)" />
          </div>
          <div className="stat-value">
            {institutions.length.toString().padStart(2, '0')}
          </div>
          <div className="stat-desc">
            <TrendingUp size={14} />
          </div>
        </div>

        {/* Carte Certificats (Ambre) */}
        <div className="stat-card card-amber">
          <div className="stat-header">
            <span>Certificats Émis</span>
            <FileBadge size={24} color="#F59E0B" />
          </div>
          <div className="stat-value">
            {certificats.length.toString().padStart(3, '0')}
          </div>
          <div style={{ color: 'var(--text-gris)', fontSize: '0.8rem', fontWeight: 'bold' }}>
          </div>
        </div>

      </div>

    </div>
  );
}

export default DashboardHome;