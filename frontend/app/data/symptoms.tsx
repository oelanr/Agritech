export const symptomData = {
  feuilles: [
    {
      key: "couleur_feuillage",
      label: "Couleur feuillage",
      type: "categorielle",
      options: ['jaune vert pâle', 'presque blanche', 'gris', 'blanc-gris','jaune panaché', 'blanc', 'orange', 'vert pâle', 'vert','vert clair', 'jaune pâle'],
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
      options: ['aucune', 'rondes', 'elliptiques', 'fusiformes', 'stries','coleoptiles', 'ovales', 'allongées'],
      multiple: false,
    },
    {
      key: "halo_taches",
      label: "Halo autour des tâches",
      type: "binaire",
    },
    {
      key: "taille_taches",
      label: "Taille des tâches",
      type: "ordinale",
      options: ['aucune', 'petite', 'grande', 'moyenne'],
    },
    {
      key: 'enroulement_feuilles',
      label: "Enroulement des feuilles",
      type:"binaire"
    }
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
    {
      key: "stérilité",
      label: "Stérilité",
      type: "binaire",
    },
    {
      key: "taches_sur_graines",
      label: "Tâches sur les graines",
      type: "binaire",
    },
    {
      key: "taille_plant",
      label: "Taille des plants",
      type: "ordinale",
      options: ['très grand', 'rabougri', 'grand', 'normal'],
    },
    {
      key: "tallage",
      label: "Tallage",
      type: "categorielle",
      options: ['réduit', 'normal'],
    },
  ],
  autres: [
    {
      key: "humidite",
      label: "Humidité",
      type: "categorielle",
      options: ['basse', 'moyenne', 'haute', 'humide', 'sec'],
      multiple:false
    },
    {
      key: "irrigation",
      label: "Irrigation",
      type: "categorielle",
      options: ['pluvial', 'sol sec', 'irrigué'],
      multiple:false
    },
    {
      key: "saison",
      label: "Saison",
      type: "categorielle",
      options: ["Chaude", "Froide"],
      multiple:false
    },
    {
      key: "semences_infectées",
      label: "Semences infectées",
      type: "binaire",
    },
  ],
};
