import joblib

# Chemin vers le modèle sauvegardé
MODEL_PATH = 'ml/classification/models/modele_arbre2.joblib'

def predict(exemple):
    """
    Charge le modèle et prédit la classe pour un nouvel exemple.
    
    Args:
        exemple (dict): Un dictionnaire représentant les caractéristiques 
                        de l'exemple à prédire.
                        Ex: {"taches": True, "feuille_jaune": False, "humidite": "basse"}
    
    Returns:
        La prédiction de la classe.
    """
    try:
        # Charger le modèle
        arbre = joblib.load(MODEL_PATH)
        print(f"Modèle chargé depuis '{MODEL_PATH}'.")
    except FileNotFoundError:
        print(f"Erreur: Le modèle '{MODEL_PATH}' n'a pas été trouvé.")
        print("Veuillez d'abord exécuter 'train.py' pour entraîner et sauvegarder le modèle.")
        return None

    # Faire la prédiction
    prediction = arbre.predire(exemple)
    
    return prediction

if __name__ == "__main__":
    # Exemple de nouvelle donnée (profil typique pour "mildiou")
    nouvel_exemple = {
        'taches': True,
        'feuille_jaune': True,
        'taches_circulaires': False,
        'bord_feuille_brun': False,
        'flétrissure': True,
        'presence_champignons': True,
        'humidite': 'élevée',
        'luminosite': 'moyenne',
        'vent': 'faible',
        'pluie_recente': True,
        'stade_croissance': 'mature',
        'fertilisation_recente': False,
        'type_sol': 'argileux',
        'irrigation': 'automatique'
    }
    
    print(f"Prédiction pour l'exemple : \n{nouvel_exemple}")
    
    # Obtenir la prédiction
    resultat = predict(nouvel_exemple)
    
    if resultat:
        print(f"→ Résultat de la prédiction : {resultat}")
    else:
        print("→ Impossible de faire une prédiction (chemin non trouvé dans l'arbre).")

    # Deuxième exemple (profil typique pour "sain")
    nouvel_exemple_2 = {
        'taches': False,
        'feuille_jaune': False,
        'taches_circulaires': False,
        'bord_feuille_brun': False,
        'flétrissure': False,
        'presence_champignons': False,
        'humidite': 'basse',
        'luminosite': 'forte',
        'vent': 'modéré',
        'pluie_recente': False,
        'stade_croissance': 'jeune',
        'fertilisation_recente': True,
        'type_sol': 'limoneux',
        'irrigation': 'manuelle'
    }
    print(f"\nPrédiction pour l'exemple : \n{nouvel_exemple_2}")
    resultat_2 = predict(nouvel_exemple_2)
    if resultat_2:
        print(f"→ Résultat de la prédiction : {resultat_2}")
    else:
        print("→ Impossible de faire une prédiction (chemin non trouvé dans l'arbre).")
