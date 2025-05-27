"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { useNavigate } from "react-router-dom"
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Fade,
  Grow,
} from "@mui/material"
import { CacheProvider } from "@emotion/react"
import createCache from "@emotion/cache"
import rtlPlugin from "stylis-plugin-rtl"
import { prefixer } from "stylis"
import { heIL } from "@mui/material/locale"
import { keyframes } from "@emotion/react"
import candidateStore, { Gender } from "../store/candidateStore"

// RTL configuration
const rtlCache = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
})

// Keyframe animations
const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`

const glow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(212, 175, 55, 0.6), 0 0 60px rgba(212, 175, 55, 0.4);
  }
`

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

// Luxury theme
const theme = createTheme(
  {
    direction: "rtl",
    typography: {
      fontFamily: "'Heebo', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      h4: {
        fontWeight: 700,
        letterSpacing: "0.5px",
      },
      body1: {
        fontWeight: 400,
        lineHeight: 1.6,
      },
    },
    palette: {
      primary: {
        main: "#D4AF37", // Luxury Gold
        light: "#F4E4A6",
        dark: "#B8941F",
      },
      secondary: {
        main: "#1A1A1A", // Rich Black
        light: "#2D2D2D",
        dark: "#000000",
      },
      background: {
        default: "linear-gradient(135deg, #0F0F0F 0%, #1A1A1A 50%, #0F0F0F 100%)",
        paper: "rgba(26, 26, 26, 0.95)",
      },
      text: {
        primary: "#FFFFFF",
        secondary: "#D4AF37",
      },
    },
  },
  heIL,
)

