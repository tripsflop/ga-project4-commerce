import { createSlice } from "@reduxjs/toolkit";
import { array } from "yup";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    products: [],
    quantity: 0,
    total: 0,
  },
  reducers: {
    addProduct: (state, action) => {
      state.quantity += action.payload.quantity;
      state.total += action.payload.retailPrice * action.payload.quantity;

      let status = true;
      // consolidate products
      if (state.products) {
        state.products.find((o) => {
          if (o._id === action.payload._id && o.size === action.payload.size) {
            o.quantity += action.payload.quantity;
            status = false;
          }
        });
      }
      if (status) {
        state.products.push(action.payload);
      }
    },
    removeProduct: (state, action) => {
      state.quantity -= action.payload.quantity;
      state.total -= action.payload.retailPrice * action.payload.quantity;

      if (state.products) {
        state.products.find((o, i) => {
          if (o._id === action.payload._id && o.size === action.payload.size) {
            o.quantity -= action.payload.quantity;
          }
        });
      }

      // remove item whose quantity is zero
      state.products = state.products.filter((item) => item.quantity !== 0);
    },
  },
});

export const { addProduct, removeProduct } = cartSlice.actions;
export default cartSlice.reducer;
