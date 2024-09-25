import {configureStore,combineReducers} from '@reduxjs/toolkit'
import userReducer from './slice/userSlice'
import {persistReducer, persistStore} from 'redux-persist'
import { version } from 'mongoose'
import storage from 'redux-persist/lib/storage'

const rootReducer = combineReducers({
    user : userReducer
})

const persistConfig = {
    key: "root",
    storage,
    version : 1
}

const persistedReducer = persistReducer(persistConfig,rootReducer)


export const store = configureStore({
    reducer : persistedReducer,
    middleware  : (getMiddleware) => getMiddleware({
        serializableCheck : false
    })
})


export const persistor = persistStore(store)

