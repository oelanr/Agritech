import pandas as pd
import joblib
import math
from collections import Counter
from arbre import NoeudArbre
import os
from graphviz import Digraph


BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Remonte 3 niveaux (de src/ vers la racine projet)
PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, '..', '..', '..'))

DATA_PATH = os.path.join(BASE_DIR, '..', 'data', 'dataset.csv')
MODEL_PATH = os.path.join(PROJECT_ROOT, 'models', 'modele_arbre2.joblib')
def entropie(exemples):
    total = len(exemples)
    if total == 0:
        return 0
    classes = [ex['maladie'] for ex in exemples]
    compte = Counter(classes)
    return -sum((nb/total) * math.log2(nb/total) for nb in compte.values())

def split(data, feature):
    groupes = {}
    for ex in data:
        val = ex[feature]
        if val not in groupes:
            groupes[val] = []
        groupes[val].append(ex)
    return groupes

def info_gain(data, groupes):
    total = len(data)
    entropie_totale = entropie(data)
    entropie_ponderee = sum(
        (len(groupe)/total) * entropie(groupe)
        for groupe in groupes.values()
    )
    return entropie_totale - entropie_ponderee

def meilleur_split(data, features):
    meilleur_gain = 0
    meilleur_feature = None
    meilleurs_groupes = None

    for feature in features:
        groupes = split(data, feature)
        if len(groupes) < 2:
            continue
        gain = info_gain(data, groupes)
        if gain > meilleur_gain:
            meilleur_gain = gain
            meilleur_feature = feature
            meilleurs_groupes = groupes
    
    return meilleur_feature, meilleurs_groupes
    
def classe_majoritaire(data):
    if not data:
        return None
    classes = [ex['maladie'] for ex in data]
    return Counter(classes).most_common(1)[0][0]

def toutes_meme_classe(data):
    if not data:
        return True
    premiere_classe = data[0]['maladie']
    return all(ex['maladie'] == premiere_classe for ex in data)

def construire_arbre_id3(data, features):
    if toutes_meme_classe(data):
        return NoeudArbre(classe=data[0]['maladie'])
    
    if not features:
        return NoeudArbre(classe=classe_majoritaire(data))
    
    if not data:
        return NoeudArbre(classe="inconnu")
    
    meilleur_feature, groupes = meilleur_split(data, features)
    
    if meilleur_feature is None:
        return NoeudArbre(classe=classe_majoritaire(data))
    
    racine = NoeudArbre(feature=meilleur_feature)
    features_restantes = [f for f in features if f != meilleur_feature]
    
    for valeur, sous_data in groupes.items():
        sous_arbre = construire_arbre_id3(sous_data, features_restantes)
        racine.enfants[valeur] = sous_arbre
    
    return racine

def afficher_arbre_graphviz(arbre: NoeudArbre, filename="arbre_decision"):
    dot = Digraph(comment="Arbre de Décision", format="png")
    dot.attr("node", shape="box", style="filled", color="lightblue2", fontname="Helvetica")

    def ajouter_noeud(noeud: NoeudArbre, parent_id=None, valeur=None):
        node_id = str(id(noeud))

        # Texte du noeud
        if noeud.classe is not None:
            etiquette = f"classe: {noeud.classe}"
            dot.node(node_id, etiquette, color="lightgreen")
        else:
            etiquette = noeud.feature
            dot.node(node_id, etiquette)

        # Relier au parent
        if parent_id is not None:
            if valeur is not None:
                dot.edge(parent_id, node_id, label=str(valeur))
            else:
                dot.edge(parent_id, node_id)

        for val, enfant in noeud.enfants.items():
            ajouter_noeud(enfant, node_id, val)

    ajouter_noeud(arbre)

    dot.render(filename, view=True)

def train_model():
    print("--- Début de l'entraînement ---")
    
    try:
        df = pd.read_csv(DATA_PATH)
        print(f"Données chargées depuis '{DATA_PATH}'.")
    except FileNotFoundError:
        print(f"Erreur: Le fichier '{DATA_PATH}' est introuvable.")
        return

    data = df.to_dict(orient='records')
    
    features = [col for col in df.columns if col != 'maladie']
    print(f"Features utilisées pour l'entraînement: {features}")

    print("Construction de l'arbre de décision...")
    arbre = construire_arbre_id3(data, features)
    
    # Affichage avec graphviz (image claire et hiérarchique)
    afficher_arbre_graphviz(arbre, filename="arbre_resultat")
    
    print(f"Sauvegarde du modèle dans '{MODEL_PATH}'...")
    joblib.dump(arbre, MODEL_PATH)
    
    print("--- Entraînement terminé avec succès! ---")

if __name__ == "__main__":
    train_model()