const CandidateGenderSelectionPage: React.FC = observer(() => {
  const navigate = useNavigate()
  const [mounted, setMounted] = useState(false)
  const [selectedGender, setSelectedGender] = useState<Gender | null>(null)

  useEffect(() => {
    candidateStore.resetMessages()
    setMounted(true)
  }, [])

  const handleGenderSelection = (gender: Gender) => {
    setSelectedGender(gender)

    setTimeout(() => {
      console.log("👤 נבחר מגדר:", gender)

      candidateStore.setGender(gender)
      localStorage.setItem("selectedGender", gender)

      try {
        const existingData = localStorage.getItem("candidateFormData")
        const currentData = existingData ? JSON.parse(existingData) : {}

        const updatedData = {
          ...currentData,
          gender: gender,
        }

        localStorage.setItem("candidateFormData", JSON.stringify(updatedData))
        console.log("💾 מגדר נשמר בנתוני הטופס")
      } catch (error) {
        console.error("שגיאה בשמירת מגדר:", error)
      }

      navigate("/candidate")
    }, 800)
  }

  return (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #0F0F0F 0%, #1A1A1A 25%, #2D2D2D 50%, #1A1A1A 75%, #0F0F0F 100%)",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `
                radial-gradient(circle at 20% 20%, rgba(212, 175, 55, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(212, 175, 55, 0.05) 0%, transparent 50%),
                radial-gradient(circle at 40% 60%, rgba(212, 175, 55, 0.03) 0%, transparent 50%)
              `,
              pointerEvents: "none",
            },
          }}
        >
          <Container maxWidth="lg" sx={{ py: 8, position: "relative", zIndex: 1 }}>
            <Fade in={mounted} timeout={1000}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: "24px",
                  overflow: "hidden",
                  maxWidth: "800px",
                  margin: "0 auto",
                  background: "linear-gradient(145deg, rgba(26, 26, 26, 0.95) 0%, rgba(45, 45, 45, 0.9) 100%)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(212, 175, 55, 0.2)",
                  position: "relative",
                  animation: `${fadeInUp} 1s ease-out`,
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: "-100%",
                    width: "100%",
                    height: "100%",
                    background: `linear-gradient(
                      90deg,
                      transparent,
                      rgba(212, 175, 55, 0.1),
                      transparent
                    )`,
                    animation: `${shimmer} 3s infinite`,
                  },
                }}
              >
                {/* Header Section */}
                <Box
                  sx={{
                    background: "linear-gradient(135deg, #D4AF37 0%, #F4E4A6 50%, #D4AF37 100%)",
                    py: 6,
                    px: 4,
                    position: "relative",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "1px",
                      background: "linear-gradient(90deg, transparent, #D4AF37, transparent)",
                    },
                  }}
                >
                  <Grow in={mounted} timeout={1200}>
                    <Typography
                      variant="h4"
                      component="h1"
                      align="center"
                      sx={{
                        color: "#1A1A1A",
                        fontWeight: 800,
                        fontSize: { xs: "2rem", md: "2.5rem" },
                        textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        letterSpacing: "1px",
                        position: "relative",
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          bottom: "-10px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: "60px",
                          height: "3px",
                          background: "#1A1A1A",
                          borderRadius: "2px",
                        },
                      }}
                    >
                      בחירת מין
                    </Typography>
                  </Grow>
                </Box>

                {/* Content Section */}
                <Box sx={{ p: 6 }}>
                  <Fade in={mounted} timeout={1500}>
                    <Typography
                      variant="body1"
                      sx={{
                        mb: 6,
                        color: "rgba(255, 255, 255, 0.8)",
                        fontSize: "1.1rem",
                        textAlign: "center",
                        lineHeight: 1.8,
                        maxWidth: "500px",
                        margin: "0 auto 48px auto",
                      }}
                    >
                      כדי שנוכל להתאים את טופס ההרשמה עבורך בצורה מיטבית, אנא בחר/י את המין שלך:
                    </Typography>
                  </Fade>

                  {/* Gender Selection Buttons */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 4,
                      flexWrap: "wrap",
                      mb: 6,
                    }}
                  >
                    <Grow in={mounted} timeout={1800}>
                      <Button
                        onClick={() => handleGenderSelection(Gender.MALE)}
                        disabled={selectedGender !== null}
                        sx={{
                          flex: "1",
                          minWidth: "280px",
                          maxWidth: "320px",
                          height: "200px",
                          background:
                            selectedGender === Gender.MALE
                              ? "linear-gradient(145deg, #D4AF37 0%, #F4E4A6 100%)"
                              : "linear-gradient(145deg, rgba(45, 45, 45, 0.8) 0%, rgba(26, 26, 26, 0.9) 100%)",
                          border:
                            selectedGender === Gender.MALE ? "2px solid #D4AF37" : "2px solid rgba(212, 175, 55, 0.3)",
                          borderRadius: "16px",
                          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                          fontSize: "1.2rem",
                          fontWeight: 600,
                          color: selectedGender === Gender.MALE ? "#1A1A1A" : "#FFFFFF",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "relative",
                          overflow: "hidden",
                          animation: selectedGender === Gender.MALE ? `${glow} 2s infinite` : "none",
                          transform: selectedGender === Gender.MALE ? "scale(1.05)" : "scale(1)",
                          "&::before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background:
                              "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)",
                            transform: "translateX(-100%)",
                            transition: "transform 0.6s",
                          },
                          "&:hover": {
                            transform: selectedGender === null ? "translateY(-8px) scale(1.02)" : "scale(1.05)",
                            boxShadow:
                              selectedGender === null
                                ? "0 20px 40px rgba(212, 175, 55, 0.3), 0 0 0 1px rgba(212, 175, 55, 0.5)"
                                : "0 25px 50px rgba(212, 175, 55, 0.4)",
                            "&::before": {
                              transform: "translateX(100%)",
                            },
                          },
                          "&:disabled": {
                            opacity: selectedGender === Gender.MALE ? 1 : 0.5,
                          },
                        }}
                      >
                        <Box
                          sx={{
                            fontSize: "4rem",
                            mb: 2,
                            filter: selectedGender === Gender.MALE ? "none" : "grayscale(0.3)",
                            animation: selectedGender === Gender.MALE ? `${float} 2s ease-in-out infinite` : "none",
                          }}
                        >
                          👨
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: "0.5px" }}>
                          זכר
                        </Typography>
                      </Button>
                    </Grow>

                    <Grow in={mounted} timeout={2000}>
                      <Button
                        onClick={() => handleGenderSelection(Gender.FEMALE)}
                        disabled={selectedGender !== null}
                        sx={{
                          flex: "1",
                          minWidth: "280px",
                          maxWidth: "320px",
                          height: "200px",
                          background:
                            selectedGender === Gender.FEMALE
                              ? "linear-gradient(145deg, #D4AF37 0%, #F4E4A6 100%)"
                              : "linear-gradient(145deg, rgba(45, 45, 45, 0.8) 0%, rgba(26, 26, 26, 0.9) 100%)",
                          border:
                            selectedGender === Gender.FEMALE
                              ? "2px solid #D4AF37"
                              : "2px solid rgba(212, 175, 55, 0.3)",
                          borderRadius: "16px",
                          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                          fontSize: "1.2rem",
                          fontWeight: 600,
                          color: selectedGender === Gender.FEMALE ? "#1A1A1A" : "#FFFFFF",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "relative",
                          overflow: "hidden",
                          animation: selectedGender === Gender.FEMALE ? `${glow} 2s infinite` : "none",
                          transform: selectedGender === Gender.FEMALE ? "scale(1.05)" : "scale(1)",
                          "&::before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background:
                              "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)",
                            transform: "translateX(-100%)",
                            transition: "transform 0.6s",
                          },
                          "&:hover": {
                            transform: selectedGender === null ? "translateY(-8px) scale(1.02)" : "scale(1.05)",
                            boxShadow:
                              selectedGender === null
                                ? "0 20px 40px rgba(212, 175, 55, 0.3), 0 0 0 1px rgba(212, 175, 55, 0.5)"
                                : "0 25px 50px rgba(212, 175, 55, 0.4)",
                            "&::before": {
                              transform: "translateX(100%)",
                            },
                          },
                          "&:disabled": {
                            opacity: selectedGender === Gender.FEMALE ? 1 : 0.5,
                          },
                        }}
                      >
                        <Box
                          sx={{
                            fontSize: "4rem",
                            mb: 2,
                            filter: selectedGender === Gender.FEMALE ? "none" : "grayscale(0.3)",
                            animation: selectedGender === Gender.FEMALE ? `${float} 2s ease-in-out infinite` : "none",
                          }}
                        >
                          👩
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: "0.5px" }}>
                          נקבה
                        </Typography>
                      </Button>
                    </Grow>
                  </Box>

                  {/* Back Button */}
                  <Fade in={mounted} timeout={2200}>
                    <Box sx={{ textAlign: "center" }}>
                      <Button
                        onClick={() => navigate("/login")}
                        disabled={selectedGender !== null}
                        sx={{
                          color: "rgba(255, 255, 255, 0.6)",
                          fontSize: "0.95rem",
                          fontWeight: 500,
                          textDecoration: "none",
                          padding: "12px 24px",
                          borderRadius: "8px",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            backgroundColor: "rgba(212, 175, 55, 0.1)",
                            color: "#D4AF37",
                            textDecoration: "none",
                            transform: "translateY(-2px)",
                          },
                          "&:disabled": {
                            opacity: 0.3,
                          },
                        }}
                      >
                        ← חזרה לדף ההתחברות
                      </Button>
                    </Box>
                  </Fade>
                </Box>
              </Paper>
            </Fade>
          </Container>
        </Box>
      </ThemeProvider>
    </CacheProvider>
  )
})

export default CandidateGenderSelectionPage
