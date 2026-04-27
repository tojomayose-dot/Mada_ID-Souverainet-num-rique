import { useState, useEffect } from 'react'
import { getCitoyens } from '../services/api'
import './CitoyensPage.css'

function CitoyensPage() {
  const [citoyens, setCitoyens] = useState([])
  const [chargement, setChargement] = useState(true)

  useEffect(() => {
    getCitoyens().then(data => {
      setCitoyens(data)
      setChargement(false)
    })
  }, [])

  return (
    <div>
      <h1 className="page-titre">Citoyens</h1>

      <div className="tableau-conteneur">

        {/* En-tête */}
        <div className="tableau-header">
          <span>Nom complet</span>
          <span>CIN</span>
          <span>Date de naissance</span>
          <span>Email</span>
        </div>

        {/* Lignes */}
        {chargement ? (
          <div className="message-centre">Chargement...</div>
        ) : citoyens.length === 0 ? (
          <div className="message-centre">Aucun citoyen enregistré</div>
        ) : (
          citoyens.map(citoyen => (
            <div key={citoyen.id} className="tableau-ligne">
              <span>{citoyen.prenom} {citoyen.nom}</span>
              <span className="cin-badge">{citoyen.cin}</span>
              <span>{citoyen.date_naissance}</span>
              <span className="texte-muted">{citoyen.email || '—'}</span>
            </div>
          ))
        )}

      </div>
    </div>
  )
}

export default CitoyensPage