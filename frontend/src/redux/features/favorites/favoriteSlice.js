import { createSlice } from "@reduxjs/toolkit";
import {
  getFavoritesFromLocalStorage,
  addFavoriteToLocalStorage,
  removeFavoriteFromLocalStorage,
} from "../../../utils/localStorage.js";

const favoriteSlice = createSlice({
  name: "favorites",
  initialState: getFavoritesFromLocalStorage(),
  reducers: {
    addToFavorites: (state, action) => {
      if (!state.some((product) => product._id === action.payload._id)) {
        state.push(action.payload);
        addFavoriteToLocalStorage(action.payload);
      }
    },
    removeFromFavorites: (state, action) => {
      removeFavoriteFromLocalStorage(action.payload._id);
      return state.filter((product) => product._id !== action.payload._id);
    },
    setFavorites: (state, action) => {
      return action.payload;
    },
  },
});

export const { addToFavorites, removeFromFavorites, setFavorites } =
  favoriteSlice.actions;
export const selectFavoriteProduct = (state) => state.favorites;
export default favoriteSlice.reducer;