import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: "light",
    contrastValue: "dark",
};

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        toggleTheme(curState /*, payload */) {
            curState.contrastValue = curState.value;
            curState.value = curState.value === "light" ? "dark" : "light";
        },
    },
});

export const selectTheme = (state) => state.theme;
export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;