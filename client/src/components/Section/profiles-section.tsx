"use client"

import type React from "react"
import { Box, Container, Typography } from "@mui/material"
import FloatingCircles from "../UI/floating-circles"
import MatchAnimation from "../UI/match-animation"
import EngagedCoupleCarousel from "./engaged-couple-carousel"

interface ProfilesSectionProps {
  isVisible: boolean
}

const ProfilesSection: React.FC<ProfilesSectionProps> = ({ isVisible }) => {
  return (
    <Box
      id="profiles"
      sx={{
        py: 10,
        bgcolor: "#0a0a0a",
        background: "linear-gradient(135deg, #0a0a0a, #111111)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <FloatingCircles />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            textAlign: "center",
            mb: 8,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(50px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}
        >
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: "bold",
              mb: 2,
              color: "#ffffff",
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
            פשוט עשו את זה בעצמכם
          </Typography>
          <Typography variant="h6" sx={{ color: "#aaaaaa", maxWidth: "600px", mx: "auto" }}>
            שמירה על דיסקרטיות מירבית
          </Typography>
        </Box>

        {/* Animated Match Interface */}
        <Box
          sx={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(50px)",
            transition: "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s",
            mb: 8,
          }}
        >
          <MatchAnimation />
        </Box>

        {/* Engaged Couples Carousel */}
        <Box
          sx={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(50px)",
            transition: "opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s",
            mb: 8,
          }}
        >
          <EngagedCoupleCarousel />
        </Box>
      </Container>
    </Box>
  )
}

export default ProfilesSection
