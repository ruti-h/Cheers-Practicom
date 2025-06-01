"use client"

import { useState, useEffect } from "react"
import { Box, Typography, Button, Card, CardContent, Avatar } from "@mui/material"
import { Check as CheckIcon } from "@mui/icons-material"

// Define match profiles data
const matchProfiles = [
  {
    id: 1,
    left: {
      name: "וולף",
      age: 20,
      type: "ליטאי",
    },
    right: {
      name: "פוניבז'",
      age: 20,
      type: "ליטאי",
    },
  },
  {
    id: 2,
    left: {
      name: "תהילה",
      age: 22,
      type: "תימני",
    },
    right: {
      name: "עטרת",
      age: 22,
      type: "תימני",
    },
  },
  {
    id: 3,
    left: {
      name: "שירה",
      age: 21,
      type: "ספרדי",
    },
    right: {
      name: "אליהו",
      age: 23,
      type: "ספרדי",
    },
  },
  {
    id: 4,
    left: {
      name: "רבקה",
      age: 19,
      type: "חסידי",
    },
    right: {
      name: "יעקב",
      age: 21,
      type: "חסידי",
    },
  },
]

const MatchAnimation = () => {
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showCheckmark, setShowCheckmark] = useState(true)

  // Function to handle profile rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setShowCheckmark(false)

      setTimeout(() => {
        setCurrentMatchIndex((prevIndex) => (prevIndex + 1) % matchProfiles.length)
        setIsAnimating(false)

        setTimeout(() => {
          setShowCheckmark(true)
        }, 500)
      }, 500)
    }, 5000) // Change profiles every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const currentMatch = matchProfiles[currentMatchIndex]

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: "900px",
        mx: "auto",
        bgcolor: "#ffffff",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
        border: "1px solid rgba(218, 165, 32, 0.3)",
        p: 1,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 10,
          left: 10,
          right: 10,
          display: "flex",
          justifyContent: "flex-end",
          zIndex: 10,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            bgcolor: "#ffffff",
            borderRadius: "30px",
            py: 1,
            px: 2,
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "#000000",
              fontWeight: "bold",
            }}
          >
            {/* שמירה על דיסקרטיות מירבית */}
          </Typography>
        </Box>
      </Box>

      {/* <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "20px",
          transform: "translateY(-50%)",
          bgcolor: "#ffffff",
          borderRadius: "20px",
          py: 2,
          px: 3,
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          zIndex: 10,
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: "#000000",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
        
        </Typography>
      </Box> */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          p: 4,
          bgcolor: "#f0f2f8",
          borderRadius: "16px",
          position: "relative",
        }}
      >
        {/* Left Profile */}
        <Card
          sx={{
            width: "40%",
            bgcolor: "#ffffff",
            borderRadius: "16px",
            boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(218, 165, 32, 0.1)",
            overflow: "hidden",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
            },
            animation: isAnimating ? "fadeOut 0.5s ease forwards" : "fadeIn 0.5s ease forwards",
            "@keyframes fadeIn": {
              from: { opacity: 0, transform: "translateY(10px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
            "@keyframes fadeOut": {
              from: { opacity: 1, transform: "translateY(0)" },
              to: { opacity: 0, transform: "translateY(-10px)" },
            },
          }}
        >
          <CardContent sx={{ p: 3, textAlign: "center" }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                mx: "auto",
                mb: 2,
                border: "3px solid rgba(218, 165, 32, 0.3)",
                bgcolor: "#daa520",
              }}
            >
              {currentMatch.left.name.charAt(0)}
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#000000", mb: 0.5 }}>
              {currentMatch.left.name} • {currentMatch.left.age}
            </Typography>
            <Typography variant="body2" sx={{ color: "#666666", mb: 3 }}>
              {currentMatch.left.type}
            </Typography>
            <Box
              sx={{
                height: "20px",
                bgcolor: "#f5f5f5",
                borderRadius: "4px",
                mb: 3,
                position: "relative",
                overflow: "hidden",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  right: -100,
                  width: "50px",
                  height: "100%",
                  background: "linear-gradient(90deg, transparent, rgba(218, 165, 32, 0.2), transparent)",
                  animation: "shimmer 2s infinite",
                  "@keyframes shimmer": {
                    "0%": { transform: "translateX(0)" },
                    "100%": { transform: "translateX(-400%)" },
                  },
                },
              }}
            ></Box>
            <Button
              variant="contained"
              sx={{
                background: "linear-gradient(45deg, #daa520, #e6be5a)",
                color: "#000000",
                fontWeight: "bold",
                borderRadius: "30px",
                px: 3,
                py: 1,
                "&:hover": {
                  background: "linear-gradient(45deg, #c49619, #daa520)",
                  boxShadow: "0 6px 20px rgba(218, 165, 32, 0.4)",
                },
              }}
            >
              מעוניינים בפגישה
            </Button>
          </CardContent>
        </Card>

        {/* Center Match Icon */}
        <Box
          sx={{
            position: "relative",
            zIndex: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              bgcolor: "#000000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 0 5px rgba(218, 165, 32, 0.2)",
              animation: showCheckmark ? "pulse 2s infinite" : "none",
              "@keyframes pulse": {
                "0%": { boxShadow: "0 0 0 0 rgba(218, 165, 32, 0.4)" },
                "70%": { boxShadow: "0 0 0 15px rgba(218, 165, 32, 0)" },
                "100%": { boxShadow: "0 0 0 0 rgba(218, 165, 32, 0)" },
              },
            }}
          >
            <CheckIcon
              sx={{
                color: "#daa520",
                fontSize: 30,
                opacity: showCheckmark ? 1 : 0,
                transform: showCheckmark ? "scale(1)" : "scale(0.5)",
                transition: "all 0.3s ease",
              }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mt: 1,
            }}
          >
            <Box
              component="span"
              sx={{
                color: "#aaaaaa",
                fontSize: 20,
                animation: "arrowPulseReverse 1.5s infinite ease-in-out",
                mr: 1,
                "@keyframes arrowPulseReverse": {
                  "0%": { opacity: 0.4, transform: "translateX(0)" },
                  "50%": { opacity: 1, transform: "translateX(-5px)" },
                  "100%": { opacity: 0.4, transform: "translateX(0)" },
                },
              }}
            >
              &#x25C0;
            </Box>
            <Box
              component="span"
              sx={{
                color: "#aaaaaa",
                fontSize: 20,
                animation: "arrowPulse 1.5s infinite ease-in-out",
                ml: 1,
                "@keyframes arrowPulse": {
                  "0%": { opacity: 0.4, transform: "translateX(0)" },
                  "50%": { opacity: 1, transform: "translateX(5px)" },
                  "100%": { opacity: 0.4, transform: "translateX(0)" },
                },
              }}
            >
              &#x25B6;
            </Box>
          </Box>
        </Box>

        {/* Right Profile */}
        <Card
          sx={{
            width: "40%",
            bgcolor: "#ffffff",
            borderRadius: "16px",
            boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(218, 165, 32, 0.1)",
            overflow: "hidden",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
            },
            animation: isAnimating ? "fadeOut 0.5s ease forwards" : "fadeIn 0.5s ease forwards",
          }}
        >
          <CardContent sx={{ p: 3, textAlign: "center" }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                mx: "auto",
                mb: 2,
                border: "3px solid rgba(218, 165, 32, 0.3)",
                bgcolor: "#000",
                color: "#daa520",
              }}
            >
              {currentMatch.right.name.charAt(0)}
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#000000", mb: 0.5 }}>
              {currentMatch.right.name} • {currentMatch.right.age}
            </Typography>
            <Typography variant="body2" sx={{ color: "#666666", mb: 3 }}>
              {currentMatch.right.type}
            </Typography>
            <Box
              sx={{
                height: "20px",
                bgcolor: "#f5f5f5",
                borderRadius: "4px",
                mb: 3,
                position: "relative",
                overflow: "hidden",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  right: -100,
                  width: "50px",
                  height: "100%",
                  background: "linear-gradient(90deg, transparent, rgba(218, 165, 32, 0.2), transparent)",
                  animation: "shimmer 2s infinite",
                  animationDelay: "0.5s",
                },
              }}
            >
            </Box>
            <Button
              variant="contained"
              sx={{
                background: "linear-gradient(45deg, #daa520, #e6be5a)",
                color: "#000000",
                fontWeight: "bold",
                borderRadius: "30px",
                px: 3,
                py: 1,
                "&:hover": {
                  background: "linear-gradient(45deg, #c49619, #daa520)",
                  boxShadow: "0 6px 20px rgba(218, 165, 32, 0.4)",
                },
              }}
            >
              מעוניינים בפגישה
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}

export default MatchAnimation
