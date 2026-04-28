import { useState, useEffect } from 'react'
import { getInstitutions, ajouterInstitution } from '../services/api'
import './InstitutionsPage.css'

function InstitutionsPage() {
  const [institutions, setInstitutions] = useState([])
  const [chargement, setChargement] = useState(true)
  const [formData, setFormData] = useState({
    nom: '',
    type_institution: '',
    adresse: '',
    email: '',
  })
  const [message, setMessage] = useState({ type: '', texte: '' })
  const [submitting, setSubmitting] = useState(false)

  // Charger les institutions
  useEffect(() => {
    chargerInstitutions()
  }, [])

  const chargerInstitutions = async () => {
    try {
      setChargement(true)
      const data = await getInstitutions()
      setInstitutions(data)
    } catch (error) {
      console.error("Erreur chargement institutions:", error)
    } finally {
      setChargement(false)
    }
  }

  // Gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation simple
    if (!formData.nom || !formData.type_institution || !formData.email) {
      setMessage({ type: 'error', texte: 'Veuillez remplir les champs obligatoires (*)' })
      return
    }

    setSubmitting(true)
    setMessage({ type: '', texte: '' })

    try {
      await ajouterInstitution(formData)
      setMessage({ type: 'success', texte: 'Institution ajoutée avec succès !' })
      
      // Réinitialiser le formulaire
      setFormData({
        nom: '',
        type_institution: '',
        adresse: '',
        email: '',
        telephone: ''
      })

      // Recharger le tableau
      await chargerInstitutions()
    } catch (error) {
      setMessage({ 
        type: 'error', 
        texte: error.message || "Une erreur est survenue lors de l'ajout" 
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h1 className="page-titre">Institutions</h1>

      {/* ==================== FORMULAIRE D'AJOUT ==================== */}
      <div className="formulaire-conteneur">
        <h2 className="formulaire-titre">Ajouter une nouvelle institution</h2>
        
        {message.texte && (
          <div style={{
            padding: '12px',
            marginBottom: '1rem',
            borderRadius: '8px',
            backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
            color: message.type === 'success' ? '#155724' : '#721c24',
            fontSize: '14px'
          }}>
            {message.texte}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="formulaire-grille">
            <div className="champ-groupe">
              <label className="champ-label">Nom de l'institution *</label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className="champ-input"
                required
              />
            </div>

            <div className="champ-groupe">
              <label className="champ-label">Type d'institution *</label>
              <input
                type="text"
                name="type_institution"
                value={formData.type_institution}
                onChange={handleChange}
                className="champ-input"
                placeholder="ex: Université, Banque, Ministère..."
                required
              />
            </div>

            <div className="champ-groupe">
              <label className="champ-label">Adresse</label>
              <input
                type="text"
                name="adresse"
                value={formData.adresse}
                onChange={handleChange}
                className="champ-input"
              />
            </div>

            <div className="champ-groupe">
              <label className="champ-label">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="champ-input"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="bouton-enregistrer"
            disabled={submitting}
          >
            {submitting ? 'Enregistrement...' : 'Ajouter l\'institution'}
          </button>
        </form>
      </div>

      {/* ==================== TABLEAU ==================== */}
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