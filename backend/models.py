from sqlalchemy import Column, Integer, String, Date, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

#  TABLE INSTITUTION
class Institution(Base):
    __tablename__ = "institutions"

    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String, nullable=False)
    type_institution = Column(String, nullable=False)   # ex: "Mairie"
    adresse = Column(String, nullable=True)
    email = Column(String, nullable=True)

    #  Lien vers les certificats émis par cette institution
    certificats = relationship("Certificat", back_populates="institution")


#  TABLE CITOYEN
class Citoyen(Base):
    __tablename__ = "citoyens"

    id = Column(Integer, primary_key=True, index=True)
    cin = Column(String, unique=True, nullable=False)   # CIN généré automatiquement
    nom = Column(String, nullable=False)
    prenom = Column(String, nullable=False)
    date_naissance = Column(Date, nullable=False)
    lieu_naissance = Column(String, nullable=True)
    adresse = Column(String, nullable=True)
    email = Column(String, nullable=True)

    #  Lien vers les certificats du citoyen
    certificats = relationship("Certificat", back_populates="citoyen")


#  TABLE CERTIFICAT
class Certificat(Base):
    __tablename__ = "certificats"

    id = Column(Integer, primary_key=True, index=True)
    type_certificat = Column(String, nullable=False)    # ex: "Naissance"
    hash_document = Column(String, nullable=False)      # Empreinte SHA-256
    signature = Column(String, nullable=False)          # Signature Ed25519
    date_emission = Column(Date, nullable=False)
    est_valide = Column(Boolean, default=True)

    #  Clés étrangères (qui a ce certificat ? quelle institution l'a émis ?)
    citoyen_id = Column(Integer, ForeignKey("citoyens.id"))
    institution_id = Column(Integer, ForeignKey("institutions.id"))

    #  Relations
    citoyen = relationship("Citoyen", back_populates="certificats")
    institution = relationship("Institution", back_populates="certificats")