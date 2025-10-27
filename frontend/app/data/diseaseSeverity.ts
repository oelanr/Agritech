export type DiseaseSeverity = "Faible" | "Moyenne" | "Élevée";

interface DiseaseInfo {
  name: string;
  severity: DiseaseSeverity;
}

export const diseaseData: Record<string, DiseaseInfo> = {
  Gigantisme: { name: "Gigantisme", severity: "Faible" },
  Pyriculariose: { name: "Pyriculariose", severity: "Élevée" },
  Panachure_jaune: { name: "Panachure Jaune", severity: "Moyenne" },
  Helminthosporiose: { name: "Helminthosporiose", severity: "Moyenne" },
  Sain: { name: "Sain", severity: "Faible" },
};
