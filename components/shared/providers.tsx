"use client";

import { setCredentials } from "@/lib/store/authSlice";
import { store } from "@/lib/store/store";
import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { ThemeProvider } from "./theme-provider";

function AuthHydrator({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const userRaw = localStorage.getItem("user");
      if (token && userRaw) {
        const user = JSON.parse(userRaw);
        dispatch(setCredentials({ user, token }));
      }
    } catch {}
  }, [dispatch]);
  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AuthHydrator>{children}</AuthHydrator>
      </ThemeProvider>
    </Provider>
  );
}
