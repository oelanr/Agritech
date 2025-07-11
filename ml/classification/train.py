import pandas as pd
import joblib
from utils import construire_arbre_id3

# Chemin vers les fichiers
DATA_PATH = 'ml/classification/data/data.csv'
MODEL_PATH = 'ml/classification/models/modele_arbre2.joblib'

def train_model():
    """
    Charge les données, entraîne le modèle d'arbre de décision et le sauvegarde.
    """
    print("--- Début de l'entraînement ---")
    
    # Charger les données
    try:
        df = pd.read_csv(DATA_PATH)
        print(f"Données chargées depuis '{DATA_PATH}'.")
    except FileNotFoundError:
        print(f"Erreur: Le fichier '{DATA_PATH}' est introuvable.")
        return

    # Convertir le DataFrame en liste de dictionnaires (format attendu par l'algo)
    # Note: La conversion des booléens est gérée automatiquement par pandas.
    data = df.to_dict(orient='records')
    
    # Identifier les features et la cible
    features = [col for col in df.columns if col != 'maladie']
    print(f"Features utilisées pour l'entraînement: {features}")

    # Construire l'arbre
    print("Construction de l'arbre de décision...")
    arbre = construire_arbre_id3(data, features)
    
    # Sauvegarder le modèle
    print(f"Sauvegarde du modèle dans '{MODEL_PATH}'...")
    joblib.dump(arbre, MODEL_PATH)
    
    print("--- Entraînement terminé avec succès! ---")

if __name__ == "__main__":
    train_model()
