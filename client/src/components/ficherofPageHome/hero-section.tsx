"use client"

import type React from "react"
import { Box, Container, Typography, Button } from "@mui/material"
import { ExpandMore as ChevronDown } from "@mui/icons-material"
import FloatingCircles from "./floating-circles"

interface HeroSectionProps {
  isVisible: boolean
  scrollToFeatures: () => void
}

const HeroSection: React.FC<HeroSectionProps> = ({ isVisible, scrollToFeatures }) => {
  return (
    <Box
      id="hero"
      sx={{
        position: "relative",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        bgcolor: "#000000",
        marginTop: "64px",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.7))",
          zIndex: 1,
        },
      }}
    >
      <Box sx={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <Box
          component="img"
          src="https://images.unsplash.com/photo-1513279922550-250c2129b13a?auto=format&fit=crop&q=80"
          alt="רקע"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: "0.4",
            animation: "slowZoom 30s infinite alternate",
            "@keyframes slowZoom": {
              "0%": { transform: "scale(1)" },
              "100%": { transform: "scale(1.1)" },
            },
          }}
        />
      </Box>

      <FloatingCircles />

      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          px: 4,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(50px)",
          transition: "opacity 1s ease, transform 1s ease",
        }}
      >
        <Box>
          <Typography
            variant="subtitle1"
            sx={{
              mb: 4,
              fontSize: "1.25rem",
              color: "#daa520",
              letterSpacing: "0.05em",
              textShadow: "0 0 10px rgba(218, 165, 32, 0.5)",
              animation: "fadeInDown 1s ease",
            }}
          >
            בס"ד • בית שמור • ירא שמיים
          </Typography>

          <Typography
            variant="h2"
            component="h1"
            sx={{
              color: "#ffffff",
              mb: 4,
              fontWeight: "bold",
              lineHeight: 1.2,
              textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
              "& span": {
                color: "#daa520",
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: "100%",
                  height: "4px",
                  background: "linear-gradient(90deg, transparent, #daa520, transparent)",
                  animation: "shimmer 3s infinite",
                  "@keyframes shimmer": {
                    "0%": { opacity: 0.3 },
                    "50%": { opacity: 1 },
                    "100%": { opacity: 0.3 },
                  },
                },
              },
              animation: "fadeInUp 1s ease 0.2s both",
            }}
          >
            בניית <span>בית נאמן</span> בישראל
            <br />
            בדרך המסורת
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: "rgba(255, 255, 255, 0.9)",
              mb: 6,
              maxWidth: "700px",
              mx: "auto",
              textShadow: "0 1px 5px rgba(0, 0, 0, 0.2)",
              animation: "fadeInUp 1s ease 0.4s both",
            }}
          >
            שידוכים בהתאמה אישית למגזר החרדי , מתוך הבנה עמוקה של החשיבות במציאת זיווג ראוי להקמת בית יהודי אמיתי
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              justifyContent: "center",
              animation: "fadeInUp 1s ease 0.6s both",
            }}
          >
            <Button
              variant="contained"
              size="large"
              sx={{
                background: "linear-gradient(45deg, #daa520, #e6be5a)",
                color: "#000",
                boxShadow: "0 4px 20px rgba(218, 165, 32, 0.3)",
                "&:hover": {
                  background: "linear-gradient(45deg, #c49619, #daa520)",
                  boxShadow: "0 6px 25px rgba(218, 165, 32, 0.4)",
                  transform: "translateY(-3px)",
                  transition: "all 0.3s ease",
                },
                px: 5,
                py: 1.5,
                fontSize: "1.125rem",
                fontWeight: "bold",
                borderRadius: "30px",
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
              התחל בתהליך השידוך
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={scrollToFeatures}
              sx={{
                borderColor: "#daa520",
                color: "#daa520",
                "&:hover": {
                  bgcolor: "rgba(218, 165, 32, 0.1)",
                  borderColor: "#daa520",
                  transform: "translateY(-3px)",
                  transition: "all 0.3s ease",
                },
                px: 4,
                py: 1.5,
                fontSize: "1.125rem",
                borderRadius: "30px",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(120deg, transparent, rgba(218, 165, 32, 0.1), transparent)",
                  transform: "translateX(100%)",
                },
                "&:hover::before": {
                  transform: "translateX(-100%)",
                  transition: "transform 0.6s ease",
                },
              }}
            >
              למידע נוסף
              <ChevronDown
                sx={{
                  mr: 1,
                  animation: "bounce 2s infinite",
                  "@keyframes bounce": {
                    "0%, 20%, 50%, 80%, 100%": { transform: "translateY(0)" },
                    "40%": { transform: "translateY(5px)" },
                    "60%": { transform: "translateY(3px)" },
                  },
                }}
              />
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default HeroSection
