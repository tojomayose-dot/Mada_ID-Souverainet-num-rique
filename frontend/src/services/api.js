// L'adresse de notre Backend FastAPI
const API_URL = "http://127.0.0.1:8000"

//  Fonctions pour les Citoyens
export async function getCitoyens() {
  const response = await fetch(`${API_URL}/citoyens/`)
  return response.json()
}

//  Fonctions pour les Institutions
export async function getInstitutions() {
  const response = await fetch(`${API_URL}/institutions/`)
  return response.json()
}

//  Fonctions pour les Certificats
export async function getCertificats() {
  const response = await fetch(`${API_URL}/certificats/`)
  return response.json()
}

//  Ajouter un citoyen
export async function ajouterCitoyen(donnees) {
  const response = await fetch(`${API_URL}/citoyens/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(donnees)
  })
  return response.json()
}

//  ajouter INstitu
export async function ajouterInstitution(donnees) {
  try {
    const response = await fetch(`${API_URL}/institutions/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(donnees),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Erreur lors de l'ajout de l'institution");
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur ajout institution:", error);
    throw error;
  }
}

// Ajout Certificats
export async function ajouterCertificat(donnees) {
  try {
    const response = await fetch(`${API_URL}/certificats/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(donnees),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Erreur lors de l'ajout du certificat");
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur ajout certificat:", error);
    throw error;
  }
}

// Supprimer un certificat
export async function supprimerCertificat(id) {
  if (!window.confirm("Voulez-vous vraiment supprimer ce certificat ?")) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/certificats/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la suppression");
    }
    return true;
  } catch (error) {
    console.error("Erreur suppression:", error);
    alert("Erreur lors de la suppression");
    throw error;
  }
}

// Supprimer une institution
export async function supprimerInstitution(id) {
  if (!window.confirm("Voulez-vous vraiment supprimer cette institution ?")) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/institutions/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error("Erreur lors de la suppression");
    return true;
  } catch (error) {
    console.error("Erreur suppression institution:", error);
    throw error;
  }
}