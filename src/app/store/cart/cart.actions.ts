import { createAction, props } from '@ngrx/store';

export const addToCart = createAction(
  '[Cart] Add Item',
  props<{ product: any }>() // Replace 'any' with your product interface
);

export const removeFromCart = createAction(
  '[Cart] Remove Item',
  props<{ productId: string }>()
);

export const updateQuantity = createAction(
  '[Cart] Update Quantity',
  props<{ productId: string; quantity: number }>()
);

export const clearCart = createAction('[Cart] Clear Cart');
