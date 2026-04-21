from fastapi import FastAPI
import nacl.signing
import nacl.encoding
import json
from database import engine, Base
import models
from routers import citoyens, institutions, certificats

app = FastAPI(title="Mada-ID Backend")

# Crée toutes les tables dans PostgreSQL
Base.metadata.create_all(bind=engine)

#  Branche les guichet
app.include_router(citoyens.router)
app.include_router(institutions.router)
app.include_router(certificats.router)

# --- MISSION 1 : L'ACCUEIL ---
@app.get("/")
def dire_bonjour():
    return {"message": "Bienvenue sur l'API de Mada-ID ! Le projet est lancé !"}

# --- MISSION 2 : LES CLÉS ---
@app.get("/generer-cles")
def creer_des_cles():
    cle_secrete = nacl.signing.SigningKey.generate()
    cle_publique = cle_secrete.verify_key
    cle_secrete_texte = cle_secrete.encode(encoder=nacl.encoding.HexEncoder).decode('utf-8')
    cle_publique_texte = cle_publique.encode(encoder=nacl.encoding.HexEncoder).decode('utf-8')
    return {
        "message": "Voici les clés pour l'Institution !",
        "cle_publique": cle_publique_texte,
        "cle_secrete": cle_secrete_texte
    }

# --- MISSION 3 : SIGNER LE DIPLÔME ---
@app.get("/signer-diplome")
def signer_un_diplome():
    diplome = {
        "nom_etudiant": "Tojo",
        "universite": "Université de Madagascar",
        "grade": "Licence Informatique",
        "annee": 2024
    }
    cle_secrete = nacl.signing.SigningKey.generate()
    diplome_texte = json.dumps(diplome)
    diplome_octets = diplome_texte.encode('utf-8')
    document_signe = cle_secrete.sign(diplome_octets)
    signature_texte = nacl.encoding.HexEncoder.encode(document_signe.signature).decode('utf-8')
    cle_publique = cle_secrete.verify_key.encode(encoder=nacl.encoding.HexEncoder).decode('utf-8')
    return {
        "message": "Diplôme certifié avec succès !",
        "donnees_diplome": diplome,
        "signature_ed25519": signature_texte,
        "cle_publique_pour_verifier": cle_publique
    }

# --- TEST CONNEXION BASE DE DONNÉES ---
try:
    engine.connect()
    print("✅ SUCCÈS : FastAPI est bien connecté à PostgreSQL !")
except Exception as e:
    print("❌ ERREUR de connexion :", e)