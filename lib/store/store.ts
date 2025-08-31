import { configureStore } from "@reduxjs/toolkit";
import todoSlice from "./todoSlice";

const makeStore = () => {
  return configureStore({
    reducer: {
      todos: todoSlice,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const store = makeStore();
