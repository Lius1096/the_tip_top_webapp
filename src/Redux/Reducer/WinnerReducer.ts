import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface LoadingStore {
  value: boolean;
}

const initialState: LoadingStore = {
  value: false,
};

const gameSlice = createSlice({
  name: "winnerReducer",
  initialState,
  reducers: {
    addWinner: (state) => {
      state.value = true;
    },
    removeWinner: (state) => {
      state.value = false;
    }
  },
});
export const { addWinner, removeWinner } = gameSlice.actions;
export const winnerReducer = gameSlice.reducer;
