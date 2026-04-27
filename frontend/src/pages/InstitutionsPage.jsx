import { useState, useEffect } from 'react'
import { getInstitutions } from '../services/api'
import './InstitutionsPage.css'

function InstitutionsPage() {
  const [institutions, setInstitutions] = useState([])
  const [chargement, setChargement] = useState(true)

  useEffect(() => {
    getInstitutions().then(data => {
      setInstitutions(data)
      setChargement(false)
    })
  }, [])

  return (
    <div>
      <h1 className="page-titre">Institutions</h1>

      <div className="tableau-conteneur">

        {/* En-tête */}
        <div className="tableau-header">
          <span>Nom</span>
          <span>Type</span>
          <span>Adresse</span>
          <span>Email</span>
        </div>

        {/* Lignes */}
        {chargement ? (
          <div className="message-centre">Chargement...</div>
        ) : institutions.length === 0 ? (
          <div className="message-centre">Aucune institution enregistrée</div>
        ) : (
          institutions.map(institution => (
            <div key={institution.id} className="tableau-ligne">
              <span style={{ fontWeight: '500' }}>{institution.nom}</span>
              <span className="type-badge">{institution.type_institution}</span>
              <span className="texte-muted">{institution.adresse || '—'}</span>
              <span className="texte-muted">{institution.email || '—'}</span>
            </div>
          ))
        )}

      </div>
    </div>
  )
}

export default InstitutionsPage