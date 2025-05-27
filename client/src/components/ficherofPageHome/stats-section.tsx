"use client"

import type React from "react"
import { Box, Container, Typography, Grid } from "@mui/material"
import { People as Users, VerifiedUser as Verified, Chat as MessageCircle } from "@mui/icons-material"
import FloatingCircles from "./floating-circles"

interface StatsSectionProps {
  isVisible: boolean
  counters: {
    couples: number
    proposals: number
    registrations: number
  }
}

const StatsSection: React.FC<StatsSectionProps> = ({ isVisible, counters }) => {
  return (
    <Box
      id="stats"
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
            mb: 10,
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
            השדכן במספרים
          </Typography>
          <Typography variant="h6" sx={{ color: "#aaaaaa" }}>
            גאים להציג לכם בסיעתא דשמייא מספרים מדהימים
          </Typography>
        </Box>

        <Grid container spacing={6} sx={{ textAlign: "center" }}>
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(50px)",
              transition: "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s",
            }}
          >
            <Box
              sx={{
                mb: 3,
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  top: -10,
                  left: -10,
                  right: -10,
                  bottom: -10,
                  borderRadius: "50%",
                  border: "2px dashed rgba(218, 165, 32, 0.2)",
                  animation: "spin 30s linear infinite",
                },
              }}
            >
              <Users
                sx={{
                  fontSize: "56px",
                  color: "#daa520",
                  filter: "drop-shadow(0 4px 6px rgba(218, 165, 32, 0.3))",
                }}
              />
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: "#ffffff",
                mb: 1,
                position: "relative",
                display: "inline-block",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: -5,
                  left: "25%",
                  width: "50%",
                  height: "3px",
                  background: "linear-gradient(90deg, transparent, #daa520, transparent)",
                },
              }}
            >
              +{counters.couples.toLocaleString()}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: "#aaaaaa" }}>
              זוגות שהתחתנו
            </Typography>
          </Grid>

          <Grid
            item
            xs={12}
            md={4}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(50px)",
              transition: "opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s",
            }}
          >
            <Box
              sx={{
                mb: 3,
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  top: -10,
                  left: -10,
                  right: -10,
                  bottom: -10,
                  borderRadius: "50%",
                  border: "2px dashed rgba(218, 165, 32, 0.2)",
                  animation: "spin 30s linear infinite reverse",
                },
              }}
            >
              <MessageCircle
                sx={{
                  fontSize: "56px",
                  color: "#daa520",
                  filter: "drop-shadow(0 4px 6px rgba(218, 165, 32, 0.3))",
                }}
              />
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: "#ffffff",
                mb: 1,
                position: "relative",
                display: "inline-block",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: -5,
                  left: "25%",
                  width: "50%",
                  height: "3px",
                  background: "linear-gradient(90deg, transparent, #daa520, transparent)",
                },
              }}
            >
              +{counters.proposals.toLocaleString()}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: "#aaaaaa" }}>
              הצעות שהוצעו כרגע
            </Typography>
          </Grid>

          <Grid
            item
            xs={12}
            md={4}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(50px)",
              transition: "opacity 0.8s ease 0.6s, transform 0.8s ease 0.6s",
            }}
          >
            <Box
              sx={{
                mb: 3,
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  top: -10,
                  left: -10,
                  right: -10,
                  bottom: -10,
                  borderRadius: "50%",
                  border: "2px dashed rgba(218, 165, 32, 0.2)",
                  animation: "spin 30s linear infinite",
                },
              }}
            >
              <Verified
                sx={{
                  fontSize: "56px",
                  color: "#daa520",
                  filter: "drop-shadow(0 4px 6px rgba(218, 165, 32, 0.3))",
                }}
              />
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: "#ffffff",
                mb: 1,
                position: "relative",
                display: "inline-block",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: -5,
                  left: "25%",
                  width: "50%",
                  height: "3px",
                  background: "linear-gradient(90deg, transparent, #daa520, transparent)",
                },
              }}
            >
              +{counters.registrations.toLocaleString()}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: "#aaaaaa" }}>
              נרשמו עד כה
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default StatsSection
