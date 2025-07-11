import math
from collections import Counter

class NoeudArbre:
    """Représente un noeud de l'arbre de décision."""
    def __init__(self, feature=None, classe=None):
        self.feature = feature
        self.classe = classe
        self.enfants = {}
        
    def est_feuille(self):
        return self.classe is not None
    
    def predire(self, exemple):
        """Prédit la classe d'un exemple en parcourant l'arbre."""
        if self.est_feuille():
            return self.classe
        
        valeur = exemple.get(self.feature)
        if valeur in self.enfants:
            return self.enfants[valeur].predire(exemple)
        
        # Si la valeur n'a pas été vue pendant l'entraînement, on ne peut prédire.
        return None

def entropie(exemples):
    """Calcule l'entropie d'un ensemble d'exemples."""
    total = len(exemples)
    if total == 0:
        return 0
    classes = [ex['maladie'] for ex in exemples]
    compte = Counter(classes)
    return -sum((nb/total) * math.log2(nb/total) for nb in compte.values())

def split(data, feature):
    """Divise les données en groupes basés sur une caract��ristique."""
    groupes = {}
    for ex in data:
        val = ex[feature]
        if val not in groupes:
            groupes[val] = []
        groupes[val].append(ex)
    return groupes

def info_gain(data, groupes):
    """Calcule le gain d'information d'une division."""
    total = len(data)
    entropie_totale = entropie(data)
    entropie_ponderee = sum(
        (len(groupe)/total) * entropie(groupe)
        for groupe in groupes.values()
    )
    return entropie_totale - entropie_ponderee

def meilleur_split(data, features):
    """Trouve la meilleure caractéristique pour diviser les données."""
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
    """Retourne la classe la plus fréquente dans les données."""
    if not data:
        return None
    classes = [ex['maladie'] for ex in data]
    return Counter(classes).most_common(1)[0][0]

def toutes_meme_classe(data):
    """Vérifie si tous les exemples ont la même classe."""
    if not data:
        return True
    premiere_classe = data[0]['maladie']
    return all(ex['maladie'] == premiere_classe for ex in data)

def construire_arbre_id3(data, features):
    """Construit un arbre de décision avec l'algorithme ID3."""
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