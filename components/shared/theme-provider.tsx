"use client"

import * as React from "react"

import {ThemeProvider as NexThemesProvider, type ThemeProviderProps} from "next-themes"


export function ThemeProvider({children, ...props}: ThemeProviderProps) {
    return(
        <NexThemesProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            {...props}
        >
            {children}
        </NexThemesProvider>
    )
}