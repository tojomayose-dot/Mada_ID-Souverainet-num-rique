import { useState, useEffect } from 'react'
import { getCitoyens, getInstitutions, getCertificats } from '../services/api'

function DashboardHome() {

  //  Les données venant du Backend
  const [citoyens, setCitoyens] = useState([])
  const [institutions, setInstitutions] = useState([])
  const [certificats, setCertificats] = useState([])

  //  Charge les données au démarrage de la page
  useEffect(() => {
    getCitoyens().then(data => setCitoyens(data))
    getInstitutions().then(data => setInstitutions(data))
    getCertificats().then(data => setCertificats(data))
  }, [])

  return (
    <div>
      <h1 style={{
        fontSize: '22px',
        fontWeight: '500',
        color: '#1A1A2E',
        marginBottom: '2rem'
      }}>
        Tableau de bord
      </h1>

      {/* 📊 Les 3 cartes statistiques */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px'
      }}>
        <StatCard
          valeur={citoyens.length}
          label="Citoyens"
          couleur="#378ADD"
        />
        <StatCard
          valeur={institutions.length}
          label="Institutions"
          couleur="#1D9E75"
        />
        <StatCard
          valeur={certificats.length}
          label="Certificats"
          couleur="#BA7517"
        />
      </div>
    </div>
  )
}

function StatCard({ valeur, label, couleur }) {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '1.5rem',
      border: '0.5px solid #E2E8F0'
    }}>
      <p style={{
        fontSize: '12px',
        color: '#64748B',
        marginBottom: '8px'
      }}>
        {label}
      </p>
      <p style={{
        fontSize: '32px',
        fontWeight: '500',
        color: couleur
      }}>
        {valeur}
      </p>
    </div>
  )
}

export default DashboardHome