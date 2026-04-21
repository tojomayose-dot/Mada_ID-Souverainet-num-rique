from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date

#  SCHÉMAS INSTITUTION
class InstitutionBase(BaseModel):
    """Les infos de base d'une institution (ex: Mairie d'Antananarivo)"""
    nom: str
    type_institution: str          # ex: "Mairie", "Hôpital", "Université"
    adresse: Optional[str] = None
    email: Optional[EmailStr] = None

class InstitutionCreate(InstitutionBase):
    """Formulaire pour CRÉER une institution (ce qu'on reçoit)"""
    pass  # Hérite de tout InstitutionBase

class InstitutionResponse(InstitutionBase):
    """Ce qu'on RENVOIE au client (avec l'ID généré)"""
    id: int

    class Config:
        from_attributes = True  # Permet de lire depuis la base de données


#  SCHÉMAS CITOYEN
class CitoyenBase(BaseModel):
    """Les infos de base d'un citoyen malgache"""
    nom: str
    prenom: str
    date_naissance: date            # Format : 2000-01-31
    lieu_naissance: Optional[str] = None
    adresse: Optional[str] = None
    email: Optional[EmailStr] = None

class CitoyenCreate(CitoyenBase):
    """Formulaire pour CRÉER un citoyen (ce qu'on reçoit)"""
    pass  # Hérite de tout CitoyenBase

class CitoyenResponse(CitoyenBase):
    """Ce qu'on RENVOIE au client (avec l'ID et le CIN généré)"""
    id: int
    cin: str                        # Numéro CIN unique généré automatiquement

    class Config:
        from_attributes = True


#  SCHÉMAS CERTIFICAT
class CertificatBase(BaseModel):
    """Les infos de base d'un certificat"""
    type_certificat: str            # ex: "Naissance", "Résidence", "Mariage"
    citoyen_id: int
    institution_id: int

class CertificatCreate(CertificatBase):
    """Formulaire pour CRÉER un certificat"""
    pass

class CertificatResponse(CertificatBase):
    """Ce qu'on RENVOIE avec la signature numérique"""
    id: int
    hash_document: str              # Empreinte SHA-256 du document
    signature: str                  # Signature Ed25519 de l'institution
    date_emission: date
    est_valide: bool

    class Config:
        from_attributes = True