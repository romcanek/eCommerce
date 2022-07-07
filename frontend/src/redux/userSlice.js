import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        initUser: (state, payload) => {
            state.user = {
                id: payload.payload?.id,
                name: payload.payload?.name,
                email: payload.payload?.email,
                password: payload.payload?.password,
                admin: payload.payload?.admin,
                itemsIDs: payload.payload?.itemsIDs,
            };
        },
        dropUser: (state) => {
            state.user = null;
        },
    },
});

// Action creators are generated for each case reducer function
export const { initUser, dropUser } = userSlice.actions;

export default userSlice.reducer;
