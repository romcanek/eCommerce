import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    logged: false,
};

export const loggerSlice = createSlice({
    name: "logger",
    initialState,
    reducers: {
        login: (state) => {
            state.logged = true;
        },
        logout: (state) => {
            state.logged = false;
        },
    },
});

// Action creators are generated for each case reducer function
export const { login, logout } = loggerSlice.actions;

export default loggerSlice.reducer;
