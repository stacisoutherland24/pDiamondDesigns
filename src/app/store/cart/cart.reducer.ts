import { createReducer, on } from '@ngrx/store';
import { CartState, initialCartState, CartItem } from './cart.state';
import * as CartActions from './cart.actions';

// Load initial state from localStorage
const loadCartFromStorage = (): CartState => {
  try {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      // Validate the structure matches your CartState interface
      if (parsedCart.items && Array.isArray(parsedCart.items)) {
        return {
          items: parsedCart.items,
          totalItems: parsedCart.totalItems || 0,
          totalPrice: parsedCart.totalPrice || 0,
        };
      }
    }
    return initialCartState;
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return initialCartState;
  }
};

// Use localStorage state as initial state
const initialState: CartState = loadCartFromStorage();

export const cartReducer = createReducer(
  initialState, // Changed from initialCartState to initialState
  on(CartActions.addToCart, (state, { product }) => {
    const existingItem = state.items.find((item) => item.id === product.id);

    if (existingItem) {
      // Item already exists, update quantity
      const updatedItems = state.items.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );

      return {
        ...state,
        items: updatedItems,
        totalItems: state.totalItems + 1,
        totalPrice: state.totalPrice + product.price,
      };
    } else {
      // New item, add to cart
      const newItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
      };

      return {
        ...state,
        items: [...state.items, newItem],
        totalItems: state.totalItems + 1,
        totalPrice: state.totalPrice + product.price,
      };
    }
  }),

  on(CartActions.removeFromCart, (state, { productId }) => {
    const itemToRemove = state.items.find((item) => item.id === productId);
    if (!itemToRemove) return state;

    const updatedItems = state.items.filter((item) => item.id !== productId);

    return {
      ...state,
      items: updatedItems,
      totalItems: state.totalItems - itemToRemove.quantity,
      totalPrice: state.totalPrice - itemToRemove.price * itemToRemove.quantity,
    };
  }),

  on(CartActions.updateQuantity, (state, { productId, quantity }) => {
    const existingItem = state.items.find((item) => item.id === productId);
    if (!existingItem) return state;

    const quantityDiff = quantity - existingItem.quantity;
    const updatedItems = state.items.map((item) =>
      item.id === productId ? { ...item, quantity } : item
    );

    return {
      ...state,
      items: updatedItems,
      totalItems: state.totalItems + quantityDiff,
      totalPrice: state.totalPrice + existingItem.price * quantityDiff,
    };
  }),

  on(CartActions.clearCart, () => initialCartState)
);
