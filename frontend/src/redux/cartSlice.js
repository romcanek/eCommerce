import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cartItems: 0,
};

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        increment: (state) => {
            state.cartItems += 1;
        },
        decrement: (state) => {
            state.cartItems -= 1;
        },
        setItems: (state, payload) => {
            state.cartItems = payload.payload;
        },
    },
});

// Action creators are generated for each case reducer function
export const { increment, decrement, setItems } = cartSlice.actions;

export default cartSlice.reducer;
