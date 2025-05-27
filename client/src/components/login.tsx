"use client"

import type React from "react"
import type { PropsWithChildren } from "react"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"

import { motion, AnimatePresence } from "framer-motion"
import rtlPlugin from "stylis-plugin-rtl"
import { CacheProvider } from "@emotion/react"
import createCache from "@emotion/cache"
import { prefixer } from "stylis"
import { loginUser, checkCandidateCompletion } from "../store/authSlice" // עדכן את הנתיב
import type { RootState, AppDispatch } from "../store/store" // עדכן את הנתיב

// Material UI imports
import {
  TextField,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  IconButton,
  InputAdornment,
  Alert,
  Box,
  Container,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Link,
  styled,
  Divider,
  Avatar,
  CircularProgress,
} from "@mui/material"

// Material UI icons
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Key as KeyIcon,
  Synagogue as SynagoguIcon,
  Google as GoogleIcon,
  Login as LoginIcon,
} from "@mui/icons-material"
import { supabase } from "./supabaseClient"

// Create RTL cache
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
})

// Create a theme with RTL support
const theme = createTheme({
  direction: "rtl",
  palette: {
    mode: "dark",
    primary: {
      main: "#daa520", // Gold
      light: "#e6be5a",
      dark: "#c49619",
      contrastText: "#000000",
    },
    secondary: {
      main: "#4a2c40", // Royal purple
      light: "#6a4c60",
      dark: "#2a0c20",
      contrastText: "#ffffff",
    },
    error: {
      main: "#f44336",
    },
    background: {
      default: "#0a0a0a",
      paper: "#111111",
    },
    text: {
      primary: "#ffffff",
      secondary: "#aaaaaa",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
})

// Styled components for RTL support
const RTLTextField = styled(TextField)({
  "& .MuiInputBase-root": {
    direction: "rtl",
  },
  "& .MuiInputLabel-root": {
    right: 16,
    left: "auto",
    transformOrigin: "right",
  },
  "& .MuiInputLabel-shrink": {
    transform: "translate(0, -9px) scale(0.75)",
  },
  "& .MuiFormHelperText-root": {
    textAlign: "right",
  },
})

const BackgroundContainer = styled(Container)({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "2rem",
  position: "relative",
  overflow: "hidden",
})

const StyledCard = styled(Card)(() => ({
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
  border: "1px solid rgba(218, 165, 32, 0.3)",
  backgroundColor: "rgba(17, 17, 17, 0.95)",
  backdropFilter: "blur(10px)",
  position: "relative",
  zIndex: 10,
  overflow: "visible",
  "&::before": {
    content: '""',
    position: "absolute",
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    background: "linear-gradient(135deg, #daa520, #4a2c40, #daa520)",
    zIndex: -1,
    borderRadius: 20,
    opacity: 0.7,
  },
}))

const GoldDivider = styled(Divider)({
  "&::before, &::after": {
    borderColor: "rgba(218, 165, 32, 0.3)",
  },
})

const GoogleButton = styled(Button)(() => ({
  backgroundColor: "#ffffff",
  color: "#757575",
  "&:hover": {
    backgroundColor: "#f5f5f5",
  },
  textTransform: "none",
  fontWeight: 500,
  padding: "10px 16px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
  "& .MuiButton-startIcon": {
    marginRight: 8,
  },
}))

const RoyalAvatar = styled(Avatar)(({ theme }) => ({
  margin: "0 auto 16px auto",
  backgroundColor: theme.palette.secondary.main,
  width: 70,
  height: 70,
  border: "3px solid #daa520",
  boxShadow: "0 0 15px rgba(218, 165, 32, 0.5)",
}))

interface FloatingShapeProps {
  [key: string]: any
}

const FloatingShape: React.FC<PropsWithChildren<FloatingShapeProps>> = ({ children, ...props }) => (
  <Box
    component={motion.div}
    initial={{ opacity: 0 }}
    animate={{
      opacity: [0.2, 0.5, 0.2],
      rotate: [0, 180, 360],
      scale: [1, 1.1, 1],
    }}
    transition={{
      duration: 20,
      repeat: Number.POSITIVE_INFINITY,
      repeatType: "reverse",
    }}
    sx={{
      position: "absolute",
      zIndex: 0,
      pointerEvents: "none",
    }}
    {...props}
  >
    {children}
  </Box>
)

const LoginPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  
  // Redux state
  const { user, loading: reduxLoading, error: reduxError, isFormCompleted } = useSelector((state: RootState) => state.auth)

  // Local state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (isFormCompleted === null && user.email) {
        dispatch(checkCandidateCompletion(user.email))
      } else if (isFormCompleted === true) {
        navigate("/dashboard")
      } else if (isFormCompleted === false) {
        navigate("/candidate-gender")
      }
    }
  }, [user, isFormCompleted, navigate, dispatch])

  // איפוס הודעות בעת טעינת הדף
  useEffect(() => {
    // Force RTL direction on the document
    document.dir = "rtl"
    document.body.style.direction = "rtl"

    return () => {
      document.dir = "ltr"
      document.body.style.direction = "ltr"
    }
  }, [])

  // בדיקת תקינות האימייל
  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const isValid = regex.test(email)

    if (!isValid) {
      setEmailError("אנא הכנס כתובת אימייל תקינה")
      return false
    }

    setEmailError("")
    return true
  }

  // בדיקת תקינות הסיסמה
  const validatePassword = (password: string): boolean => {
    if (password.length < 6) {
      setPasswordError("הסיסמה חייבת להכיל לפחות 6 תווים")
      return false
    }

    setPasswordError("")
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🚀 מתחיל תהליך התחברות');

    // וידוא תקינות הטופס
    const isEmailValid = validateEmail(email)
    const isPasswordValid = validatePassword(password)

    if (!isEmailValid || !isPasswordValid) {
      console.log('❌ שגיאות ולידציה בטופס');
      return
    }

    setIsLoggingIn(true)

    try {
      console.log('📡 שולח בקשת התחברות לשרת...');
      
      // התחבר עם Redux
      const loginResult = await dispatch(loginUser({
        username: email, // השרת מצפה ל-email בשדה username
        password: password
      })).unwrap()

      console.log('✅ התחברות הצליחה:', loginResult)
      setLoginSuccess(true)

      // בדוק אם השלים טופס מועמד
      console.log('🔍 בודק סטטוס השלמת טופס...');
      const isCompleted = await dispatch(checkCandidateCompletion(loginResult.email)).unwrap()
      
      console.log(`📋 סטטוס השלמת טופס: ${isCompleted ? 'הושלם ✅' : 'לא הושלם ❌'}`);

      // נתב בהתאם לתוצאה
      setTimeout(() => {
        if (isCompleted) {
          console.log('➡️ מנתב לאיזור אישי');
          navigate("/dashboard")
        } else {
          console.log('➡️ מנתב לטופס מועמד');
          navigate("/candidate-gender")
        }
      }, 1000)

    } catch (error: any) {
      console.error('❌ שגיאה בהתחברות:', error)
      // השגיאה תוצג דרך Redux error state
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + "/auth/callback",
        },
      });

      if (error) {
        console.error(error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoggingIn(false);
    }
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  // Show loading state
  if (isLoggingIn || (user && isFormCompleted === null)) {
    return (
      <CacheProvider value={cacheRtl}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BackgroundContainer maxWidth={false} disableGutters>
            <Box sx={{ textAlign: "center", color: "white" }}>
              <CircularProgress size={60} sx={{ color: "primary.main", mb: 2 }} />
              <Typography variant="h6">
                {isLoggingIn ? "מתחבר..." : "בודק סטטוס וטוען עמוד..."}
              </Typography>
            </Box>
          </BackgroundContainer>
        </ThemeProvider>
      </CacheProvider>
    )
  }

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BackgroundContainer maxWidth={false} disableGutters>
          {/* Background gradient */}
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
              zIndex: -1,
            }}
          />

          {/* Animated background elements */}
          <FloatingShape
            sx={{
              top: "15%",
              right: "10%",
              width: 300,
              height: 300,
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(74,44,64,0.3) 0%, rgba(74,44,64,0) 70%)",
                border: "1px solid rgba(74,44,64,0.2)",
              }}
            />
          </FloatingShape>

          <FloatingShape
            sx={{
              top: "60%",
              left: "15%",
              width: 200,
              height: 200,
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(218,165,32,0.2) 0%, rgba(218,165,32,0) 70%)",
                border: "1px solid rgba(218,165,32,0.1)",
              }}
            />
          </FloatingShape>

          <FloatingShape
            sx={{
              bottom: "15%",
              right: "20%",
              width: 150,
              height: 150,
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: "100%",
                clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                background: "radial-gradient(circle, rgba(218,165,32,0.15) 0%, rgba(218,165,32,0) 70%)",
                border: "1px solid rgba(218,165,32,0.1)",
              }}
            />
          </FloatingShape>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            style={{ width: "100%", maxWidth: "450px", position: "relative", zIndex: 10 }}
          >
            <StyledCard>
              <CardHeader
                title={
                  <Box sx={{ textAlign: "center", mt: 3 }}>
                    <RoyalAvatar>
                      <SynagoguIcon
                        sx={{
                          fontSize: 40,
                          color: "#daa520",
                          animation: "glow 3s infinite alternate",
                          "@keyframes glow": {
                            "0%": { filter: "drop-shadow(0 0 2px rgba(218, 165, 32, 0.3))" },
                            "100%": { filter: "drop-shadow(0 0 8px rgba(218, 165, 32, 0.6))" },
                          },
                        }}
                      />
                    </RoyalAvatar>
                    <Typography
                      variant="h4"
                      component="h1"
                      fontWeight="bold"
                      sx={{
                        color: "#daa520",
                        textAlign: "center",
                        mb: 1,
                        textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
                        background: "linear-gradient(to right, #c49619, #daa520, #e6be5a)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      התחברות למרכז השידוכים
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" textAlign="center" sx={{ mb: 2 }}>
                      אנא הזן את פרטי ההתחברות שלך
                    </Typography>
                  </Box>
                }
                sx={{ pb: 0 }}
              />

              <CardContent sx={{ px: { xs: 3, sm: 5 } }}>
                <AnimatePresence>
                  {reduxError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <Alert
                        severity="error"
                        sx={{
                          mb: 2,
                          textAlign: "right",
                          backgroundColor: "rgba(211, 47, 47, 0.1)",
                          color: "#f44336",
                          "& .MuiAlert-icon": {
                            color: "#f44336",
                          },
                        }}
                      >
                        {reduxError}
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {loginSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <Alert
                        severity="success"
                        sx={{
                          mb: 2,
                          textAlign: "right",
                          backgroundColor: "rgba(46, 125, 50, 0.1)",
                          color: "#4caf50",
                          "& .MuiAlert-icon": {
                            color: "#4caf50",
                          },
                        }}
                      >
                        התחברת בהצלחה! בודק סטטוס וטוען עמוד...
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Google Sign In Button */}
                <Box sx={{ mb: 3 }}>
                  <GoogleButton
                    fullWidth
                    variant="contained"
                    startIcon={<GoogleIcon />}
                    onClick={handleGoogleLogin}
                    disabled={reduxLoading || isLoggingIn}
                  >
                    {reduxLoading || isLoggingIn ? "מתחבר..." : "התחבר באמצעות Google"}
                  </GoogleButton>
                </Box>

                <GoldDivider sx={{ my: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    או התחבר באמצעות אימייל
                  </Typography>
                </GoldDivider>

                <Box component="form" onSubmit={handleSubmit} noValidate>
                  <RTLTextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="כתובת אימייל"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => validateEmail(email)}
                    error={!!emailError}
                    helperText={emailError}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "rgba(218, 165, 32, 0.3)",
                        },
                        "&:hover fieldset": {
                          borderColor: "rgba(218, 165, 32, 0.5)",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#daa520",
                        },
                      },
                    }}
                  />

                  <RTLTextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="סיסמה"
                    id="password"
                    autoComplete="current-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => validatePassword(password)}
                    error={!!passwordError}
                    helperText={passwordError}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <KeyIcon color="primary" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "rgba(218, 165, 32, 0.3)",
                        },
                        "&:hover fieldset": {
                          borderColor: "rgba(218, 165, 32, 0.5)",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#daa520",
                        },
                      },
                    }}
                  />

                  <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                    <Link
                      href="/forgot-password"
                      variant="body2"
                      sx={{
                        color: "#daa520",
                        textDecoration: "none",
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      שכחת סיסמה?
                    </Link>
                  </Box>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    startIcon={<LoginIcon />}
                    sx={{
                      mt: 3,
                      mb: 2,
                      py: 1.5,
                      background: "linear-gradient(45deg, #daa520, #e6be5a)",
                      color: "#000",
                      boxShadow: "0 4px 20px rgba(218, 165, 32, 0.3)",
                      "&:hover": {
                        background: "linear-gradient(45deg, #c49619, #daa520)",
                        boxShadow: "0 6px 25px rgba(218, 165, 32, 0.4)",
                        transform: "translateY(-2px)",
                        transition: "all 0.3s ease",
                      },
                      fontWeight: "bold",
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
                    disabled={reduxLoading || isLoggingIn}
                  >
                    {reduxLoading || isLoggingIn ? (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CircularProgress size={20} color="inherit" />
                        מתחבר...
                      </Box>
                    ) : (
                      "התחבר"
                    )}
                  </Button>

                  <Box sx={{ textAlign: "center", mt: 2, mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      אין לך חשבון עדיין?{" "}
                      <Link
                        href="/register"
                        sx={{
                          color: "#daa520",
                          fontWeight: 600,
                          textDecoration: "none",
                          position: "relative",
                          "&::after": {
                            content: '""',
                            position: "absolute",
                            bottom: -2,
                            right: 0,
                            width: "100%",
                            height: "1px",
                            background: "linear-gradient(90deg, transparent, #daa520, transparent)",
                            transform: "scaleX(0)",
                            transformOrigin: "right",
                            transition: "transform 0.3s ease",
                          },
                          "&:hover::after": {
                            transform: "scaleX(1)",
                            transformOrigin: "left",
                          },
                        }}
                      >
                        הירשם עכשיו
                      </Link>
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </StyledCard>
          </motion.div>
        </BackgroundContainer>
      </ThemeProvider>
    </CacheProvider>
  )
}

export default LoginPage