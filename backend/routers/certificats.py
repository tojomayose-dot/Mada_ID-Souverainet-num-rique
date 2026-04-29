from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import date
import json

from database import get_db
from models import Certificat, Citoyen, Institution
from schemas import CertificatCreate, CertificatResponse
from core.security import generer_hash_sha256, generer_paire_cles, signer_document

#  LE GUICHET CERTIFICATS

router = APIRouter(
    prefix="/certificats",
    tags=["Certificats"]
)


#  LISTER tous les certificats
@router.get("/")
def lister_certificats(db: Session = Depends(get_db)):
    """Liste tous les certificats avec noms citoyen et institution"""
    certificats = db.query(Certificat).all()
    
    result = []
    for cert in certificats:
        citoyen = db.query(Citoyen).get(cert.citoyen_id)
        institution = db.query(Institution).get(cert.institution_id)
        
        result.append({
            "id": cert.id,
            "type_certificat": cert.type_certificat,
            "citoyen_id": cert.citoyen_id,
            "institution_id": cert.institution_id,
            "citoyen_prenom": citoyen.prenom if citoyen else None,
            "citoyen_nom": citoyen.nom if citoyen else None,
            "institution_nom": institution.nom if institution else None,
            "date_emission": cert.date_emission,
            "est_valide": cert.est_valide,
            "hash_document": cert.hash_document,
            "signature": cert.signature,
        })
    return result


#  ÉMETTRE un nouveau certificat
# POST /certificats/
@router.post("/", response_model=CertificatResponse, status_code=status.HTTP_201_CREATED)
def emettre_certificat(certificat: CertificatCreate, db: Session = Depends(get_db)):
    """
    Émet un certificat numérique signé pour un citoyen
    1. Vérifie que le citoyen et l'institution existent
    2. Génère le hash SHA-256 du document
    3. Signe le document avec Ed25519
    4. Sauvegarde dans la base de données
    """

    #  Vérifie que le citoyen existe
    citoyen = db.query(Citoyen).filter(Citoyen.id == certificat.citoyen_id).first()
    if not citoyen:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Citoyen avec l'ID {certificat.citoyen_id} introuvable"
        )

    #  Vérifie que l'institution existe
    institution = db.query(Institution).filter(Institution.id == certificat.institution_id).first()
    if not institution:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Institution avec l'ID {certificat.institution_id} introuvable"
        )

    #  Construit le contenu du document
    contenu_document = json.dumps({
        "type": certificat.type_certificat,
        "citoyen": f"{citoyen.prenom} {citoyen.nom}",
        "cin": citoyen.cin,
        "institution": institution.nom,
        "date": str(date.today())
    }, ensure_ascii=False)

    #  Génère le hash SHA-256
    hash_document = generer_hash_sha256(contenu_document)

    #  Génère une paire de clés et signe le document
    paire_cles = generer_paire_cles()
    signature = signer_document(paire_cles["cle_secrete"], contenu_document)

    #  Crée le certificat
    nouveau_certificat = Certificat(
        type_certificat=certificat.type_certificat,
        citoyen_id=certificat.citoyen_id,
        institution_id=certificat.institution_id,
        hash_document=hash_document,
        signature=signature,
        date_emission=date.today(),
        est_valide=True
    )

    #  Sauvegarde
    db.add(nouveau_certificat)
    db.commit()
    db.refresh(nouveau_certificat)

    return nouveau_certificat


#  CHERCHER un certificat par son ID
# GET /certificats/{certificat_id}
@router.get("/{certificat_id}", response_model=CertificatResponse)
def obtenir_certificat(certificat_id: int, db: Session = Depends(get_db)):
    """Retourne un certificat précis selon son ID"""

    certificat = db.query(Certificat).filter(Certificat.id == certificat_id).first()

    if not certificat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Certificat avec l'ID {certificat_id} introuvable"
        )

    return certificat

# SUPPRIMER un certificat
@router.delete("/{certificat_id}", status_code=status.HTTP_204_NO_CONTENT)
def supprimer_certificat(certificat_id: int, db: Session = Depends(get_db)):
    """Supprime un certificat par son ID"""
    certificat = db.query(Certificat).filter(Certificat.id == certificat_id).first()
    
    if not certificat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Certificat avec l'ID {certificat_id} introuvable"
        )
    
    db.delete(certificat)
    db.commit()
    return None   # 204 No Content