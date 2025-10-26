import joblib
import os
import sys

# Rendre le module arbre accessible depuis ml/classification/src
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))  # Dossier actuel (src)
SRC_DIR = CURRENT_DIR  # Si predict.py est déjà dans ml/classification/src
if SRC_DIR not in sys.path:
    sys.path.append(SRC_DIR)

from arbre import NoeudArbre


# Chemin vers le modèle sauvegardé
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, '..', 'models', 'model.joblib')

try:
    arbre = joblib.load(MODEL_PATH)
    print(f"Modèle chargé depuis '{MODEL_PATH}'.")
except FileNotFoundError:
    arbre = None
    print(f"Erreur: Le modèle '{MODEL_PATH}' n'a pas été trouvé. Réentrainement nécessaire (via utils.py)")

def predict(exemple):
    if arbre is None:
        print("Modèle non chargé.")
        return None
    return arbre.predire(exemple)