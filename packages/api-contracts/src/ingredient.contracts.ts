export interface IngredientAliasContract {
  id: string;
  alias: string;
}

export interface IngredientContract {
  id: string;
  inciName: string;
  displayName: string;
  description?: string;
  casNumber?: string;
  ecNumber?: string;
  category?: string;
  functions: string[];
  origin?: string;
  molecularWeight?: number;
  waterSoluble: boolean;
  oilSoluble: boolean;
  skinTypes: string[];
  skinConcerns: string[];
  irritationRisk: string;
  photosensitivity: boolean;
  comedogenicRating?: number;
  allergenFlags: string[];
  regulatoryNotes?: string;
  aliases: IngredientAliasContract[];
}

export interface ProductFormulationItemContract {
  productId: string;
  ingredientId: string;
  displayOrder: number;
  declaredConcentration?: number;
  approximateRange?: string;
  isPrimaryActive: boolean;
  ingredient: IngredientContract;
}
