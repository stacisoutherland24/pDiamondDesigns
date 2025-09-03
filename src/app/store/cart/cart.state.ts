export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  // Add other product properties as needed
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export const initialCartState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};
