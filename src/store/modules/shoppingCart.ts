import { createSlice } from "@reduxjs/toolkit";

export interface ShoppingCartStateI {
  shoppingCart: Array<any>;
}

const initialState: ShoppingCartStateI = {
  shoppingCart: [],
};

export const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {
    addToCart: (state, { payload }) => {
      state.shoppingCart = [...state.shoppingCart, payload.good];
    },
    removeFromCart: (state, { payload }) => {
      const removeIndex = state.shoppingCart.findIndex(
        (v: any) => v.id === payload.id
      );
      const shoppingCartTemp = state.shoppingCart;
      shoppingCartTemp.splice(removeIndex, 1);
      state.shoppingCart = shoppingCartTemp;
    },
  },
});

export const { addToCart, removeFromCart } =
shoppingCartSlice.actions;

export default shoppingCartSlice.reducer;
