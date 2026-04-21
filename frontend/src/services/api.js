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