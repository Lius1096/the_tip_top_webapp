import { PayloadAction, createSlice } from "@reduxjs/toolkit"

 interface UserStore {
    role: number,
    profile: any
 }

const initialState: UserStore = {
    role: -1,
    profile: null
}

const userSlice = createSlice({
    name: "userReducer",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<UserStore>) => {
             state.role = action.payload.role
             state.profile = action.payload.profile
        },
        logout: (state) => {
            state.profile = null
            state.role = -1
        
        }

    }
})

export const {login, logout} = userSlice.actions
export const userReducer = userSlice.reducer