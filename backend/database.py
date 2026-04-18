from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# 1. L'adresse de notre armoire secrète !
# La formule c'est : postgresql://utilisateur:mot_de_passe@adresse_serveur/nom_du_tiroir
URL_BASE_DE_DONNEES = "postgresql://tojo:Vito@localhost/mada_db"

# 2. Le moteur (Le facteur qui va transporter nos données vers l'armoire)
engine = create_engine(URL_BASE_DE_DONNEES)

# 3. L'usine à sessions (Pour ouvrir et fermer l'armoire proprement à chaque fois qu'on veut y mettre un truc)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 4. Le moule de base (Toutes nos futures tables : citoyens, certificats... utiliseront ce moule)
Base = declarative_base()