from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid

from database import get_db
from models import Citoyen
from schemas import CitoyenCreate, CitoyenResponse

#  LE GUICHET CITOYENS

router = APIRouter(
    prefix="/citoyens",       # Toutes les routes commencent par /citoyens
    tags=["Citoyens"]         # Groupe dans la doc Swagger
)


#  LISTER tous les citoyens
# GET /citoyens/
@router.get("/", response_model=List[CitoyenResponse])
def lister_citoyens(db: Session = Depends(get_db)):
    """Retourne la liste de tous les citoyens enregistrés"""
    citoyens = db.query(Citoyen).all()
    return citoyens


#  AJOUTER un nouveau citoyen
# POST /citoyens/
@router.post("/", response_model=CitoyenResponse, status_code=status.HTTP_201_CREATED)
def creer_citoyen(citoyen: CitoyenCreate, db: Session = Depends(get_db)):
    """Enregistre un nouveau citoyen et génère son CIN automatiquement"""

    #  Génération automatique d'un CIN unique
    cin_unique = "MG-" + str(uuid.uuid4())[:8].upper()

    #  Création de l'objet citoyen
    nouveau_citoyen = Citoyen(
        nom=citoyen.nom,
        prenom=citoyen.prenom,
        date_naissance=citoyen.date_naissance,
        lieu_naissance=citoyen.lieu_naissance,
        adresse=citoyen.adresse,
        email=citoyen.email,
        cin=cin_unique
    )

    # 💾 Sauvegarde dans la base de données
    db.add(nouveau_citoyen)
    db.commit()
    db.refresh(nouveau_citoyen)

    return nouveau_citoyen


#  CHERCHER un citoyen par son ID
# GET /citoyens/{citoyen_id}
@router.get("/{citoyen_id}", response_model=CitoyenResponse)
def obtenir_citoyen(citoyen_id: int, db: Session = Depends(get_db)):
    """Retourne un citoyen précis selon son ID"""

    citoyen = db.query(Citoyen).filter(Citoyen.id == citoyen_id).first()

    #  Si le citoyen n'existe pas → erreur 404
    if not citoyen:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Citoyen avec l'ID {citoyen_id} introuvable"
        )

    return citoyen