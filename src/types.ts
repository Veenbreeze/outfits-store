export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  /** Short, candid fit note shown under the size picker. */
  fit: string;
  category: string;
  audience: 'Women' | 'Men' | 'Unisex';
  price: number;
  salePrice?: number;
  sizes: string[];
  colors: { name: string; hex: string }[];
  stock: number;
  image: string;
  featured?: boolean;
  newArrival?: boolean;
  modelUrl?: string;
};

export type CartLine = { productId: string; size: string; color: string; quantity: number };
