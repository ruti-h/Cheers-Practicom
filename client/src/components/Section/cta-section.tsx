"use client"

import type React from "react"
import { Box, Container, Typography, Button } from "@mui/material"
import FloatingCircles from "../UI/floating-circles"

interface CtaSectionProps {
  isVisible: boolean
}

const CtaSection: React.FC<CtaSectionProps> = ({ isVisible }) => {
  return (
    <Box
      id="cta"
      sx={{
        py: 12,
        bgcolor: "#000000",
        backgroundImage:
          "linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.85)), url(https://images.unsplash.com/photo-1553531889-56cc480ac5cb?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=800&w=1600)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <FloatingCircles />

      <Container
        maxWidth="md"
        sx={{
          textAlign: "center",
          position: "relative",
          zIndex: 1,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(50px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}
      >
        <Typography
          variant="h3"
          component="h2"
          sx={{
            fontWeight: "bold",
            mb: 4,
            color: "#ffffff",
            textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
            animation: "fadeInUp 1s ease",
          }}
        >
          יש לכם{" "}
          <span
            style={{
              color: "#daa520",
              position: "relative",
            }}
          >
            הצעות לייעול?
          </span>{" "}
          נשמח לשמוע
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
            justifyContent: "center",
            animation: "fadeInUp 1s ease 0.3s both",
          }}
        >
          <Button
            variant="contained"
            size="large"
            sx={{
              background: "linear-gradient(45deg, #daa520, #e6be5a)",
              color: "#000000",
              boxShadow: "0 10px 30px rgba(218, 165, 32, 0.3)",
              "&:hover": {
                background: "linear-gradient(45deg, #c49619, #daa520)",
                boxShadow: "0 15px 40px rgba(218, 165, 32, 0.4)",
                transform: "translateY(-3px)",
                transition: "all 0.3s ease",
              },
              px: 6,
              py: 2,
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
                background: "linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.5), transparent)",
                transform: "translateX(100%)",
              },
              "&:hover::after": {
                transform: "translateX(-100%)",
                transition: "transform 0.6s ease",
              },
            }}
          >
            צור קשר עכשיו
          </Button>
        </Box>
      </Container>
    </Box>
  )
}

export default CtaSection
