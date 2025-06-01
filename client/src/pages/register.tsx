"use client"

import type React from "react"

import { useState, useEffect, ReactNode } from "react"
// import { useRouter } from "next/navigation"
import { useNavigate } from "react-router-dom"

import { motion, AnimatePresence } from "framer-motion"
import rtlPlugin from "stylis-plugin-rtl"
import { CacheProvider } from "@emotion/react"
import createCache from "@emotion/cache"
import { prefixer } from "stylis"
import authStore from "../store/Auth";
// Material UI imports
import {
  TextField,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
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
} from "@mui/material"

// Material UI icons
import {
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Email as EmailIcon,
  Key as KeyIcon,
  Badge as BadgeIcon,
  Synagogue as SynagoguIcon,
  Google as GoogleIcon,
} from "@mui/icons-material"

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

const RTLFormControl = styled(FormControl)({
  "& .MuiInputLabel-root": {
    right: 16,
    left: "auto",
    transformOrigin: "right",
  },
  "& .MuiInputLabel-shrink": {
    transform: "translate(0, -9px) scale(0.75)",
  },
  "& .MuiSelect-select": {
    textAlign: "right",
    paddingRight: 16,
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
  children: ReactNode; // הגדרת סוג עבור children
  [key: string]: any; // מאפשר להוסיף פרופס נוספים
}
// Animated background elements
const FloatingShape: React.FC<FloatingShapeProps> = ({ children, ...props }) => (
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
);

const RegisterPage = () => {
  const [userName, setUserName] = useState("")
  const [tz, setTz] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState("Shadchan") // ברירת מחדל
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  // שגיאות
  const [userNameError, setUserNameError] = useState("")
  const [tzError, setTzError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [confirmPasswordError, setConfirmPasswordError] = useState("")

  // Local state for form submission
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [registerSuccess, setRegisterSuccess] = useState(false)

  // const router = useRouter()
  const navigate = useNavigate();

  // איפוס הודעות בעת טעינת הדף
  useEffect(() => {
    // Reset messages
    setError(null)
    setRegisterSuccess(false)

    // Force RTL direction on the document
    document.dir = "rtl"
    document.body.style.direction = "rtl"

    return () => {
      document.dir = "ltr"
      document.body.style.direction = "ltr"
    }
  }, [])

  // בדיקת תקינות שם משתמש
  const validateUserName = (userName: string): boolean => {
    if (userName.trim().length < 2) {
      setUserNameError("שם משתמש חייב להכיל לפחות 2 תווים")
      return false
    }
    setUserNameError("")
    return true
  }

  // בדיקת תקינות תעודת זהות
  const validateTz = (tz: string): boolean => {
    if (!/^\d{9}$/.test(tz)) {
      setTzError("תעודת זהות חייבת להכיל 9 ספרות")
      return false
    }
    setTzError("")
    return true
  }

  // בדיקת תקינות אימייל
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

  // בדיקת תקינות סיסמה וחוזק הסיסמה
  const validatePassword = (password: string): boolean => {
    if (password.length < 6) {
      setPasswordError("הסיסמה חייבת להכיל לפחות 6 תווים")
      setPasswordStrength(0)
      return false
    }

    // Calculate password strength
    let strength = 0
    if (password.length >= 8) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1

    setPasswordStrength(strength)
    setPasswordError("")
    return true
  }

  // בדיקת התאמת סיסמאות
  const validateConfirmPassword = (password: string, confirmPassword: string): boolean => {
    if (password !== confirmPassword) {
      setConfirmPasswordError("הסיסמאות אינן תואמות")
      return false
    }

    setConfirmPasswordError("")
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // וידוא תקינות הטופס
    const isUserNameValid = validateUserName(userName)
    const isTzValid = validateTz(tz)
    const isEmailValid = validateEmail(email)
    const isPasswordValid = validatePassword(password)
    const isConfirmPasswordValid = validateConfirmPassword(password, confirmPassword)

    if (!isUserNameValid || !isTzValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      return
    }

    // יצירת אובייקט הנתונים להרשמה
    const registerData = {
      userName,
      tz,
      email,
      passwordHash: password, // בצד השרת יבוצע הצפנה של הסיסמה
      roleName: role,
      createdAt: new Date().toISOString(),
    }

    // Set loading state
    setLoading(true)
    setError(null)

    try {
      // Simulate API call
      
      const success = await authStore.register(registerData);
    
      if (success) {

      // Simulate redirect based on role
      setTimeout(() => {
        const redirectPath = authStore.getRedirectPath();
        console.log(`התחברת בהצלחה! מנתב ל-${redirectPath}`);
      
        // נתב ישירות ללא הוספת סלאש נוסף
        navigate(redirectPath);

      }, 1000)
    }else{
      setError("אירעה שגיאה בתהליך ההרשמה. אנא נסה שנית.")
    }
    } catch (err) {
      setError("אירעה שגיאה בתהליך ההרשמה. אנא נסה שנית.")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    // Simulate Google sign-in process
    setLoading(true)
    setError(null)

    try {
      // This would be replaced with actual Google OAuth implementation
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate successful login
      setRegisterSuccess(true)

      // Redirect after a short delay
      setTimeout(() => {
        navigate("/dashboard")
      }, 1500)
    } catch (err) {
      setError("אירעה שגיאה בהתחברות עם Google. אנא נסה שנית.")
    } finally {
      setLoading(false)
    }
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  // Password strength indicator colors
  const getStrengthColor = (strength: number) => {
    if (strength === 0) return "#f44336" // Red
    if (strength === 1) return "#ff9800" // Orange
    if (strength === 2) return "#ffeb3b" // Yellow
    if (strength === 3) return "#4caf50" // Green
    return "#2196f3" // Blue
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
              top: "10%",
              left: "10%",
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
              right: "15%",
              width: 200,
              height: 200,
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                // background: "radial-gradient(circle, rgba(218, ,32,0.2) 0%, rgba(218,165,32,0) 70%)",
                border: "1px solid rgba(218,165,32,0.1)",
              }}
            />
          </FloatingShape>

          <FloatingShape
            sx={{
              bottom: "20%",
              left: "20%",
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
            style={{ width: "100%", maxWidth: "550px", position: "relative", zIndex: 10 }}
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
                      הרשמה למרכז השידוכים
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" textAlign="center" sx={{ mb: 2 }}>
                      אנא מלא את הפרטים הבאים כדי ליצור חשבון חדש
                    </Typography>
                  </Box>
                }
                sx={{ pb: 0 }}
              />

              <CardContent sx={{ px: { xs: 3, sm: 5 } }}>
                <AnimatePresence>
                  {error && (
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
                        {error}
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {registerSuccess && (
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
                        ההרשמה בוצעה בהצלחה! מועבר לדף ההתחברות...
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
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                  >
                    {loading ? "מתחבר..." : "התחבר באמצעות Google"}
                  </GoogleButton>
                </Box>

                <GoldDivider sx={{ my: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    או הירשם באמצעות טופס
                  </Typography>
                </GoldDivider>

                <Box component="form" onSubmit={handleSubmit} noValidate>
                  <RTLTextField
                    margin="normal"
                    required
                    fullWidth
                    id="userName"
                    label="שם משתמש"
                    name="userName"
                    autoComplete="name"
                    autoFocus
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    onBlur={() => validateUserName(userName)}
                    error={!!userNameError}
                    helperText={userNameError}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="primary" />
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
                    id="tz"
                    label="תעודת זהות"
                    name="tz"
                    autoComplete="off"
                    value={tz}
                    onChange={(e) => setTz(e.target.value)}
                    onBlur={() => validateTz(tz)}
                    error={!!tzError}
                    helperText={tzError}
                    inputProps={{
                      maxLength: 9,
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BadgeIcon color="primary" />
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
                    id="email"
                    label="כתובת אימייל"
                    name="email"
                    autoComplete="email"
                    type="email"
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
                    autoComplete="new-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      validatePassword(e.target.value)
                    }}
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

                  {/* Password strength indicator */}
                  {password && (
                    <Box sx={{ mt: 1, mb: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                          חוזק הסיסמה:
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: getStrengthColor(passwordStrength),
                            fontWeight: "bold",
                          }}
                        >
                          {passwordStrength === 0 && "חלשה מאוד"}
                          {passwordStrength === 1 && "חלשה"}
                          {passwordStrength === 2 && "בינונית"}
                          {passwordStrength === 3 && "חזקה"}
                          {passwordStrength === 4 && "חזקה מאוד"}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        {[0, 1, 2, 3].map((index) => (
                          <Box
                            key={index}
                            sx={{
                              height: 4,
                              flex: 1,
                              bgcolor:
                                index < passwordStrength
                                  ? getStrengthColor(passwordStrength)
                                  : "rgba(255, 255, 255, 0.1)",
                              borderRadius: 1,
                              transition: "background-color 0.3s ease",
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                  <RTLTextField
                    margin="normal"
                    required
                    fullWidth
                    name="confirmPassword"
                    label="אימות סיסמה"
                    id="confirmPassword"
                    autoComplete="new-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onBlur={() => validateConfirmPassword(password, confirmPassword)}
                    error={!!confirmPasswordError}
                    helperText={confirmPasswordError}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <KeyIcon color="primary" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle confirm password visibility"
                            onClick={handleClickShowConfirmPassword}
                            edge="end"
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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

                  <RTLFormControl
                    fullWidth
                    margin="normal"
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
                  >
                    <InputLabel id="role-label">תפקיד</InputLabel>
                    <Select
                      labelId="role-label"
                      id="role"
                      value={role}
                      label="תפקיד"
                      onChange={(e) => setRole(e.target.value as string)}
                    >
                      <MenuItem value="Shadchan">שדכן</MenuItem>
                      <MenuItem value="Candidate">מועמד</MenuItem>
                    </Select>
                    <FormHelperText>בחר את התפקיד שלך במערכת</FormHelperText>
                  </RTLFormControl>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
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
                    disabled={loading}
                  >
                    {loading ? "מבצע הרשמה..." : "הרשם למערכת"}
                  </Button>

                  <Box sx={{ textAlign: "center", mt: 2, mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      כבר יש לך חשבון?{" "}
                      <Link
                        href="/login"
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
                        לחץ כאן להתחברות
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

export default RegisterPage
