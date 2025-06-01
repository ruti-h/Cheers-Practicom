"use client"

import { Box } from "@mui/material"

// Enhanced floating circles animation component
const FloatingCircles = () => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden",
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      {/* Large gold circle with border */}
      <Box
        sx={{
          position: "absolute",
          width: "220px",
          height: "220px",
          background: "radial-gradient(circle, rgba(218,165,32,0.25) 0%, rgba(218,165,32,0) 70%)",
          borderRadius: "50%",
          border: "2px solid rgba(218,165,32,0.15)",
          animation: "floatSlow 25s infinite ease-in-out",
          top: "15%",
          left: "10%",
          boxShadow: "0 0 30px rgba(218,165,32,0.2)",
        }}
      />

      {/* Medium black circle */}
      <Box
        sx={{
          position: "absolute",
          width: "150px",
          height: "150px",
          background: "radial-gradient(circle, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0) 70%)",
          borderRadius: "50%",
          animation: "floatSlow 20s infinite ease-in-out reverse",
          animationDelay: "2s",
          top: "60%",
          left: "75%",
          boxShadow: "0 0 20px rgba(0,0,0,0.1)",
        }}
      />

      {/* Small gold hexagon */}
      <Box
        sx={{
          position: "absolute",
          width: "100px",
          height: "100px",
          background: "radial-gradient(circle, rgba(218,165,32,0.25) 0%, rgba(218,165,32,0) 70%)",
          clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          animation: "floatSlow 18s infinite ease-in-out",
          animationDelay: "1s",
          top: "30%",
          left: "60%",
          boxShadow: "0 0 15px rgba(218,165,32,0.2)",
        }}
      />

      {/* Small black diamond */}
      <Box
        sx={{
          position: "absolute",
          width: "120px",
          height: "120px",
          background: "radial-gradient(circle, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0) 70%)",
          clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
          animation: "floatSlow 22s infinite ease-in-out",
          animationDelay: "3s",
          top: "70%",
          left: "30%",
          boxShadow: "0 0 15px rgba(0,0,0,0.1)",
        }}
      />

      {/* Medium gold circle with ring */}
      <Box
        sx={{
          position: "absolute",
          width: "180px",
          height: "180px",
          background: "radial-gradient(circle, rgba(218,165,32,0.2) 0%, rgba(218,165,32,0) 70%)",
          borderRadius: "50%",
          animation: "floatSlow 28s infinite ease-in-out",
          animationDelay: "4s",
          top: "40%",
          left: "40%",
          boxShadow: "0 0 25px rgba(218,165,32,0.15)",
          "&::after": {
            content: '""',
            position: "absolute",
            top: "-15px",
            left: "-15px",
            right: "-15px",
            bottom: "-15px",
            borderRadius: "50%",
            border: "1px solid rgba(218,165,32,0.1)",
            animation: "spin 30s linear infinite",
          },
        }}
      />

      {/* Extra small black triangle */}
      <Box
        sx={{
          position: "absolute",
          width: "80px",
          height: "80px",
          background: "radial-gradient(circle, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0) 70%)",
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          animation: "floatSlow 15s infinite ease-in-out",
          animationDelay: "2.5s",
          top: "20%",
          left: "80%",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
      />

      {/* Extra small gold square */}
      <Box
        sx={{
          position: "absolute",
          width: "60px",
          height: "60px",
          background: "radial-gradient(circle, rgba(218,165,32,0.3) 0%, rgba(218,165,32,0) 70%)",
          animation: "floatSlow 12s infinite ease-in-out reverse",
          animationDelay: "1.5s",
          top: "80%",
          left: "15%",
          boxShadow: "0 0 15px rgba(218,165,32,0.2)",
          transform: "rotate(45deg)",
        }}
      />

      {/* Large black circle with double border */}
      <Box
        sx={{
          position: "absolute",
          width: "250px",
          height: "250px",
          background: "radial-gradient(circle, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 70%)",
          borderRadius: "50%",
          animation: "floatSlow 30s infinite ease-in-out",
          animationDelay: "5s",
          top: "10%",
          left: "70%",
          boxShadow: "0 0 30px rgba(0,0,0,0.08)",
          "&::before": {
            content: '""',
            position: "absolute",
            top: "-10px",
            left: "-10px",
            right: "-10px",
            bottom: "-10px",
            borderRadius: "50%",
            border: "1px solid rgba(0,0,0,0.05)",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            top: "-20px",
            left: "-20px",
            right: "-20px",
            bottom: "-20px",
            borderRadius: "50%",
            border: "1px dashed rgba(218,165,32,0.1)",
            animation: "spin 45s linear infinite reverse",
          },
        }}
      />

      {/* Medium gold pentagon */}
      <Box
        sx={{
          position: "absolute",
          width: "130px",
          height: "130px",
          background: "radial-gradient(circle, rgba(218,165,32,0.25) 0%, rgba(218,165,32,0) 70%)",
          clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
          animation: "floatSlow 24s infinite ease-in-out",
          animationDelay: "3.5s",
          top: "55%",
          left: "55%",
          boxShadow: "0 0 20px rgba(218,165,32,0.15)",
        }}
      />

      {/* Small black circle with gold border */}
      <Box
        sx={{
          position: "absolute",
          width: "90px",
          height: "90px",
          background: "radial-gradient(circle, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0) 70%)",
          borderRadius: "50%",
          border: "2px solid rgba(218,165,32,0.1)",
          animation: "floatSlow 20s infinite ease-in-out",
          animationDelay: "2.8s",
          top: "25%",
          left: "25%",
          boxShadow: "0 0 15px rgba(0,0,0,0.08)",
        }}
      />

      <Box
        sx={{
          "@keyframes floatSlow": {
            "0%": { transform: "translate(0, 0) scale(1) rotate(0deg)" },
            "25%": { transform: "translate(30px, 15px) scale(1.05) rotate(5deg)" },
            "50%": { transform: "translate(0, 30px) scale(1) rotate(0deg)" },
            "75%": { transform: "translate(-30px, 15px) scale(0.95) rotate(-5deg)" },
            "100%": { transform: "translate(0, 0) scale(1) rotate(0deg)" },
          },
          "@keyframes spin": {
            "0%": { transform: "rotate(0deg)" },
            "100%": { transform: "rotate(360deg)" },
          },
        }}
      />
    </Box>
  )
}

export default FloatingCircles
