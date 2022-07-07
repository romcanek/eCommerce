import { configureStore } from "@reduxjs/toolkit";
import loggerReducer from "./authSlice";
import userReducer from "./userSlice";
import themeReducer from "./themeSlice";
import cartReducer from "./cartSlice";

export const store = configureStore({
    reducer: {
        logger: loggerReducer,
        user: userReducer,
        theme: themeReducer,
        cart: cartReducer,
    },
});
