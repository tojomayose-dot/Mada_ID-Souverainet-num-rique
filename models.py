from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from database import Base
import uuid
import datetime

# ==========================================
# 1. TABLE : INSTITUTION
# ==========================================
class Institution(Base):
    __tablename__ = "institutions" # Le nom du tiroir dans l'armoire

    # L'ordinateur génère un UUID (un identifiant unique très long) tout seul
    id_inst = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nom_inst = Column(String, nullable=False)
    cle_public_ed25519 = Column(String, nullable=False)
    email_contact = Column(String)

# ==========================================
# 2. TABLE : CITOYEN
# ==========================================
class Citoyen(Base):
    __tablename__ = "citoyens"

    id_citoyen = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nom = Column(String, nullable=False)
    prenom = Column(String, nullable=False)
    cin_hash = Column(String, nullable=False) # Secret (-) dans ton diagramme !
    wallet_adress = Column(String)

# ==========================================
# 3. TABLE : CERTIFICAT
# ==========================================
class Certificat(Base):
    __tablename__ = "certificats"

    id_certificat = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    type_doc = Column(String, nullable=False)
    date_emission = Column(DateTime, default=datetime.datetime.utcnow)
    
    # JSONB est un format spécial de PostgreSQL, parfait pour ton "contenu_brut" !
    contenu_brut = Column(JSONB, nullable=False) 
    
    sha256_hash = Column(String, nullable=False)
    ed25519_signature = Column(String, nullable=False)
    est_valide = Column(Boolean, default=True)

    # --- LES LIENS (Les lignes sur ton diagramme) ---
    # C'est comme ça qu'on dit "Ce certificat appartient à CE citoyen"
    institution_id = Column(UUID(as_uuid=True), ForeignKey("institutions.id_inst"))
    citoyen_id = Column(UUID(as_uuid=True), ForeignKey("citoyens.id_citoyen"))