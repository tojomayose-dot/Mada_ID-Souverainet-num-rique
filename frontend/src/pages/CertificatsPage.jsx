import { useState, useEffect } from 'react'
import { getCertificats } from '../services/api'
import './CertificatsPage.css'

function CertificatsPage() {
  const [certificats, setCertificats] = useState([])
  const [chargement, setChargement] = useState(true)

  useEffect(() => {
    getCertificats().then(data => {
      setCertificats(data)
      setChargement(false)
    })
  }, [])

  return (
    <div>
      <h1 className="page-titre">Certificats</h1>

      <div className="tableau-conteneur">

        {/* En-tête */}
        <div className="tableau-header">
          <span>Type</span>
          <span>Citoyen ID</span>
          <span>Hash SHA-256</span>
          <span>Date</span>
          <span>Statut</span>
        </div>

        {/* Lignes */}
        {chargement ? (
          <div className="message-centre">Chargement...</div>
        ) : certificats.length === 0 ? (
          <div className="message-centre">Aucun certificat émis</div>
        ) : (
          certificats.map(cert => (
            <div key={cert.id} className="tableau-ligne">
              <span className="type-badge">{cert.type_certificat}</span>
              <span className="texte-muted">#{cert.citoyen_id}</span>
              <span className="hash-badge" title={cert.hash_document}>
                {cert.hash_document}
              </span>
              <span className="texte-muted">{cert.date_emission}</span>
              <span className={cert.est_valide ? 'valide-badge' : 'invalide-badge'}>
                {cert.est_valide ? 'valide' : 'invalide'}
              </span>
            </div>
          ))
        )}

      </div>
    </div>
  )
}

export default CertificatsPage