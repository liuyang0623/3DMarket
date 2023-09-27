import { createSlice } from "@reduxjs/toolkit";

interface GlobalLoadingI {
  show: boolean;
  title: string;
}
export interface UtilsStateI {
  globalLoading: GlobalLoadingI;
  shoppingCart: Array<any>;
}

const initialState: UtilsStateI = {
  globalLoading: {
    show: false,
    title: "",
  },
  shoppingCart: [],
};

export const utilsSlice = createSlice({
  name: "utils",
  initialState,
  reducers: {
    setGlobalLoading: (state, { payload }) => {
      state.globalLoading.show = payload.show;
      state.globalLoading.title = payload.title;
    },
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

export const { setGlobalLoading, addToCart, removeFromCart } =
  utilsSlice.actions;

export default utilsSlice.reducer;
