import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cart";
import userReducer from "./user";

export default configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer,
  },
});
