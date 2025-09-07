import { configureStore } from "@reduxjs/toolkit";
import todoSlice from "./todoSlice";
import authSlice from "./authSlice"

const makeStore = () => {
  return configureStore({
    reducer: {
      todos: todoSlice,
      auth: authSlice
    },
  });
};


export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const store = makeStore();
