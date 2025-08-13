export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: 'Pizza' | 'Burgers' | 'Fries' | 'Beverages' | 'Combos' | 'Desserts';
  image: string;
  rating: number;
  bestseller?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}
