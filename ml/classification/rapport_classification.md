# Rapport sur le Module de Classification

**Date :** 11 Juillet 2025
---

## 1. Objectif du Module

Le module de classification a pour objectif principal de diagnostiquer une maladie ou un état de santé d'une plante à partir d'une série de symptômes, de conditions environnementales et de pratiques culturales. Il constitue le "cerveau" de diagnostic de l'application Agritech, permettant de transformer des observations en une identification concrète.

## 2. Architecture et Fichiers

Le module est structuré de manière standard pour un projet de Machine Learning :

- `data/` : Contient les données nécessaires à l'entraînement et à la définition du problème.
  - `features_description.md` : Décrit les variables d'entrée (features).
  - `labels.txt` : Destiné à lister les classes cibles.
  - `data.csv` : Contient un jeu de données d'exemple.
- `models/` : Destiné à sauvegarder les modèles entraînés.
- `notebooks/` : Contient les carnets d'exploration et de test.
- `train.py` : Script pour l'entraînement du modèle.
- `predict.py` : Script pour utiliser un modèle entraîné afin de faire des prédictions.

## 3. Analyse des Données

### 3.1. Features (Variables Prédictives)

Les données d'entrée sont décrites dans `features_description.md` et se divisent en trois catégories :

- **Symptômes Visibles** : `taches`, `feuille_jaune`, `taches_circulaires`, `bord_feuille_brun`, `flétrissure`, `presence_champignons`.
- **Conditions Environnementales** : `humidite`, `luminosite`, `vent`, `pluie_recente`.
- **Pratiques Culturales** : `stade_croissance`, `fertilisation_recente`, `type_sol`, `irrigation`.

Toutes les features sont de type booléen (vrai/faux) ou catégoriel (valeurs prédéfinies), ce qui les rend directement utilisables par la plupart des modèles de classification.

### 3.2. Labels (Variable Cible)

La variable à prédire est `maladie`. D'après le fichier `prototype.txt`, les classes cibles identifiées sont :
- `mildiou`
- `carence`
- `rouille`
- `sain`

### 3.3. Structure des Données

Le fichier `prototype.txt` montre que les données sont structurées comme une liste de dictionnaires Python, ce qui est un format très courant et facile à manipuler.

```python
data = [
    {"taches": True,  "feuille_jaune": True,  "humidite": "élevée", "maladie": "mildiou"},
    {"taches": False, "feuille_jaune": True,  "humidite": "basse",  "maladie": "carence"},
    {"taches": True,  "feuille_jaune": False, "humidite": "élevée", "maladie": "rouille"},
    # ...
]
```

## 4. État Actuel et Limitations

Le module de classification est actuellement à l'état de **prototype fonctionnel**. La structure est en place, mais les données sont un **jeu d'exemple (mock data)**.

**Limitations principales :**
1.  **Taille des données** : Le jeu de données actuel est trop petit pour entraîner un modèle robuste et fiable.
2.  **Généralité des données** : Les features et les maladies sont génériques. Comme nous l'avons discuté, elles ne sont pas spécifiques au contexte agricole de Madagascar ou à une culture particulière comme le riz.

## 5. Recommandations et Prochaines Étapes

Pour faire évoluer ce module vers une version de production, les étapes suivantes sont recommandées :

1.  **Collecte de Données Réelles** : La priorité absolue est de remplacer les données prototypes par des données de terrain. Cela peut impliquer des enquêtes auprès d'agriculteurs ou la collecte de photos de plantes qui seront ensuite décrites avec les features définies.
2.  **Spécialisation** : Orienter la collecte de données vers les cultures les plus pertinentes pour Madagascar (ex: riz, manioc) et leurs maladies spécifiques (ex: pyriculariose pour le riz).
3.  **Entraînement du Modèle** : Une fois les données collectées, utiliser le script `train.py` pour entraîner un ou plusieurs modèles de classification (ex: Arbre de Décision, Forêt Aléatoire, SVM).
4.  **Évaluation** : Évaluer rigoureusement les performances du modèle (précision, rappel, F1-score) pour s'assurer de sa fiabilité avant de l'intégrer.
