from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import Institution
from schemas import InstitutionCreate, InstitutionResponse

#  LE GUICHET INSTITUTIONS

router = APIRouter(
    prefix="/institutions",       # Toutes les routes commencent par /institutions
    tags=["Institutions"]         # Groupe dans la doc Swagger
)


#  LISTER toutes les institutions
# GET /institutions/
@router.get("/", response_model=List[InstitutionResponse])
def lister_institutions(db: Session = Depends(get_db)):
    """Retourne la liste de toutes les institutions enregistrées"""
    institutions = db.query(Institution).all()
    return institutions


#  AJOUTER une nouvelle institution
# POST /institutions/
@router.post("/", response_model=InstitutionResponse, status_code=status.HTTP_201_CREATED)
def creer_institution(institution: InstitutionCreate, db: Session = Depends(get_db)):
    """Enregistre une nouvelle institution"""

    nouvelle_institution = Institution(
        nom=institution.nom,
        type_institution=institution.type_institution,
        adresse=institution.adresse,
        email=institution.email
    )

    #  Sauvegarde dans la base de données
    db.add(nouvelle_institution)
    db.commit()
    db.refresh(nouvelle_institution)

    return nouvelle_institution


#  CHERCHER une institution par son ID
# GET /institutions/{institution_id}
@router.get("/{institution_id}", response_model=InstitutionResponse)
def obtenir_institution(institution_id: int, db: Session = Depends(get_db)):
    """Retourne une institution précise selon son ID"""

    institution = db.query(Institution).filter(Institution.id == institution_id).first()

    #  Si l'institution n'existe pas → erreur 404
    if not institution:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Institution avec l'ID {institution_id} introuvable"
        )

    return institution

@router.delete("/{institution_id}", status_code=status.HTTP_204_NO_CONTENT)
def supprimer_institution(
    institution_id: int,
    db: Session = Depends(get_db)
):
    institution = db.query(Institution).filter(
        Institution.id == institution_id
    ).first()

    if not institution:
        raise HTTPException(
            status_code=404,
            detail=f"Institution {institution_id} introuvable"
        )

    db.delete(institution)
    db.commit()