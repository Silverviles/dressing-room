import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import createWebStorage from "redux-persist/es/storage/createWebStorage";
import userReducer from "./user.slice";

const createNoopStorage = () => ({
  getItem: () => Promise.resolve(null),
  setItem: (_key, value) => Promise.resolve(value),
  removeItem: () => Promise.resolve(),
});

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

// Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
});

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"],
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create a store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export default store;
