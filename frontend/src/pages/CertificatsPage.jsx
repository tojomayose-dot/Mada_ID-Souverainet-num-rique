import { useState, useEffect } from 'react'
import { getCertificats, getCitoyens, getInstitutions, ajouterCertificat, supprimerCertificat } from '../services/api'
import './CertificatsPage.css'

function CertificatsPage() {
  const [certificats, setCertificats] = useState([])
  const [citoyens, setCitoyens] = useState([])
  const [institutions, setInstitutions] = useState([])
  const [chargement, setChargement] = useState(true)
  
  const [formData, setFormData] = useState({
    citoyen_id: '',
    institution_id: '',
    type_certificat: '',
    date_validite: ''
  })
  
  const [message, setMessage] = useState({ type: '', texte: '' })
  const [submitting, setSubmitting] = useState(false)

  // Charger les données
  useEffect(() => {
    chargerDonnees()
  }, [])

  const chargerDonnees = async () => {
    try {
      setChargement(true)
      const [certs, cits, insts] = await Promise.all([
        getCertificats(),
        getCitoyens(),
        getInstitutions()
      ])
      setCertificats(certs)
      setCitoyens(cits)
      setInstitutions(insts)
    } catch (error) {
      console.error("Erreur chargement:", error)
    } finally {
      setChargement(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.citoyen_id || !formData.institution_id || !formData.type_certificat) {
      setMessage({ type: 'error', texte: 'Veuillez remplir les champs obligatoires' })
      return
    }

    setSubmitting(true)
    setMessage({ type: '', texte: '' })

    try {
      const nouveauCert = await ajouterCertificat(formData)
      
      // Trouver le nom du citoyen et de l'institution
      const citoyenSelectionne = citoyens.find(c => c.id === parseInt(formData.citoyen_id))
      const institutionSelectionnee = institutions.find(i => i.id === parseInt(formData.institution_id))

      // Ajouter le certificat avec les noms pour l'affichage
      const certAvecNoms = {
        ...nouveauCert,
        citoyen_prenom: citoyenSelectionne?.prenom,
        citoyen_nom: citoyenSelectionne?.nom,
        institution_nom: institutionSelectionnee?.nom,
      }

      setCertificats(prev => [certAvecNoms, ...prev])
      
      setMessage({ type: 'success', texte: 'Certificat émis avec succès !' })
      
      // Réinitialiser le formulaire
      setFormData({
        citoyen_id: '',
        institution_id: '',
        type_certificat: '',
        date_validite: ''
      })
    } catch (error) {
      setMessage({ type: 'error', texte: 'Erreur lors de l\'émission du certificat' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce certificat ?")) {
      return;
    }

    try {
      await supprimerCertificat(id);
      // Actualiser la liste après suppression
      setCertificats(prev => prev.filter(cert => cert.id !== id));
      alert("Certificat supprimé avec succès");
    } catch (error) {
      console.error("Erreur suppression:", error);   // ← important pour voir l'erreur
      alert("Erreur lors de la suppression du certificat");
    }
  };

  return (
    <div>
      <h1 className="page-titre">Certificats</h1>

      {/* Formulaire */}
      <div className="formulaire-conteneur">
        <h2 className="formulaire-titre">Émettre un nouveau certificat</h2>

        {message.texte && (
          <div style={{
            padding: '12px',
            marginBottom: '1rem',
            borderRadius: '8px',
            backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
            color: message.type === 'success' ? '#155724' : '#721c24'
          }}>
            {message.texte}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="formulaire-grille">
            <div className="champ-groupe">
              <label className="champ-label">Citoyen *</label>
              <select name="citoyen_id" value={formData.citoyen_id} onChange={handleChange} className="champ-input" required>
                <option value="">Sélectionner un citoyen</option>
                {citoyens.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.prenom} {c.nom} — {c.cin || ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="champ-groupe">
              <label className="champ-label">Institution *</label>
              <select name="institution_id" value={formData.institution_id} onChange={handleChange} className="champ-input" required>
                <option value="">Sélectionner une institution</option>
                {institutions.map(i => (
                  <option key={i.id} value={i.id}>
                    {i.nom} — {i.type_institution}
                  </option>
                ))}
              </select>
            </div>

            <div className="champ-groupe">
              <label className="champ-label">Type de certificat *</label>
              <input
                type="text"
                name="type_certificat"
                value={formData.type_certificat}
                onChange={handleChange}
                className="champ-input"
                placeholder="ex: Naissance, Permis..."
                required
              />
            </div>

            <div className="champ-groupe">
              <label className="champ-label">Date de validité</label>
              <input
                type="date"
                name="date_validite"
                value={formData.date_validite}
                onChange={handleChange}
                className="champ-input"
              />
            </div>
          </div>

          <button type="submit" className="bouton-enregistrer" disabled={submitting}>
            {submitting ? 'Émission...' : 'Émettre le certificat'}
          </button>
        </form>
      </div>

      {/* Tableau */}
      <div className="tableau-conteneur">
        <div className="tableau-header">
          <span>Citoyen</span>
          <span>Institution</span>
          <span>Type</span>
          <span>Date d'émission</span>
        </div>

        {chargement ? (
          <div className="message-centre">Chargement...</div>
        ) : certificats.length === 0 ? (
          <div className="message-centre">Aucun certificat émis</div>
        ) : (
certificats.map(cert => (
  <div key={cert.id} className="tableau-ligne" style={{ gridTemplateColumns: '1.8fr 1.8fr 1fr 1fr 0.8fr' }}>
    <span style={{ fontWeight: '500' }}>
      {cert.citoyen_prenom || ''} {cert.citoyen_nom || ''} 
      <span className="texte-muted">(#{cert.citoyen_id})</span>
    </span>
    <span>
      {cert.institution_nom || ''} 
      <span className="texte-muted">(#{cert.institution_id})</span>
    </span>
    <span>{cert.type_certificat || '—'}</span>
    <span className="texte-muted">
      {cert.date_emission ? new Date(cert.date_emission).toLocaleDateString('fr-FR') : '—'}
    </span>
    <span>
      <button 
        onClick={() => handleDelete(cert.id)}
        style={{
          backgroundColor: '#ef4444',
          color: 'white',
          border: 'none',
          padding: '6px 10px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '13px'
        }}
      >
        Supprimer
      </button>
    </span>
  </div>
))
        )}
      </div>
    </div>
  )
}

export default CertificatsPage