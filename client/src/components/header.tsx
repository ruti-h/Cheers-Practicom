"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { Synagogue as SynagoguIcon, Menu as MenuIcon } from "@mui/icons-material"

interface HeaderProps {
  currentPath?: string
}

const Header: React.FC<HeaderProps> = ({ currentPath = "/" }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // עקוב אחרי גלילת העמוד כדי להוסיף אפקט שקיפות
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [scrolled])

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")
    ) {
      return
    }
    setDrawerOpen(open)
  }

  const navItems = [
    { title: "דף הבית", path: "/" },
    { title: "הרשמה", path: "/register" },
    { title: "התחברות", path: "/login" },
    { title: "מקומות מומלצים לפגישה", path: "/meeting-places", highlight: true },
  ]

  const isActive = (path: string) => currentPath === path

  return (
    <AppBar
      position="fixed"
      sx={{
        bgcolor: scrolled ? "rgba(0, 0, 0, 0.95)" : "rgba(0, 0, 0, 0.85)",
        backdropFilter: "blur(10px)",
        boxShadow: scrolled ? "0 4px 30px rgba(0, 0, 0, 0.4)" : "0 4px 30px rgba(0, 0, 0, 0.3)",
        color: "#fff",
        borderBottom: "1px solid rgba(218, 165, 32, 0.3)",
        transition: "all 0.3s ease",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            gap: 1,
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: -2,
              right: 0,
              width: "100%",
              height: "2px",
              background: "linear-gradient(90deg, transparent, #daa520)",
              transform: "scaleX(0)",
              transformOrigin: "left",
              transition: "transform 0.3s ease",
            },
            "&:hover::after": {
              transform: "scaleX(1)",
              transformOrigin: "right",
            },
          }}
        >
          <SynagoguIcon
            sx={{
              color: "#daa520",
              animation: "glow 3s infinite alternate",
              "@keyframes glow": {
                "0%": { filter: "drop-shadow(0 0 2px rgba(218, 165, 32, 0.3))" },
                "100%": { filter: "drop-shadow(0 0 8px rgba(218, 165, 32, 0.6))" },
              },
            }}
          />
          לחיים מרכז השידוכים
        </Typography>

        {isMobile ? (
          <>
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              sx={{ color: "#daa520" }}
            >
              <MenuIcon />
            </IconButton>
            <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
              <Box
                sx={{
                  width: 250,
                  bgcolor: "#111111",
                  height: "100%",
                  borderLeft: "1px solid rgba(218, 165, 32, 0.3)",
                }}
                role="presentation"
                onClick={toggleDrawer(false)}
                onKeyDown={toggleDrawer(false)}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    p: 2,
                    borderBottom: "1px solid rgba(218, 165, 32, 0.3)",
                  }}
                >
                  <SynagoguIcon sx={{ color: "#daa520" }} />
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "#ffffff" }}>
                    תפריט
                  </Typography>
                </Box>
                <List>
                  {navItems.map((item) => (
                    <ListItem
                      key={item.path}
                      component={Link}
                      to={item.path}
                      sx={{
                        color: isActive(item.path) ? "#daa520" : "#ffffff",
                        bgcolor: isActive(item.path) ? "rgba(218, 165, 32, 0.1)" : "transparent",
                        "&:hover": {
                          bgcolor: "rgba(218, 165, 32, 0.05)",
                        },
                      }}
                    >
                      <ListItemText
                        primary={item.title}
                        primaryTypographyProps={{
                          fontWeight: isActive(item.path) ? "bold" : "normal",
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Drawer>
          </>
        ) : (
          <Box sx={{ display: "flex", gap: 2 }}>
            {navItems.map((item) =>
              item.highlight ? (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  variant="contained"
                  sx={{
                    background: isActive(item.path)
                      ? "linear-gradient(45deg, #c49619, #daa520)"
                      : "linear-gradient(45deg, #daa520, #e6be5a)",
                    color: "#000",
                    boxShadow: "0 4px 20px rgba(218, 165, 32, 0.3)",
                    "&:hover": {
                      background: "linear-gradient(45deg, #c49619, #daa520)",
                      boxShadow: "0 6px 25px rgba(218, 165, 32, 0.4)",
                      transform: "translateY(-2px)",
                      transition: "all 0.3s ease",
                    },
                    fontWeight: "bold",
                    position: "relative",
                    overflow: "hidden",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: "100%",
                      height: "100%",
                      background: "linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.3), transparent)",
                      transform: "translateX(100%)",
                    },
                    "&:hover::after": {
                      transform: "translateX(-100%)",
                      transition: "transform 0.6s ease",
                    },
                  }}
                >
                  {item.title}
                </Button>
              ) : item.path === "/register" ? (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  variant="outlined"
                  sx={{
                    color: isActive(item.path) ? "#ffffff" : "#daa520",
                    borderColor: "#daa520",
                    bgcolor: isActive(item.path) ? "rgba(218, 165, 32, 0.2)" : "transparent",
                    "&:hover": {
                      bgcolor: "rgba(218, 165, 32, 0.05)",
                      borderColor: "#daa520",
                      transform: "translateY(-2px)",
                      transition: "all 0.3s ease",
                    },
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: "100%",
                      height: "100%",
                      background: "linear-gradient(120deg, transparent, rgba(218, 165, 32, 0.2), transparent)",
                      transform: "translateX(100%)",
                    },
                    "&:hover::before": {
                      transform: "translateX(-100%)",
                      transition: "transform 0.6s ease",
                    },
                  }}
                >
                  {item.title}
                </Button>
              ) : (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  variant="text"
                  sx={{
                    color: isActive(item.path) ? "#daa520" : "#ffffff",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.05)",
                      transform: "translateY(-2px)",
                      transition: "transform 0.3s ease",
                    },
                    position: "relative",
                    overflow: "hidden",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      width: "100%",
                      height: "2px",
                      background: "linear-gradient(90deg, transparent, #daa520, transparent)",
                      transform: "translateX(100%)",
                      transition: "transform 0.3s ease",
                    },
                    "&:hover::after": {
                      transform: "translateX(-100%)",
                    },
                  }}
                >
                  {item.title}
                </Button>
              ),
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Header
