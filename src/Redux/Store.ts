import { loadingReducer } from './Reducer/LoadingReducer';
import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import { persistReducer, persistStore } from 'redux-persist'
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import { userReducer } from './Reducer/UserReducer'
import { imageReducer } from './Reducer/ImageProfileReducer'
import { winnerReducer } from './Reducer/WinnerReducer';

const createNoopStorage = () =>{
    return {
        getItem(_key: any) {
            return Promise.resolve(null);
        },
        setItem(_key: any, value: any) {
            return Promise.resolve(value);
        },
        removeItem(_key: any){
            return Promise.resolve();
        },
    };
};
const storage = typeof window !== 'undefined' ? createWebStorage("local") : createNoopStorage();
const rootPersitConfig = {
    key: "root_redux_persist",
    storage,
    whiteList: [
        "userReducer",
        "loadingReducer",
        "imageReducer",
        "winnerReducer"
    ]
} 

const rootReducer = combineReducers({
    userReducer: userReducer,
    loadingReducer: loadingReducer,
    imageReducer: imageReducer,
    winnerReducer:winnerReducer
})

const persistedReducer = persistReducer(rootPersitConfig, rootReducer)

 const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

 const persistor = persistStore(store)
 export { store, persistor };