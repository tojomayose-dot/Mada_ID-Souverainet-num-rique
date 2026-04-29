import { useState, useEffect } from 'react'
import { getInstitutions, ajouterInstitution, supprimerInstitution } from '../services/api'
import { Trash2, Building2 } from 'lucide-react'
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

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette institution ?")) {
      return;
    }

    try {
      await supprimerInstitution(id);
      setInstitutions(prev => prev.filter(inst => inst.id !== id));
      alert("Institution supprimée avec succès");
    } catch (error) {
      alert("Erreur lors de la suppression");
    }
  };

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
            <div key={institution.id} className="tableau-ligne" style={{ gridTemplateColumns: '2fr 1fr 1.5fr 1.5fr 0.8fr' }}>
              <span style={{ fontWeight: '500' }}>{institution.nom}</span>
              <span>{institution.type_institution}</span>
              <span className="texte-muted">{institution.adresse || '—'}</span>
              <span className="texte-muted">{institution.email || '—'}</span>
              <span>
                <button 
                  onClick={() => handleDelete(institution.id)}
                  style={{
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '13px'
                  }}
                >
                  <Trash2 size={16} />
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

export default InstitutionsPage