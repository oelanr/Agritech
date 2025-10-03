export const symptomData = {
  feuilles: [
    {
      key: "couleur_feuillage",
      label: "Couleur feuillage",
      type: "categorielle",
      options: ["Vert clair", "Jaune pâle", "Blanc", "Orange"],
      multiple: false
    },
    {
      key: "dessechement_feuilles",
      label: "Dessèchement des feuilles",
      type: "binaire",
    },
    {
      key: "taches_foliaires",
      label: "Tâches foliaires",
      type: "categorielle",
      options: ["Rondes", "Elliptiques", "Allongées", "Fusiformes"],
      multiple: false,
    },
    {
      key: "halo_taches",
      label: "Halo autour des tâches",
      type: "binaire",
    },
  ],
  tiges: [
    {
      key: "stries",
      label: "Stries",
      type: "binaire",
    },
    {
      key: "cassure_tige",
      label: "Cassure de tige",
      type: "binaire",
    },
  ],
  autres: [
    {
      key: "taille_taches",
      label: "Taille des tâches",
      type: "ordinale",
      options: ["Petite", "Moyenne", "Grande"],
    },
    {
      key: "saison",
      label: "Saison",
      type: "categorielle",
      options: ["Chaude", "Froide"],
    },
  ],
};
