import math
from collections import Counter

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
        if gain>meilleur_gain:
            meilleur_gain = gain
            meilleur_feature = feature
            meilleurs_groupes = groupes
    
    return meilleur_feature, meilleurs_groupes
    
def classe_majoritaire(data):
    """Retourne la classe la plus fréquente"""
    if not data:
        return None
    classes = [ex['maladie'] for ex in data]
    return Counter(classes).most_common(1)[0][0]

def toutes_meme_classe(data):
    """Vérifie si tous les exemples ont la même classe"""
    if not data:
        return True
    premiere_classe = data[0]['maladie']
    return all(ex['maladie'] == premiere_classe for ex in data)

class NoeudArbre:
    """Représente un noeud de l'arbre"""
    def __init__(self, feature = None, classe = None):
        self.feature = feature
        self.classe = classe
        self.enfants = {}
        
        
    def est_feuille(self):
        return self.classe is not None
    
    def predire(self, exemple):
        """Prédit la classe d'un exemple"""
        if self.est_feuille():
            return self.classe
        
        valeur = exemple[self.feature]
        if valeur in self.enfants:
            return self.enfants[valeur].predire(exemple)
        
        
    def afficher(self, niveau = 0):
        indent = "  " * niveau
        if self.est_feuille():
            print(f"{indent}→ Classe: {self.classe}")
        else:
            print(f"{indent}Test: {self.feature}")
            for valeur, enfant in self.enfants.items():
                print(f"{indent}  Si {self.feature} = {valeur}:")
                enfant.afficher(niveau + 2)
                
        
            
def construire_arbre_id3(data, features):
    """Construit un arbre de décision avec l'algorithme ID3"""
    
    # Cas d'arrêt 1: tous les exemples ont la même classe
    if toutes_meme_classe(data):
        return NoeudArbre(classe=data[0]['maladie'])
    
    # Cas d'arrêt 2: plus de caractéristiques disponibles
    if not features:
        return NoeudArbre(classe=classe_majoritaire(data))
    
    # Cas d'arrêt 3: pas d'exemples
    if not data:
        return NoeudArbre(classe="inconnu")
    
    # Trouver la meilleure caractéristique
    meilleur_feature, groupes = meilleur_split(data, features)
    
    # Si aucune division n'améliore, créer une feuille
    if meilleur_feature is None:
        return NoeudArbre(classe=classe_majoritaire(data))
    
    # Créer le nœud racine
    racine = NoeudArbre(feature=meilleur_feature)
    
    # Caractéristiques restantes pour les sous-arbres
    features_restantes = [f for f in features if f != meilleur_feature]
    
    # Construire récursivement les sous-arbres
    for valeur, sous_data in groupes.items():
        sous_arbre = construire_arbre_id3(sous_data, features_restantes)
        racine.enfants[valeur] = sous_arbre
    
    return racine

if __name__ == "__main__":
    # Données d'exemple
    data = [
        {"taches": True,  "feuille_jaune": True,  "humidite": "élevée", "maladie": "mildiou"},
        {"taches": False, "feuille_jaune": True,  "humidite": "basse",  "maladie": "carence"},
        {"taches": True,  "feuille_jaune": False, "humidite": "élevée", "maladie": "rouille"},
        {"taches": True,  "feuille_jaune": True,  "humidite": "basse",  "maladie": "rouille"},
        {"taches": False, "feuille_jaune": False, "humidite": "élevée", "maladie": "sain"},
        {"taches": False, "feuille_jaune": False, "humidite": "basse",  "maladie": "sain"},
        {"taches": True,  "feuille_jaune": False, "humidite": "basse",  "maladie": "carence"},
        {"taches": False, "feuille_jaune": True,  "humidite": "élevée", "maladie": "mildiou"},
    ]
    
    features = ["taches", "feuille_jaune", "humidite"]
    
    print("=== Construction de l'arbre ID3 ===")
    arbre = construire_arbre_id3(data, features)
    
    print("\n=== Arbre de décision ===")
    arbre.afficher()
    
    print("\n=== Test de prédiction ===")
    test_exemples = [
        {"taches": True, "feuille_jaune": True, "humidite": "élevée"},
        {"taches": False, "feuille_jaune": False, "humidite": "basse"},
        {"taches": True, "feuille_jaune": False, "humidite": "basse"},
    ]
    
    for i, exemple in enumerate(test_exemples):
        prediction = arbre.predire(exemple)
        print(f"Exemple {i+1}: {exemple} → Prédiction: {prediction}")
    
    print("\n=== Analyse du premier split ===")
    feature, groupes = meilleur_split(data, features)
    print(f"Meilleure feature: {feature}")
    print(f"Entropie initiale: {entropie(data):.3f}")
    for val, groupe in groupes.items():
        print(f"  {feature} = {val}: {len(groupe)} exemples, entropie = {entropie(groupe):.3f}")