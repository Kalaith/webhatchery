export interface Recipe {
  name: string;
  icon: string;
  materials: Record<string, number>;
  sellPrice: number;
  difficulty: number;
}
