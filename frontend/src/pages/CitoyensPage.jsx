import { useState, useEffect } from 'react'
import { getCitoyens, ajouterCitoyen } from '../services/api'
import './CitoyensPage.css'

function CitoyensPage() {
  const [citoyens, setCitoyens] = useState([])
  const [chargement, setChargement] = useState(true)

  // 📝 État du formulaire
  const [formulaire, setFormulaire] = useState({
    nom: '',
    prenom: '',
    date_naissance: '',
    lieu_naissance: '',
    adresse: '',
    email: ''
  })

  // 📋 Charge les citoyens au démarrage
  useEffect(() => {
    chargerCitoyens()
  }, [])

  function chargerCitoyens() {
    getCitoyens().then(data => {
      setCitoyens(data)
      setChargement(false)
    })
  }

  // ✏️ Met à jour le formulaire quand on tape
  function handleChangement(e) {
    setFormulaire({
      ...formulaire,
      [e.target.name]: e.target.value
    })
  }

  // 💾 Envoie le formulaire au backend
  async function handleSoumettre() {
    if (!formulaire.nom || !formulaire.prenom || !formulaire.date_naissance) {
      alert('Nom, Prénom et Date de naissance sont obligatoires !')
      return
    }
    await ajouterCitoyen(formulaire)
    // Remet le formulaire à zéro
    setFormulaire({
      nom: '',
      prenom: '',
      date_naissance: '',
      lieu_naissance: '',
      adresse: '',
      email: ''
    })
    // Recharge le tableau
    chargerCitoyens()
  }

  return (
    <div>
      <h1 className="page-titre">Citoyens</h1>

      {/* 📝 Formulaire d'ajout */}
      <div className="formulaire-conteneur">
        <h2 className="formulaire-titre">➕ Ajouter un citoyen</h2>

        <div className="formulaire-grille">
          <div className="champ-groupe">
            <label className="champ-label">Nom *</label>
            <input
              className="champ-input"
              name="nom"
              value={formulaire.nom}
              onChange={handleChangement}
              placeholder="ex: Rakoto"
            />
          </div>

          <div className="champ-groupe">
            <label className="champ-label">Prénom *</label>
            <input
              className="champ-input"
              name="prenom"
              value={formulaire.prenom}
              onChange={handleChangement}
              placeholder="ex: Jean"
            />
          </div>

          <div className="champ-groupe">
            <label className="champ-label">Date de naissance *</label>
            <input
              className="champ-input"
              name="date_naissance"
              type="date"
              value={formulaire.date_naissance}
              onChange={handleChangement}
            />
          </div>

          <div className="champ-groupe">
            <label className="champ-label">Lieu de naissance</label>
            <input
              className="champ-input"
              name="lieu_naissance"
              value={formulaire.lieu_naissance}
              onChange={handleChangement}
              placeholder="ex: Antananarivo"
            />
          </div>

          <div className="champ-groupe">
            <label className="champ-label">Adresse</label>
            <input
              className="champ-input"
              name="adresse"
              value={formulaire.adresse}
              onChange={handleChangement}
              placeholder="ex: Lot 12 Analakely"
            />
          </div>

          <div className="champ-groupe">
            <label className="champ-label">Email</label>
            <input
              className="champ-input"
              name="email"
              type="email"
              value={formulaire.email}
              onChange={handleChangement}
              placeholder="ex: jean@gmail.com"
            />
          </div>
        </div>

        <button
          className="bouton-enregistrer"
          onClick={handleSoumettre}
        >
          Enregistrer
        </button>
      </div>

      {/* 📊 Tableau */}
      <div className="tableau-conteneur">
        <div className="tableau-header">
          <span>Nom complet</span>
          <span>CIN</span>
          <span>Date de naissance</span>
          <span>Email</span>
        </div>

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