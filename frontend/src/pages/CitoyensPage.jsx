import { useState, useEffect } from 'react'
import { getCitoyens } from '../services/api'

function CitoyensPage() {
  const [citoyens, setCitoyens] = useState([])
  const [chargement, setChargement] = useState(true)

  // 📋 Charge les citoyens au démarrage
  useEffect(() => {
    getCitoyens().then(data => {
      setCitoyens(data)
      setChargement(false)
    })
  }, [])

  return (
    <div>
      {/* 🏷️ Titre */}
      <h1 style={{
        fontSize: '22px',
        fontWeight: '500',
        color: '#1A1A2E',
        marginBottom: '2rem'
      }}>
        Citoyens
      </h1>

      {/* 📊 Tableau */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '0.5px solid #E2E8F0',
        overflow: 'hidden'
      }}>

        {/* En-tête du tableau */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr',
          padding: '12px 16px',
          backgroundColor: '#F8FAFC',
          borderBottom: '0.5px solid #E2E8F0',
          fontSize: '12px',
          color: '#64748B',
          fontWeight: '500'
        }}>
          <span>Nom complet</span>
          <span>CIN</span>
          <span>Date de naissance</span>
          <span>Email</span>
        </div>

        {/* Lignes du tableau */}
        {chargement ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748B' }}>
            Chargement...
          </div>
        ) : citoyens.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748B' }}>
            Aucun citoyen enregistré
          </div>
        ) : (
          citoyens.map(citoyen => (
            <div key={citoyen.id} style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr',
              padding: '12px 16px',
              borderBottom: '0.5px solid #E2E8F0',
              fontSize: '14px',
              color: '#1A1A2E'
            }}>
              <span>{citoyen.prenom} {citoyen.nom}</span>
              <span style={{
                fontFamily: 'monospace',
                fontSize: '12px',
                backgroundColor: '#E6F1FB',
                color: '#0C447C',
                padding: '2px 8px',
                borderRadius: '4px',
                display: 'inline-block'
              }}>
                {citoyen.cin}
              </span>
              <span>{citoyen.date_naissance}</span>
              <span style={{ color: '#64748B' }}>{citoyen.email || '—'}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default CitoyensPage