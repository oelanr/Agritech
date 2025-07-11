# Description des Features

Ce document détaille les features utilisées pour la classification des maladies des plantes.

## ✅ Features (Binaires ou Catégorielles)

### 🔍 Symptômes Visibles (Booléens)
- `taches`: Présence de taches sur la plante.
- `feuille_jaune`: Feuilles jaunissantes.
- `taches_circulaires`: Taches de forme circulaire.
- `bord_feuille_brun`: Bord des feuilles de couleur brune.
- `flétrissure`: Flétrissure de la plante ou de ses parties.
- `presence_champignons`: Présence visible de champignons.

### 🌿 Conditions Environnementales (Catégorielles)
- `humidite`: Niveau d'humidité ambiant.
  - `"basse"`
  - `"moyenne"`
  - `"élevée"`
- `luminosite`: Exposition à la lumière.
  - `"faible"`
  - `"moyenne"`
  - `"forte"`
- `vent`: Force du vent.
  - `"faible"`
  - `"modéré"`
  - `"fort"`
- `pluie_recente`: Indique s'il a plu récemment (booléen).

### 🌾 Culture (Catégorielles ou Booléennes)
- `stade_croissance`: Stade de développement de la plante.
  - `"jeune"`
  - `"mature"`
  - `"floraison"`
- `fertilisation_recente`: Indique si une fertilisation a été faite récemment (booléen).
- `type_sol`: Type de sol.
  - `"argileux"`
  - `"sableux"`
  - `"limoneux"`
- `irrigation`: Méthode d'irrigation.
  - `"manuelle"`
  - `"automatique"`
  - `"aucune"`
