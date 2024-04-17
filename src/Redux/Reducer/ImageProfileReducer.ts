import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import defaultProfile from "../../Assets/Icons/profilePicture.svg";

interface ImageStore {
  value: string;
}

const initialState: ImageStore = {
  value: defaultProfile,
};

const imageSlice = createSlice({
  name: "imageReducer",
  initialState,
  reducers: {
    setImageProfile: (state, action: PayloadAction<ImageStore>) => {
      state.value = action.payload.value;
    },
    removeImageProfile: (state) => {
      state.value = defaultProfile;
    },
  },
});

export const { setImageProfile, removeImageProfile } = imageSlice.actions;
export const imageReducer = imageSlice.reducer;
