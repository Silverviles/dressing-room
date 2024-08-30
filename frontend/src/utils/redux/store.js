import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

// An empty reducer that just returns the current state
const emptyReducer = (state = {}) => state;

// Combine reducers (you can add other reducers here later if needed)
const rootReducer = combineReducers({
  empty: emptyReducer, // Replace or add actual reducers here when ready
});

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
  version: 1,
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
