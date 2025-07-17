from collections import Counter

class NoeudArbre:
    def __init__(self, feature=None, classe=None):
        self.feature = feature
        self.classe = classe
        self.enfants = {}

    def est_feuille(self):
        return self.classe is not None

    def predire(self, exemple):
        if self.est_feuille():
            return self.classe
        valeur = exemple.get(self.feature)
        if valeur in self.enfants:
            return self.enfants[valeur].predire(exemple)
        else:
            # Valeur inconnue : retour de la classe majoritaire parmi les enfants
            classes = [enfant.classe for enfant in self.enfants.values() if enfant.est_feuille()]
            if classes:
                return Counter(classes).most_common(1)[0][0]
            return None
