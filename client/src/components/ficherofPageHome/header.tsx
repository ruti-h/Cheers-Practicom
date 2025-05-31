"use client"

import type React from "react"
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material"
import { Synagogue as SynagoguIcon } from "@mui/icons-material"
import { Link } from "react-router-dom"

const Header: React.FC = () => {
  return (
    <AppBar
      position="fixed"
      sx={{
        bgcolor: "rgba(0, 0, 0, 0.85)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3)",
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
    לחיים מרכז שידוכים
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            component={Link}
            to="/register"
            variant="outlined"
            sx={{
              color: "#daa520",
              borderColor: "#daa520",
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
            הרשמה
          </Button>
          <Button
            component={Link}
            to="/login"
            variant="text"
            sx={{
              color: "#ffffff",
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
            התחברות
          </Button>
          <Button
            component={Link}
            to="/meeting-places"
            variant="contained"
            sx={{
              background: "linear-gradient(45deg, #daa520, #e6be5a)",
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
            מקומות מומלצים לפגישה
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header
