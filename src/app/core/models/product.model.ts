export type Category = 'HOMME' | 'FEMME' | 'ENFANT' | 'ACCESSOIRES';
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  brand: string;        // ← ajoute
  category: 'HOMME' | 'FEMME' | 'ENFANT' | 'ACCESSOIRES';
  size: string;
  color: string;
  active: boolean;
  createdAt: string;
}

export interface ProductPage {
  content: Product[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}