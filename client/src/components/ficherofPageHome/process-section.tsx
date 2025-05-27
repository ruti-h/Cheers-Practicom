"use client"

import type React from "react"
import { Box, Container, Typography, Grid, Divider } from "@mui/material"
import { Favorite as HeartIcon } from "@mui/icons-material"
import FloatingCircles from "./floating-circles"

interface ProcessSectionProps {
  isVisible: boolean
}

const ProcessSection: React.FC<ProcessSectionProps> = ({ isVisible }) => {
  return (
    <Box
      id="process"
      sx={{
        py: 10,
        bgcolor: "#050505",
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
            ככה פשוט.
          </Typography>
          <Typography variant="h6" sx={{ color: "#aaaaaa" }}>
            הדרך שלכם לעבור את חיי הרווקות בכבוד!
          </Typography>
        </Box>

        <Box sx={{ position: "relative" }}>
          {/* Connection line */}
          <Divider
            sx={{
              display: { xs: "none", md: "block" },
              position: "absolute",
              top: "6rem",
              right: "10%",
              left: "10%",
              height: "2px",
              background: "linear-gradient(90deg, rgba(218, 165, 32, 0.2), #daa520, rgba(218, 165, 32, 0.2))",
              zIndex: 0,
              opacity: isVisible ? 1 : 0,
              transition: "opacity 1.5s ease",
            }}
          />

          <Grid container spacing={4} sx={{ position: "relative", zIndex: 1 }}>
            {[1, 2, 3, 4].map((step, index) => (
              <Grid
                item
                xs={12}
                md={2.4}
                key={step}
                sx={{
                  textAlign: "center",
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(50px)",
                  transition: `opacity 0.8s ease ${0.2 * index}s, transform 0.8s ease ${0.2 * index}s`,
                }}
              >
                <Box
                  sx={{
                    width: "80px",
                    height: "80px",
                    border: "4px solid rgba(218, 165, 32, 0.2)",
                    bgcolor: "#111111",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 3,
                    position: "relative",
                    zIndex: 10,
                    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.4)",
                      border: "4px solid rgba(218, 165, 32, 0.4)",
                    },
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      top: -8,
                      left: -8,
                      right: -8,
                      bottom: -8,
                      borderRadius: "50%",
                      border: "2px dashed rgba(218, 165, 32, 0.15)",
                      opacity: 0.5,
                      animation: "spin 20s linear infinite",
                      "@keyframes spin": {
                        "0%": { transform: "rotate(0deg)" },
                        "100%": { transform: "rotate(360deg)" },
                      },
                    },
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: "bold", color: "#daa520" }}>
                    {step}
                  </Typography>
                </Box>

                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#ffffff", mb: 1 }}>
                  {step === 1 && "מחפשים"}
                  {step === 2 && "שולחים"}
                  {step === 3 && "נחשפים לפרטים"}
                  {step === 4 && "פונים לשדכן"}
                </Typography>

                <Typography variant="body2" sx={{ color: "#aaaaaa", fontSize: "0.875rem" }}>
                  {step === 1 && "מחפשים מועמד שמתאים במאגר"}
                  {step === 2 && "שולחים בקשת התעניינות"}
                  {step === 3 && "במידה והצד השני מתעניין גם הוא, נחשפים הפרטים המלאים"}
                  {step === 4 && "פונים לאחד מהשדכנים שלנו שיקבע פגישה"}
                </Typography>
              </Grid>
            ))}

            {/* Final step */}
            <Grid
              item
              xs={12}
              md={2.4}
              sx={{
                textAlign: "center",
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(50px)",
                transition: "opacity 0.8s ease 0.8s, transform 0.8s ease 0.8s",
              }}
            >
              <Box sx={{ position: "relative", width: "112px", height: "112px", mx: "auto", mb: 3 }}>
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    bgcolor: "rgba(218, 165, 32, 0.3)",
                    borderRadius: "50%",
                    animation: "pulse 2s infinite alternate",
                    "@keyframes pulse": {
                      "0%": { transform: "scale(1)" },
                      "100%": { transform: "scale(1.1)" },
                    },
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    top: "0.3rem",
                    left: "0.3rem",
                    width: "80px",
                    height: "80px",
                    background: "linear-gradient(45deg, #daa520, #e6be5a)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 10,
                    boxShadow: "0 5px 15px rgba(218, 165, 32, 0.3)",
                  }}
                >
                  <HeartIcon
                    sx={{
                      fontSize: "40px",
                      color: "#000000",
                      animation: "beat 1.5s infinite alternate",
                      "@keyframes beat": {
                        "0%": { transform: "scale(1)" },
                        "50%": { transform: "scale(1.1)" },
                        "100%": { transform: "scale(1)" },
                      },
                    }}
                  />
                </Box>
              </Box>

              <Typography variant="h6" sx={{ fontWeight: "bold", color: "#ffffff", mb: 1 }}>
                סוגרים לחיים
              </Typography>

              <Typography variant="body2" sx={{ color: "#aaaaaa", fontSize: "0.875rem" }}>
                מזל טוב,
                <br />
                הרגע המיוחל הגיע
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  )
}

export default ProcessSection
