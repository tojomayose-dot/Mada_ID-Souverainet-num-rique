import hashlib
import nacl.signing
import nacl.encoding

#  LES OUTILS CRYPTOGRAPHIQUES DE MADA-ID


def generer_hash_sha256(contenu: str) -> str:
    """
     Génère l'empreinte unique d'un document (comme une carte d'identité du document)
    - Si le document change d'un seul caractère → le hash change complètement
    - Impossible de retrouver le document original depuis le hash
    """
    return hashlib.sha256(contenu.encode('utf-8')).hexdigest()


def generer_paire_cles() -> dict:
    """
     Génère une paire de clés Ed25519 pour une institution
    - cle_secrete : garde précieusement (pour signer)
    - cle_publique : partage librement (pour vérifier)
    """
    cle_secrete = nacl.signing.SigningKey.generate()
    cle_publique = cle_secrete.verify_key

    return {
        "cle_secrete": cle_secrete.encode(encoder=nacl.encoding.HexEncoder).decode('utf-8'),
        "cle_publique": cle_publique.encode(encoder=nacl.encoding.HexEncoder).decode('utf-8')
    }


def signer_document(cle_secrete_hex: str, contenu: str) -> str:
    """
     Signe un document avec la clé secrète d'une institution
    - Prouve que c'est bien CETTE institution qui a émis le certificat
    - Impossible de falsifier sans la clé secrète
    """
    cle_secrete = nacl.signing.SigningKey(
        cle_secrete_hex.encode('utf-8'),
        encoder=nacl.encoding.HexEncoder
    )
    document_octets = contenu.encode('utf-8')
    document_signe = cle_secrete.sign(document_octets)

    return nacl.encoding.HexEncoder.encode(document_signe.signature).decode('utf-8')


def verifier_signature(cle_publique_hex: str, contenu: str, signature_hex: str) -> bool:
    """
     Vérifie qu'un certificat est authentique
    - Retourne True si la signature est valide
    - Retourne False si le document a été falsifié
    """
    try:
        cle_publique = nacl.signing.VerifyKey(
            cle_publique_hex.encode('utf-8'),
            encoder=nacl.encoding.HexEncoder
        )
        signature = nacl.encoding.HexEncoder.decode(signature_hex.encode('utf-8'))
        cle_publique.verify(contenu.encode('utf-8'), signature)
        return True
    except Exception:
        return False