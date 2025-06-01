"use client"

import type React from "react"
import { Box, Container, Grid, Typography, Link as MuiLink } from "@mui/material"
import { Synagogue as SynagoguIcon } from "@mui/icons-material"
import { Link } from "react-router-dom"
import FloatingCircles from "../UI/floating-circles"

const Footer: React.FC = () => {
  return (
    <Box
      sx={{
        bgcolor: "#000000",
        color: "#aaaaaa",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <FloatingCircles />

      {/* Main Footer Content */}
      <Container maxWidth="lg" sx={{ py: 8, position: "relative", zIndex: 1 }}>
        <Grid container spacing={6}>
          {/* Logo & About */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "#ffffff",
                mb: 3,
                display: "flex",
                alignItems: "center",
                gap: 1,
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
            <Typography variant="body2" sx={{ mb: 3, color: "#aaaaaa", lineHeight: 1.8 }}>
              משרד שידוכים פועל למעלה מ-15 שנה בהתאמת זיווגים ראויים במגזר החרדי. אלפי משפחות הוקמו בזכות התאמה מדויקת
              ומקצועית.
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#daa520",
                position: "relative",
                display: "inline-block",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: -5,
                  right: 0,
                  width: "100%",
                  height: "1px",
                  background: "linear-gradient(90deg, transparent, #daa520, transparent)",
                },
              }}
            >
              "זה הקב"ה: מזווג זיווגים"
            </Typography>
          </Grid>

          {/* Links 1 */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" sx={{ color: "#ffffff", mb: 3, fontWeight: "bold" }}>
              ניווט מהיר
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {["דף הבית", "אודותינו", "תהליך השידוך", "הצלחות", "צור קשר"].map((link) => (
                <MuiLink
                  key={link}
                  href="#"
                  underline="hover"
                  sx={{
                    color: "#aaaaaa",
                    "&:hover": {
                      color: "#daa520",
                      transform: "translateX(5px)",
                      transition: "all 0.3s ease",
                    },
                    transition: "all 0.3s ease",
                    position: "relative",
                    paddingLeft: "15px",
                    "&::before": {
                      content: '"›"',
                      position: "absolute",
                      left: 0,
                      opacity: 0,
                      transform: "translateX(10px)",
                      transition: "all 0.3s ease",
                    },
                    "&:hover::before": {
                      opacity: 1,
                      transform: "translateX(0)",
                    },
                  }}
                >
                  {link}
                </MuiLink>
              ))}
              <MuiLink
                component={Link}
                to="/meeting-places"
                underline="hover"
                sx={{
                  color: "#aaaaaa",
                  "&:hover": {
                    color: "#daa520",
                    transform: "translateX(5px)",
                    transition: "all 0.3s ease",
                  },
                  transition: "all 0.3s ease",
                  position: "relative",
                  paddingLeft: "15px",
                  "&::before": {
                    content: '"›"',
                    position: "absolute",
                    left: 0,
                    opacity: 0,
                    transform: "translateX(10px)",
                    transition: "all 0.3s ease",
                  },
                  "&:hover::before": {
                    opacity: 1,
                    transform: "translateX(0)",
                  },
                }}
              >
                מקומות מפגש
              </MuiLink>
            </Box>
          </Grid>

          {/* Links 2 */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" sx={{ color: "#ffffff", mb: 3, fontWeight: "bold" }}>
              מידע נוסף
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {["מאמרים", "שאלות נפוצות", "תנאי שימוש", "מדיניות פרטיות", "לשדכנים"].map((link) => (
                <MuiLink
                  key={link}
                  href="#"
                  underline="hover"
                  sx={{
                    color: "#aaaaaa",
                    "&:hover": {
                      color: "#daa520",
                      transform: "translateX(5px)",
                      transition: "all 0.3s ease",
                    },
                    transition: "all 0.3s ease",
                    position: "relative",
                    paddingLeft: "15px",
                    "&::before": {
                      content: '"›"',
                      position: "absolute",
                      left: 0,
                      opacity: 0,
                      transform: "translateX(10px)",
                      transition: "all 0.3s ease",
                    },
                    "&:hover::before": {
                      opacity: 1,
                      transform: "translateX(0)",
                    },
                  }}
                >
                  {link}
                </MuiLink>
              ))}
            </Box>
          </Grid>

          {/* Contact */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" sx={{ color: "#ffffff", mb: 3, fontWeight: "bold" }}>
              צור קשר
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography
                variant="body2"
                sx={{
                  color: "#aaaaaa",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    color: "#daa520",
                    transform: "translateX(5px)",
                  },
                }}
              >
                כתובת: רחוב ירושלים 123, בני ברק
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#aaaaaa",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    color: "#daa520",
                    transform: "translateX(5px)",
                  },
                }}
              >
                טלפון: 03-1234567
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#aaaaaa",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    color: "#daa520",
                    transform: "translateX(5px)",
                  },
                }}
              >
                דוא"ל: info@shiduchim-bd.co.il
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#aaaaaa",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    color: "#daa520",
                    transform: "translateX(5px)",
                  },
                }}
              >
                שעות פעילות: יום א'-ה' 9:00-19:00
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Copyright */}
      <Box sx={{ py: 3, borderTop: "1px solid rgba(255, 255, 255, 0.1)", position: "relative", zIndex: 1 }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: "center",
              textAlign: { xs: "center", md: "right" },
              gap: 2,
            }}
          >
            <Typography variant="body2" sx={{ color: "#707070" }}>
              © {new Date().getFullYear()} לחיים מרכז השידוכים | כל הזכויות שמורות
            </Typography>
            <Box sx={{ display: "flex", gap: 3 }}>
              {["תנאי שימוש", "מדיניות פרטיות", "נגישות"].map((item) => (
                <MuiLink
                  key={item}
                  href="#"
                  underline="hover"
                  sx={{
                    color: "#707070",
                    "&:hover": { color: "#daa520" },
                    fontSize: "0.875rem",
                    transition: "color 0.3s ease",
                  }}
                >
                  {item}
                </MuiLink>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default Footer
