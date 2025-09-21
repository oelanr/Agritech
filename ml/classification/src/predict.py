import joblib
import os

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

