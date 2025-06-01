"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Box, Typography, Grid, Card, CardContent, IconButton } from "@mui/material"
import { Check as CheckIcon, ArrowBack as ArrowBackIcon, ArrowForward as ArrowForwardIcon } from "@mui/icons-material"

const EngagedCoupleCarousel: React.FC = () => {
  const [autoPlay, setAutoPlay] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  const couples = [
    {
      male: {
        name: "אברהם דוד שולמן",
        description: 'בן הרב אליעזר שליט"א',
        yeshiva: "ישיבת כנסת יחזקאל - סיינר",
        city: "בני ברק",
      },
      female: {
        name: "שפירה הלפרין",
        description: 'בת הרב שמואל חיים דוד שליט"א',
        seminary: "",
        city: "בני ברק",
      },
      date: 'אור לט"ו אייר התשפ"ה',
    },
    {
      male: {
        name: "יעקב שיקרון",
        description: 'בן הרב יוסף חיים שליט"א',
        yeshiva: "ישיבת סמינר רב גרשון",
        city: "ירושלים",
      },
      female: {
        name: "מרים כהן",
        description: 'בת הרב יצחק שליט"א',
        seminary: "סמינר הרב וולף",
        city: "בני ברק",
      },
      date: 'אור לט" אייר התשפ"ה',
    },
    {
      male: {
        name: "אליהו ואזולאי",
        description: 'בן הרב אסף שליט"א',
        yeshiva: "ישיבת אור לישרים תורה ח...",
        city: "בית שמש",
      },
      female: {
        name: "יוכבד מרים אנקורי",
        description: 'בת הרב יוסף יצחק שליט"א',
        seminary: "סמינר הרב מאיר - ...",
        city: "מודיעין עילית",
      },
      date: 'אור לט" אייר התשפ"ה',
    },
    {
      male: {
        name: "נתנאל כהן",
        description: 'בן הרב שי שליט"א',
        yeshiva: "ישיבת באר התלמוד",
        city: "ירושלים",
      },
      female: {
        name: "אסתי לוי",
        description: 'בת הרב משה שליט"א',
        seminary: "בית שמש",
        city: "בית שמש",
      },
      date: 'אור לכ"ד אייר התשפ"ה',
    },
    {
      male: {
        name: "מיכאל שלמה",
        description: 'בן הרב אלעד שליט"א',
        yeshiva: "",
        city: "ביתר",
      },
      female: {
        name: "שרה רבובסקי",
        description: 'בת הרב יונתן שליט"א',
        seminary: "",
        city: "ירושלים",
      },
      date: 'אור לט" אייר התשפ"ה',
    },
    {
      male: {
        name: "אריאל איזקסון",
        description: 'בן הרב דוד שליט"א',
        yeshiva: "",
        city: "בני ברק",
      },
      female: {
        name: "מיכל סולוף",
        description: 'בת הרב שלמה ישראל שליט"א',
        seminary: "",
        city: "ירושלים",
      },
      date: 'אור לט" אייר התשפ"ה',
    },
    {
      male: {
        name: "דוד רייזמן",
        description: 'בן הרב אהרן שליט"א',
        yeshiva: "ישיבת כנסת יחזקאל - סיינר",
        city: "נתניה",
      },
      female: {
        name: "רבקה ניר",
        description: 'בת הרב דן שליט"א',
        seminary: "סמינר הרב וולף",
        city: "בני ברק",
      },
      date: 'אור לט" אייר התשפ"ה',
    },
    {
      male: {
        name: "יצחק(איציק) שפיץ",
        description: 'בן הרב קלמן (שלמה) שליט"א',
        yeshiva: "",
        city: "בני ברק",
      },
      female: {
        name: "ברכי לוין",
        description: 'בת הרב דניאל משה שליט"א',
        seminary: "",
        city: "בני ברק",
      },
      date: 'אור לט" אייר התשפ"ה',
    },
    {
      male: {
        name: "דניאל דיידוב",
        description: 'בן הרב ברוך שליט"א',
        yeshiva: "ישיבת ברכת אפרים",
        city: "תל אביב",
      },
      female: {
        name: "שיראל תורג'מן",
        description: 'בת הרב יצחק שליט"א',
        seminary: "סמינר הרב כהנא",
        city: "נתניות",
      },
      date: 'אור לט" אייר התשפ"ה',
    },
    {
      male: {
        name: "רונן יהונתן מושדם",
        description: "ישיבת אהבת אהרון",
        yeshiva: "",
        city: "תל אביב",
      },
      female: {
        name: "יעל עמרן",
        description: 'בת הרב מאיר(אמתי) שליט"א',
        seminary: 'סמינר מרכז בית יעקב באי"י - תכון ב...',
        city: "ראש העין",
      },
      date: 'אור לט" אייר התשפ"ה',
    },
    {
      male: {
        name: "יצחק אלחנן כהן",
        description: 'בן הרב יונתן שליט"א',
        yeshiva: "ישיבת אוהל יוסף - קרית ספר",
        city: "טבריה",
      },
      female: {
        name: "אושרת מעולם",
        description: 'בת הרב דוד שליט"א',
        seminary: 'סמינר אליקים ע"ש הרב וולף',
        city: "בני ברק",
      },
      date: 'אור לט" אייר התשפ"ה',
    },
    {
      male: {
        name: "יוסי גרוסמן",
        description: 'בן הרב שלום שליט"א',
        yeshiva: "ישיבת מנוחת התורה - הרב מזרחי",
        city: "בית שמש",
      },
      female: {
        name: "שירה בן פזי",
        description: 'בת הרב שלמה שליט"א',
        seminary: "סמינר עלי באר",
        city: "ירושלים",
      },
      date: 'אור לט" אייר התשפ"ה',
    },
  ]

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (autoPlay) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % couples.length)
      }, 7000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoPlay, couples.length])

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + couples.length) % couples.length)
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % couples.length)
  }

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        bgcolor: "rgba(0, 0, 0, 0.7)",
        borderRadius: "16px",
        p: 4,
        border: "1px solid rgba(218, 165, 32, 0.3)",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
        "&:hover": {
          "& .carousel-controls": {
            opacity: 1,
          },
        },
      }}
      onMouseEnter={() => setAutoPlay(false)}
      onMouseLeave={() => setAutoPlay(true)}
    >
      <Typography
        variant="h4"
        component="h2"
        sx={{
          textAlign: "center",
          mb: 4,
          color: "#ffffff",
          fontWeight: "bold",
          position: "relative",
          "&::before, &::after": {
            content: '""',
            position: "absolute",
            top: "50%",
            width: "60px",
            height: "2px",
            background: "linear-gradient(90deg, transparent, #daa520, transparent)",
          },
          "&::before": {
            right: "calc(50% + 100px)",
          },
          "&::after": {
            left: "calc(50% + 100px)",
          },
        }}
      >
        ~ המאורסים שלנו ~
      </Typography>

      <Box sx={{ position: "relative", minHeight: "250px" }}>
        <Grid
          container
          spacing={4}
          sx={{
            transition: "transform 0.5s ease-in-out",
            transform: `translateX(${currentIndex * 100}%)`,
            width: `${couples.length * 100}%`,
            display: "flex",
            flexWrap: "nowrap",
          }}
        >
          {couples.map((couple, index) => (
            <Grid
              item
              xs={12 / couples.length}
              key={index}
              sx={{
                flexShrink: 0,
                width: `${100 / couples.length}%`,
              }}
            >
              <Grid container spacing={3}>
                {/* Male Profile */}
                <Grid item xs={6}>
                  <Card
                    sx={{
                      bgcolor: "#000000",
                      color: "#ffffff",
                      borderRadius: "12px",
                      height: "100%",
                      border: "1px solid rgba(218, 165, 32, 0.2)",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 10px 25px rgba(218, 165, 32, 0.2)",
                        border: "1px solid rgba(218, 165, 32, 0.4)",
                      },
                    }}
                  >
                    <CardContent sx={{ textAlign: "center" }}>
                      <Typography variant="h6" sx={{ color: "#daa520", fontWeight: "bold", mb: 1 }}>
                        {couple.male.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#aaaaaa", mb: 1 }}>
                        {couple.male.description}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#aaaaaa", mb: 1 }}>
                        {couple.male.yeshiva}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#aaaaaa" }}>
                        {couple.male.city}
                      </Typography>

                      <Box
                        sx={{
                          mt: 2,
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Box
                          sx={{
                            width: "40px",
                            height: "40px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "50%",
                            background: "linear-gradient(45deg, #daa520, #e6be5a)",
                            boxShadow: "0 4px 10px rgba(218, 165, 32, 0.3)",
                          }}
                        >
                          <CheckIcon sx={{ color: "#000000" }} />
                        </Box>
                      </Box>

                      <Typography
                        variant="h6"
                        sx={{
                          color: "#4a90e2",
                          mt: 2,
                          fontWeight: "bold",
                        }}
                      >
                        מאורסים
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#aaaaaa", mt: 1 }}>
                        {couple.date}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Female Profile */}
                <Grid item xs={6}>
                  <Card
                    sx={{
                      bgcolor: "#000000",
                      color: "#ffffff",
                      borderRadius: "12px",
                      height: "100%",
                      border: "1px solid rgba(218, 165, 32, 0.2)",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 10px 25px rgba(218, 165, 32, 0.2)",
                        border: "1px solid rgba(218, 165, 32, 0.4)",
                      },
                    }}
                  >
                    <CardContent sx={{ textAlign: "center" }}>
                      <Typography variant="h6" sx={{ color: "#daa520", fontWeight: "bold", mb: 1 }}>
                        {couple.female.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#aaaaaa", mb: 1 }}>
                        {couple.female.description}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#aaaaaa", mb: 1 }}>
                        {couple.female.seminary}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#aaaaaa" }}>
                        {couple.female.city}
                      </Typography>

                      <Box
                        sx={{
                          mt: 2,
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Box
                          sx={{
                            width: "40px",
                            height: "40px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "50%",
                            background: "linear-gradient(45deg, #daa520, #e6be5a)",
                            boxShadow: "0 4px 10px rgba(218, 165, 32, 0.3)",
                          }}
                        >
                          <CheckIcon sx={{ color: "#000000" }} />
                        </Box>
                      </Box>

                      <Typography
                        variant="h6"
                        sx={{
                          color: "#4a90e2",
                          mt: 2,
                          fontWeight: "bold",
                        }}
                      >
                        מאורסים
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#aaaaaa", mt: 1 }}>
                        {couple.date}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Carousel Controls */}
      <Box
        className="carousel-controls"
        sx={{
          position: "absolute",
          bottom: "50%",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "space-between",
          px: 2,
          opacity: 0,
          transition: "opacity 0.3s ease",
        }}
      >
        <IconButton
          onClick={handlePrev}
          sx={{
            bgcolor: "rgba(0, 0, 0, 0.7)",
            color: "#daa520",
            "&:hover": {
              bgcolor: "rgba(0, 0, 0, 0.9)",
            },
          }}
        >
          <ArrowForwardIcon />
        </IconButton>
        <IconButton
          onClick={handleNext}
          sx={{
            bgcolor: "rgba(0, 0, 0, 0.7)",
            color: "#daa520",
            "&:hover": {
              bgcolor: "rgba(0, 0, 0, 0.9)",
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
      </Box>

      {/* Indicators */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 3,
          gap: 1,
        }}
      >
        {couples.map((_, index) => (
          <Box
            key={index}
            onClick={() => setCurrentIndex(index)}
            sx={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              bgcolor: index === currentIndex ? "#daa520" : "rgba(218, 165, 32, 0.3)",
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.2)",
                bgcolor: index === currentIndex ? "#daa520" : "rgba(218, 165, 32, 0.5)",
              },
            }}
          />
        ))}
      </Box>
    </Box>
  )
}

export default EngagedCoupleCarousel
