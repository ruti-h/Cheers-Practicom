"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { BrowserRouter as Router } from "react-router-dom"
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material"
import rtlPlugin from "stylis-plugin-rtl"
import { CacheProvider } from "@emotion/react"
import createCache from "@emotion/cache"
import { prefixer } from "stylis"
import Header from "./Header-N"

// Create RTL cache
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
})

// Create a theme with RTL support
const theme = createTheme({
  direction: "rtl",
  palette: {
    mode: "dark",
    primary: {
      main: "#daa520", // Gold
      light: "#e6be5a",
      dark: "#c49619",
      contrastText: "#000000",
    },
    secondary: {
      main: "#4a2c40", // Royal purple
      light: "#6a4c60",
      dark: "#2a0c20",
      contrastText: "#ffffff",
    },
    error: {
      main: "#f44336",
    },
    background: {
      default: "#0a0a0a",
      paper: "#111111",
    },
    text: {
      primary: "#ffffff",
      secondary: "#aaaaaa",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
})

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [currentPath, setCurrentPath] = useState("/")

  useEffect(() => {
    // עדכון הנתיב הנוכחי כאשר הוא משתנה
    const updatePath = () => {
      setCurrentPath(window.location.pathname)
    }

    // האזנה לשינויים בנתיב
    window.addEventListener("popstate", updatePath)

    // עדכון ראשוני
    updatePath()

    return () => {
      window.removeEventListener("popstate", updatePath)
    }
  }, [])

  // איפוס כיוון הטקסט ל-RTL
  useEffect(() => {
    document.dir = "rtl"
    document.body.style.direction = "rtl"

    return () => {
      document.dir = "ltr"
      document.body.style.direction = "ltr"
    }
  }, [])

  return (
    <html lang="he" dir="rtl">
      <body>
        <CacheProvider value={cacheRtl}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
              <Header currentPath={currentPath} />
              <main style={{ paddingTop: "64px" }}>{children}</main>
            </Router>
          </ThemeProvider>
        </CacheProvider>
      </body>
    </html>
  )
}
