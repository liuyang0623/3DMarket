import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userSlice from "./modules/user";
import modelSlice from "./modules/model";
import utilsSlice from "./modules/utils";
import shoppingCartSlice from "./modules/shoppingCart";

const rootReducer = combineReducers({
  user: userSlice,
  model: modelSlice,
  utils: utilsSlice,
  shoppingCart: shoppingCartSlice,
});
const persistConfig = {
  key: "root",
  storage,
  blacklist: ["model", "utils"],
};
const myPersistReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: myPersistReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
