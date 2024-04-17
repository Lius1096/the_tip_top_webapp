import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface LoadingStore {
  value: boolean;
}

const initialState: LoadingStore = {
  value: false,
};

const loadingSlice = createSlice({
  name: "loadingReducer",
  initialState,
  reducers: {
    startLoading: (state) => {
      state.value = true;
    },
    stopLoading: (state) => {
      state.value = false;
    },
  },
});
export const { startLoading, stopLoading } = loadingSlice.actions;
export const loadingReducer = loadingSlice.reducer;
