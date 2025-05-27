"use client"

import type React from "react"
import { Box, Container, Typography, Button } from "@mui/material"
import { Link } from "react-router-dom"
import FloatingCircles from "./floating-circles"

interface MeetingSectionProps {
  isVisible: boolean
}

const MeetingSection: React.FC<MeetingSectionProps> = ({ isVisible }) => {
  return (
    <Box
      id="meeting"
      sx={{
        py: 10,
        bgcolor: "#0a0a0a",
        background: "linear-gradient(135deg, #0a0a0a, #111111)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <FloatingCircles />

      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            textAlign: "center",
            mb: 6,
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
              mb: 2,
              color: "#ffffff",
              textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
              "&::after": {
                content: '""',
                display: "block",
                width: "80px",
                height: "4px",
                background: "linear-gradient(90deg, #daa520, #e6be5a)",
                mx: "auto",
                mt: 2,
                borderRadius: "2px",
              },
            }}
          >
            מקומות מפגש מומלצים
          </Typography>
          <Typography variant="h6" sx={{ color: "#aaaaaa", maxWidth: "600px", mx: "auto" }}>
            גלו את המקומות המושלמים לפגישות שידוכים, עם דירוגים ופרטים שיעזרו לכם לבחור את המקום הנכון עבורכם
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(50px)",
            transition: "opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s",
          }}
        >
          <Button
            component={Link}
            to="/meeting-places"
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
                background: "linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.3), transparent)",
                transform: "translateX(100%)",
              },
              "&:hover::after": {
                transform: "translateX(-100%)",
                transition: "transform 0.6s ease",
              },
            }}
          >
            לעמוד מקומות מפגש
          </Button>
        </Box>
      </Container>
    </Box>
  )
}

export default MeetingSection
