export interface Product {
  description: string;
  style: string;
  color: string;
  unit: string;
}

/**
 * Searchable description options for the line-item combobox.
 * In a later milestone these can be fetched from a product master.
 */
export const PRODUCTS: Product[] = [
  { description: "Cotton Fabric", style: "Plain", color: "White", unit: "Yds" },
  { description: "Polyester Fabric", style: "Twill", color: "Blue", unit: "Yds" },
  { description: "Denim Fabric", style: "Indigo", color: "Dark Blue", unit: "Yds" },
  { description: "Silk Fabric", style: "Satin", color: "Ivory", unit: "Yds" },
  { description: "Linen Fabric", style: "Plain", color: "Natural", unit: "Yds" },
  { description: "Wool Fabric", style: "Tweed", color: "Gray", unit: "Yds" },
  { description: "Rayon Fabric", style: "Challis", color: "Red", unit: "Yds" },
  { description: "Chiffon Fabric", style: "Plain", color: "Pink", unit: "Yds" },
  { description: "Satin Fabric", style: "Satin", color: "Black", unit: "Yds" },
  { description: "Twill Fabric", style: "Twill", color: "Khaki", unit: "Yds" },
];
