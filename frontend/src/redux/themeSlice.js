import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    theme: "dark",
};

export const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.theme = state.theme === "dark" ? "light" : "dark";
            localStorage.setItem("pref", state.theme);
        },
        setTheme: (state, payload) => {
            state.theme = payload.payload;
            localStorage.setItem("pref", state.theme);
        },
    },
});

// Action creators are generated for each case reducer function
export const { toggleTheme, setTheme } = themeSlice.actions;

export default themeSlice.reducer;
