"use client"

import type React from "react"
import { Box, Container, Typography, Grid, Card, CardContent } from "@mui/material"
import FloatingCircles from "./floating-circles"

interface TestimonialsSectionProps {
  isVisible: boolean
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ isVisible }) => {
  return (
    <Box
      id="testimonials"
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
            כותבים לנו ועלינו
          </Typography>
          <Typography variant="h6" sx={{ color: "#aaaaaa" }}>
            התגובות שקיבלנו ממכם
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Testimonial 1 */}
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(50px)",
              transition: "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s",
            }}
          >
            <Card
              sx={{
                borderRight: "4px solid #daa520",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 15px 35px rgba(0, 0, 0, 0.25), 0 1px 3px rgba(0, 0, 0, 0.1)",
                },
                position: "relative",
                overflow: "hidden",
                bgcolor: "#111111",
                color: "#ffffff",
                border: "1px solid rgba(218, 165, 32, 0.1)",
              }}
            >
              <CardContent sx={{ position: "relative", p: 3, zIndex: 1 }}>
                <Typography variant="caption" sx={{ color: "#daa520", mb: 1 }}>
                  11.4.2024
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#ffffff", mb: 1 }}>
                  המיזם הזה מטורף?!
                </Typography>
                <Typography variant="body2" sx={{ color: "#cccccc", mb: 5, lineHeight: 1.6 }}>
                  צורה כל כך נכונה לציבור החרדי ותוך בניית משפחה למגזר! כל פעם תוהה מחדש להצעה לחברה מדהים!!! רכסו למצוא
                  ולהיות שלוחים לבניית אלפי בתים בישראל!!
                </Typography>
                <Box sx={{ position: "absolute", bottom: 8, left: 8 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#daa520",
                      position: "relative",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        bottom: -2,
                        right: 0,
                        width: "100%",
                        height: "1px",
                        background: "linear-gradient(90deg, transparent, #daa520, transparent)",
                      },
                    }}
                  >
                    מערכת מאו"ד!
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Testimonial 2 */}
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(50px)",
              transition: "opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s",
            }}
          >
            <Card
              sx={{
                borderRight: "4px solid #daa520",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 15px 35px rgba(0, 0, 0, 0.25), 0 1px 3px rgba(0, 0, 0, 0.1)",
                },
                position: "relative",
                overflow: "hidden",
                bgcolor: "#111111",
                color: "#ffffff",
                border: "1px solid rgba(218, 165, 32, 0.1)",
              }}
            >
              <CardContent sx={{ p: 3, position: "relative", zIndex: 1 }}>
                <Typography variant="caption" sx={{ color: "#daa520", mb: 1 }}>
                  18.4.2024
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#ffffff", mb: 1 }}>
                  קודם כל - תודה
                </Typography>
                <Typography variant="body2" sx={{ color: "#cccccc", mb: 3, lineHeight: 1.6 }}>
                  תודה על פיתוח גאוני של אתר זמין, נח וידידותי למשתמש. תודה על היכולת והזכות לסייע (ולהצליח!) לבנות בית
                  בישראל. בזכותכם זכיתי לעשות את מה שתמיד חלמתי - להיות מתווך אמיתי ונכון לאחי בן ה-27 וב"ה לאחר
                  ניסיונות בודדים - הצלחתי!
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Testimonial 3 */}
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(50px)",
              transition: "opacity 0.8s ease 0.6s, transform 0.8s ease 0.6s",
            }}
          >
            <Card
              sx={{
                borderRight: "4px solid #daa520",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 15px 35px rgba(0, 0, 0, 0.25), 0 1px 3px rgba(0, 0, 0, 0.1)",
                },
                position: "relative",
                overflow: "hidden",
                bgcolor: "#111111",
                color: "#ffffff",
                border: "1px solid rgba(218, 165, 32, 0.1)",
              }}
            >
              <CardContent sx={{ p: 3, position: "relative", zIndex: 1 }}>
                <Typography variant="caption" sx={{ color: "#daa520", mb: 1 }}>
                  18.4.2024
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#ffffff", mb: 1 }}>
                  אשריכם!!
                </Typography>
                <Typography variant="body2" sx={{ color: "#cccccc", mb: 3, lineHeight: 1.6 }}>
                  אתם זוכים להיות שותפים בקריעת הים לזוגות שומרים על שפת הים זמן רב, עם כזאת אכפתיות ובצורה מכובדת
                  ונעימה. הנתינה בגובה ונעשית גם להסתדר אתם. מעשים מבורכים בכל הברכות אתם נותנים תקווה.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default TestimonialsSection
