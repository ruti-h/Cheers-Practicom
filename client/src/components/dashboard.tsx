"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Paper,
  ThemeProvider,
  createTheme,
  styled,
  CssBaseline,
  Avatar,
  Chip,
  Divider,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material"
import { CacheProvider } from "@emotion/react"
import createCache from "@emotion/cache"
import rtlPlugin from "stylis-plugin-rtl"
import { prefixer } from "stylis"
import { heIL } from "@mui/material/locale"
import type { RootState, AppDispatch } from "../store/store"
import { logout, checkCandidateCompletion } from "../store/authSlice"
import PersonIcon from '@mui/icons-material/Person'
import EditIcon from '@mui/icons-material/Edit'
import LogoutIcon from '@mui/icons-material/Logout'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import EmailIcon from '@mui/icons-material/Email'
import EmailSender from './EmailSender' // ייבוא הקומפוננטה

// RTL configuration
const rtlCache = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
})

// Theme
const theme = createTheme(
  {
    direction: "rtl",
    typography: {
      fontFamily: "Arial, sans-serif",
    },
    palette: {
      primary: {
        main: "#D4AF37",
      },
      secondary: {
        main: "#212121",
      },
      background: {
        default: "#f5f5f5",
        paper: "#ffffff",
      },
    },
  },
  heIL,
)

// Styled Components
const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: "100vh",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  padding: theme.spacing(3),
}))

const MainCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  maxWidth: 1200,
  width: "100%",
  margin: "0 auto",
  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(10px)",
}))

const HeaderSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  borderRadius: theme.spacing(2),
  padding: theme.spacing(4),
  color: "white",
  marginBottom: theme.spacing(3),
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><pattern id=\"grain\" width=\"100\" height=\"100\" patternUnits=\"userSpaceOnUse\"><circle cx=\"50\" cy=\"50\" r=\"1\" fill=\"white\" opacity=\"0.1\"/></pattern></defs><rect width=\"100\" height=\"100\" fill=\"url(%23grain)\"/></svg>') repeat",
    opacity: 0.1,
  },
}))

const InfoCard = styled(Card)(() => ({
  height: "100%",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
  },
}))

const SectionTitle = styled(Typography)(({ theme }) => ({
  position: "relative",
  marginBottom: theme.spacing(2),
  paddingBottom: theme.spacing(1),
  color: theme.palette.primary.main,
  fontWeight: "bold",
  "&:after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 60,
    height: 3,
    background: theme.palette.primary.main,
    borderRadius: 2,
  },
}))

interface CandidateData {
  id?: number
  firstName?: string
  lastName?: string
  email?: string
  tz?: string
  phone?: string
  fatherPhone?: string
  motherPhone?: string
  country?: string
  city?: string
  street?: string
  numberHouse?: number
  burnDate?: string
  height?: number
  status?: string
  gender?: string
  class?: string
  club?: string
  healthCondition?: boolean
  // Male specific
  beard?: string
  hat?: string
  suit?: string
  isLearning?: string
  yeshiva?: string
  smoker?: boolean
  driversLicense?: boolean
  // Female specific
  seminar?: string
  professional?: string
  headCovering?: string
  anOutsider?: boolean
  // Preferences
  expectationsFromPartner?: string
  importantTraitsInMe?: string
  importantTraitsIAmLookingFor?: string
  ageFrom?: number
  ageTo?: number
  backGround?: string
  openness?: string
  appearance?: string
  // Preferences fields
  preferredSeminarStyle?: string
  preferredProfessional?: string
  preferredHeadCovering?: string
  preferredAnOutsider?: string
  prefferedIsLearning?: string
  prefferedYeshivaStyle?: string
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { user, isFormCompleted, loading } = useSelector((state: RootState) => state.auth)
  const [candidateData, setCandidateData] = useState<CandidateData | null>(null)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [downloadingPDF, setDownloadingPDF] = useState(false)
  const [emailDialogOpen, setEmailDialogOpen] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success")

  useEffect(() => {
    if (!user) {
      navigate("/login")
      return
    }

    // בדוק אם הטופס הושלם
    if (isFormCompleted === null) {
      dispatch(checkCandidateCompletion(user.email))
    }

    // אם הטופס לא הושלם, נתב לבחירת מגדר
    if (isFormCompleted === false) {
      navigate("/candidate-gender")
      return
    }

    loadCandidateData()
  }, [user, isFormCompleted, dispatch, navigate])

  const loadCandidateData = async () => {
    if (!user) return

    try {
      setLoadingData(true)
      setError(null)

      // נסה לטעון מהשרת תחילה
      try {
        const response = await fetch(`https://localhost:7215/api/Candidate/by-email/${encodeURIComponent(user.email)}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          console.log('✅ נתוני המועמד נטענו מהשרת:', data)
          setCandidateData(data)
          return
        }
      } catch (error) {
        console.log('⚠️ לא ניתן לטעון מהשרת, נסה localStorage')
      }

      // אם לא הצליח מהשרת, טען מ-localStorage
      const localData = localStorage.getItem('candidateFormData')
      const selectedGender = localStorage.getItem('selectedGender')
      
      if (localData) {
        const parsedData = JSON.parse(localData)
        const data = {
          ...parsedData,
          gender: selectedGender || parsedData.gender,
          email: user.email
        }
        console.log('📱 נתוני המועמד נטענו מ-localStorage:', data)
        setCandidateData(data)
      } else {
        setError('לא נמצאו נתוני מועמד')
      }
    } catch (error) {
      console.error('❌ שגיאה בטעינת נתוני המועמד:', error)
      setError('שגיאה בטעינת הנתונים')
    } finally {
      setLoadingData(false)
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate("/login")
  }

  const handleEditProfile = () => {
    navigate("/candidate-edit")
  }

  // פונקציה להורדת PDF בעברית
  const downloadHebrewPDF = async () => {
    if (!candidateData) return

    setDownloadingPDF(true)
    
    try {
      const htmlContent = generateHebrewHTML(candidateData)
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(htmlContent)
        printWindow.document.close()
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print()
          }, 500)
        }
      }
    } catch (error) {
      console.error('❌ שגיאה ביצירת PDF:', error)
      setError('שגיאה ביצירת קובץ PDF')
    } finally {
      setDownloadingPDF(false)
    }
  }

  // פונקציה להורדת Word בעברית
//   const downloadHebrewWord = async () => {
//     if (!candidateData) return

//     setDownloadingWord(true)
    
//     try {
//       const wordContent = generateWordContent(candidateData)
//       const blob = new Blob([wordContent], {
//         type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
//       })
//       const url = window.URL.createObjectURL(blob)
//       const link = document.createElement('a')
//       link.href = url
//       link.download = `${candidateData.firstName || 'מועמד'}_${candidateData.lastName || 'פרופיל'}_${new Date().toLocaleDateString('he-IL').replace(/\//g, '-')}.doc`
//       document.body.appendChild(link)
//       link.click()
//       document.body.removeChild(link)
//       window.URL.revokeObjectURL(url)
//     } catch (error) {
//       console.error('❌ שגיאה ביצירת Word:', error)
//       setError('שגיאה ביצירת קובץ Word')
//     } finally {
//       setDownloadingWord(false)
//     }
//   }

  // פונקציות callback עבור EmailSender
  const handleEmailSuccess = (message: string) => {
    setSnackbarMessage(message)
    setSnackbarSeverity("success")
    setSnackbarOpen(true)
  }

  const handleEmailError = (message: string) => {
    setSnackbarMessage(message)
    setSnackbarSeverity("error")
    setSnackbarOpen(true)
  }

  // פונקציה ליצירת HTML בעברית להדפסה/PDF
  const generateHebrewHTML = (data: CandidateData): string => {
    const currentDate = new Date().toLocaleDateString('he-IL')
    
    return `
    <!DOCTYPE html>
    <html dir="rtl" lang="he">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>פרופיל מועמד - ${data.firstName} ${data.lastName}</title>
        <style>
            @media print {
                @page { margin: 2cm; }
                body { -webkit-print-color-adjust: exact; }
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Arial, sans-serif;
                direction: rtl;
                line-height: 1.6;
                color: #333;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                background: white;
            }
            
            .header {
                text-align: center;
                border-bottom: 3px solid #D4AF37;
                padding-bottom: 20px;
                margin-bottom: 30px;
                background: linear-gradient(135deg, #D4AF37 0%, #212121 100%);
                color: white;
                padding: 30px;
                border-radius: 10px;
            }
            
            .header h1 {
                margin: 0;
                font-size: 2.5em;
                font-weight: bold;
            }
            
            .header p {
                margin: 10px 0 0 0;
                font-size: 1.2em;
                opacity: 0.9;
            }
            
            .section {
                margin-bottom: 30px;
                padding: 20px;
                border: 1px solid #eee;
                border-radius: 8px;
                background: #fafafa;
            }
            
            .section-title {
                color: #D4AF37;
                font-size: 1.4em;
                font-weight: bold;
                margin-bottom: 15px;
                padding-bottom: 8px;
                border-bottom: 2px solid #D4AF37;
            }
            
            .info-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 15px;
                margin-bottom: 15px;
            }
            
            .info-item {
                display: flex;
                align-items: center;
                padding: 8px 0;
            }
            
            .info-label {
                font-weight: bold;
                color: #555;
                margin-left: 10px;
                min-width: 120px;
            }
            
            .info-value {
                color: #333;
                flex: 1;
            }
            
            .text-section {
                margin-top: 15px;
                padding: 15px;
                background: white;
                border-radius: 5px;
                border-right: 4px solid #D4AF37;
            }
            
            .text-title {
                font-weight: bold;
                color: #D4AF37;
                margin-bottom: 8px;
            }
            
            .footer {
                text-align: center;
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                color: #666;
                font-size: 0.9em;
            }
            
            .gender-badge {
                display: inline-block;
                background: ${data.gender === 'male' ? '#2196F3' : '#E91E63'};
                color: white;
                padding: 5px 15px;
                border-radius: 20px;
                font-size: 0.9em;
                margin-right: 10px;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>פרופיל מועמד לשידוכים</h1>
            <p>${data.firstName} ${data.lastName}</p>
            <span class="gender-badge">${data.gender === 'male' ? 'זכר' : 'נקבה'}</span>
        </div>

        <div class="section">
            <div class="section-title">פרטים אישיים</div>
            <div class="info-grid">
                <div class="info-item">
                    <span class="info-label">שם מלא:</span>
                    <span class="info-value">${data.firstName} ${data.lastName}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">אימייל:</span>
                    <span class="info-value">${data.email || 'לא צוין'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">טלפון:</span>
                    <span class="info-value">${data.phone || 'לא צוין'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">תעודת זהות:</span>
                    <span class="info-value">${data.tz || 'לא צוין'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">תאריך לידה:</span>
                    <span class="info-value">${data.burnDate ? new Date(data.burnDate).toLocaleDateString('he-IL') : 'לא צוין'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">גיל:</span>
                    <span class="info-value">${data.burnDate ? new Date().getFullYear() - new Date(data.burnDate).getFullYear() : 'לא צוין'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">גובה:</span>
                    <span class="info-value">${data.height || 'לא צוין'} ס"מ</span>
                </div>
                <div class="info-item">
                    <span class="info-label">מצב משפחתי:</span>
                    <span class="info-value">${data.status || 'לא צוין'}</span>
                </div>
            </div>
        </div>

        <div class="footer">
            <p>דוח זה נוצר ב-${currentDate}</p>
            <p>מערכת שידוכים מתקדמת</p>
        </div>
    </body>
    </html>
    `
  }

  // פונקציה ליצירת תוכן Word
//   const generateWordContent = (data: CandidateData): string => {
//     const currentDate = new Date().toLocaleDateString('he-IL')
    
//     return `
// <html dir="rtl" lang="he">
// <head>
//     <meta charset="UTF-8">
//     <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
//     <title>פרופיל מועמד</title>
// </head>
// <body style="font-family: Arial, sans-serif; direction: rtl; line-height: 1.6;">
//     <div style="text-align: center; border-bottom: 2px solid #D4AF37; padding-bottom: 20px; margin-bottom: 30px;">
//         <h1 style="color: #D4AF37; font-size: 24pt;">פרופיל מועמד לשידוכים</h1>
//         <h2 style="color: #333;">${data.firstName} ${data.lastName}</h2>
//         <p style="background: ${data.gender === 'male' ? '#2196F3' : '#E91E63'}; color: white; padding: 5px 15px; border-radius: 20px; display: inline-block;">
//             ${data.gender === 'male' ? 'זכר' : 'נקבה'}
//         </p>
//     </div>

//     <h2 style="color: #D4AF37; border-bottom: 2px solid #D4AF37; padding-bottom: 5px;">פרטים אישיים</h2>
//     <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
//         <tr><td style="font-weight: bold; width: 30%; padding: 5px;">שם מלא:</td><td style="padding: 5px;">${data.firstName} ${data.lastName}</td></tr>
//         <tr><td style="font-weight: bold; padding: 5px;">אימייל:</td><td style="padding: 5px;">${data.email || 'לא צוין'}</td></tr>
//         <tr><td style="font-weight: bold; padding: 5px;">טלפון:</td><td style="padding: 5px;">${data.phone || 'לא צוין'}</td></tr>
//         <tr><td style="font-weight: bold; padding: 5px;">תעודת זהות:</td><td style="padding: 5px;">${data.tz || 'לא צוין'}</td></tr>
//         <tr><td style="font-weight: bold; padding: 5px;">גיל:</td><td style="padding: 5px;">${data.burnDate ? new Date().getFullYear() - new Date(data.burnDate).getFullYear() : 'לא צוין'}</td></tr>
//         <tr><td style="font-weight: bold; padding: 5px;">גובה:</td><td style="padding: 5px;">${data.height || 'לא צוין'} ס"מ</td></tr>
//         <tr><td style="font-weight: bold; padding: 5px;">מצב משפחתי:</td><td style="padding: 5px;">${data.status || 'לא צוין'}</td></tr>
//     </table>

//     <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ccc; color: #666;">
//         <p>דוח זה נוצר ב-${currentDate}</p>
//         <p>מערכת שידוכים מתקדמת</p>
//     </div>
// </body>
// </html>
//     `
//   }

  if (loading || loadingData) {
    return (
      <CacheProvider value={rtlCache}>
        <ThemeProvider theme={theme}>
          <StyledContainer>
            <MainCard>
              <Box textAlign="center" py={8}>
                <CircularProgress size={60} />
                <Typography variant="h6" sx={{ mt: 3 }}>
                  טוען את פרטי האיזור האישי...
                </Typography>
              </Box>
            </MainCard>
          </StyledContainer>
        </ThemeProvider>
      </CacheProvider>
    )
  }

  if (!user) {
    return (
      <CacheProvider value={rtlCache}>
        <ThemeProvider theme={theme}>
          <StyledContainer>
            <MainCard>
              <Box textAlign="center" py={8}>
                <Typography variant="h6" color="error">
                  יש להתחבר למערכת
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate("/login")}
                  sx={{ mt: 3 }}
                >
                  התחבר
                </Button>
              </Box>
            </MainCard>
          </StyledContainer>
        </ThemeProvider>
      </CacheProvider>
    )
  }

  return (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <StyledContainer>
          <MainCard>
            {/* Header Section */}
            <HeaderSection>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center">
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: "rgba(255,255,255,0.2)",
                      mr: 3,
                      fontSize: "2rem"
                    }}
                  >
                    <PersonIcon fontSize="large" />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      שלום, {candidateData?.firstName || user.username}! 👋
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9, mt: 1 }}>
                      האיזור האישי שלך
                    </Typography>
                    <Chip
                      label={candidateData?.gender === 'male' ? 'זכר' : 'נקבה'}
                      sx={{
                        mt: 2,
                        bgcolor: "rgba(255,255,255,0.2)",
                        color: "white",
                        fontWeight: "bold"
                      }}
                    />
                  </Box>
                </Box>
                
                <Box display="flex" gap={2} flexDirection="column">
                  <Button
                    variant="contained"
                    startIcon={<EmailIcon />}
                    onClick={() => setEmailDialogOpen(true)}
                    sx={{
                      bgcolor: "rgba(255,255,255,0.2)",
                      color: "white",
                      border: "1px solid rgba(255,255,255,0.3)",
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.3)",
                      }
                    }}
                  >
                    שלח פרטים במייל
                  </Button>

                  <Button
                    variant="contained"
                    startIcon={downloadingPDF ? <CircularProgress size={20} color="inherit" /> : <PictureAsPdfIcon />}
                    onClick={downloadHebrewPDF}
                    disabled={downloadingPDF}
                    sx={{
                      bgcolor: "rgba(255,255,255,0.2)",
                      color: "white",
                      border: "1px solid rgba(255,255,255,0.3)",
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.3)",
                      }
                    }}
                  >
                    {downloadingPDF ? 'מכין PDF...' : 'הדפס/שמור PDF'}
                  </Button>
                  
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={handleEditProfile}
                    sx={{
                      color: "white",
                      borderColor: "rgba(255,255,255,0.5)",
                      "&:hover": {
                        borderColor: "white",
                        bgcolor: "rgba(255,255,255,0.1)"
                      }
                    }}
                  >
                    עדכן פרטים
                  </Button>
                  
                  <Button
                    variant="outlined"
                    startIcon={<LogoutIcon />}
                    onClick={handleLogout}
                    sx={{
                      color: "white",
                      borderColor: "rgba(255,255,255,0.5)",
                      "&:hover": {
                        borderColor: "white",
                        bgcolor: "rgba(255,255,255,0.1)"
                      }
                    }}
                  >
                    התנתק
                  </Button>
                </Box>
              </Box>
            </HeaderSection>

            {/* Error Message */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {candidateData ? (
              <Grid container spacing={3}>
                {/* פרטים אישיים */}
                <Grid item xs={12} md={6}>
                  <InfoCard>
                    <CardContent>
                      <SectionTitle variant="h6">ፍרטים אישיים</SectionTitle>
                      <Box display="flex" flexDirection="column" gap={1}>
                        <Typography><strong>שם מלא:</strong> {candidateData.firstName} {candidateData.lastName}</Typography>
                        <Typography><strong>אימייל:</strong> {candidateData.email}</Typography>
                        <Typography><strong>טלפון:</strong> {candidateData.phone}</Typography>
                        <Typography><strong>ת.ז:</strong> {candidateData.tz}</Typography>
                        <Typography><strong>גיל:</strong> {candidateData.burnDate ? new Date().getFullYear() - new Date(candidateData.burnDate).getFullYear() : 'לא צוין'}</Typography>
                        <Typography><strong>גובה:</strong> {candidateData.height} ס"מ</Typography>
                        <Typography><strong>מצב משפחתי:</strong> {candidateData.status}</Typography>
                      </Box>
                    </CardContent>
                  </InfoCard>
                </Grid>

                {/* כתובת */}
                <Grid item xs={12} md={6}>
                  <InfoCard>
                    <CardContent>
                      <SectionTitle variant="h6">כתובת</SectionTitle>
                      <Box display="flex" flexDirection="column" gap={1}>
                        <Typography><strong>מדינה:</strong> {candidateData.country}</Typography>
                        <Typography><strong>עיר:</strong> {candidateData.city}</Typography>
                        <Typography><strong>רחוב:</strong> {candidateData.street} {candidateData.numberHouse}</Typography>
                      </Box>
                    </CardContent>
                  </InfoCard>
                </Grid>

                {/* פרטי קשר */}
                <Grid item xs={12} md={6}>
                  <InfoCard>
                    <CardContent>
                      <SectionTitle variant="h6">פרטי קשר</SectionTitle>
                      <Box display="flex" flexDirection="column" gap={1}>
                        <Typography><strong>טלפון אבא:</strong> {candidateData.fatherPhone || 'לא צוין'}</Typography>
                        <Typography><strong>טלפון אמא:</strong> {candidateData.motherPhone || 'לא צוין'}</Typography>
                      </Box>
                    </CardContent>
                  </InfoCard>
                </Grid>

                {/* פרטים ספציפיים לפי מגדר */}
                <Grid item xs={12} md={6}>
                  <InfoCard>
                    <CardContent>
                      <SectionTitle variant="h6">
                        {candidateData.gender === 'male' ? 'פרטים לגברים' : 'פרטים לנשים'}
                      </SectionTitle>
                      <Box display="flex" flexDirection="column" gap={1}>
                        {candidateData.gender === 'male' ? (
                          <>
                            <Typography><strong>זקן:</strong> {candidateData.beard || 'לא צוין'}</Typography>
                            <Typography><strong>כובע:</strong> {candidateData.hat || 'לא צוין'}</Typography>
                            <Typography><strong>חליפה:</strong> {candidateData.suit || 'לא צוין'}</Typography>
                            <Typography><strong>לומד:</strong> {candidateData.isLearning || 'לא צוין'}</Typography>
                            <Typography><strong>ישיבה:</strong> {candidateData.yeshiva || 'לא צוין'}</Typography>
                            <Typography><strong>מעשן:</strong> {candidateData.smoker ? 'כן' : 'לא'}</Typography>
                            <Typography><strong>רישיון נהיגה:</strong> {candidateData.driversLicense ? 'כן' : 'לא'}</Typography>
                          </>
                        ) : (
                          <>
                            <Typography><strong>סמינר:</strong> {candidateData.seminar || 'לא צוין'}</Typography>
                            <Typography><strong>תחום מקצועי:</strong> {candidateData.professional || 'לא צוין'}</Typography>
                            <Typography><strong>כיסוי ראש:</strong> {candidateData.headCovering || 'לא צוין'}</Typography>
                            <Typography><strong>בעלת תשובה:</strong> {candidateData.anOutsider ? 'כן' : 'לא'}</Typography>
                          </>
                        )}
                      </Box>
                    </CardContent>
                  </InfoCard>
                </Grid>

                {/* רקע ومאפיינים */}
                <Grid item xs={12}>
                  <InfoCard>
                    <CardContent>
                      <SectionTitle variant="h6">רקע ومאפיינים</SectionTitle>
                      <Grid container spacing={2}>
                        {candidateData.backGround && (
                          <Grid item xs={12} md={4}>
                            <Typography variant="subtitle2" color="primary" fontWeight="bold">רקע:</Typography>
                            <Typography variant="body2">{candidateData.backGround}</Typography>
                          </Grid>
                        )}
                        {candidateData.openness && (
                          <Grid item xs={12} md={4}>
                            <Typography variant="subtitle2" color="primary" fontWeight="bold">פתיחות:</Typography>
                            <Typography variant="body2">{candidateData.openness}</Typography>
                          </Grid>
                        )}
                        {candidateData.appearance && (
                          <Grid item xs={12} md={4}>
                            <Typography variant="subtitle2" color="primary" fontWeight="bold">מראה חיצוני:</Typography>
                            <Typography variant="body2">{candidateData.appearance}</Typography>
                          </Grid>
                        )}
                      </Grid>
                    </CardContent>
                  </InfoCard>
                </Grid>

                {/* העדפות לבן/בת זוג */}
                <Grid item xs={12}>
                  <InfoCard>
                    <CardContent>
                      <SectionTitle variant="h6">העדפות לבן/בת זוג</SectionTitle>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Typography><strong>טווח גילאים:</strong> {candidateData.ageFrom} - {candidateData.ageTo}</Typography>
                        </Grid>
                        {candidateData.expectationsFromPartner && (
                          <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" color="primary" fontWeight="bold">ציפיות מבן/בת הזוג:</Typography>
                            <Typography variant="body2">{candidateData.expectationsFromPartner}</Typography>
                          </Grid>
                        )}
                        {candidateData.importantTraitsIAmLookingFor && (
                          <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" color="primary" fontWeight="bold">תכונות חשובות שאני מחפש/ת:</Typography>
                            <Typography variant="body2">{candidateData.importantTraitsIAmLookingFor}</Typography>
                          </Grid>
                        )}
                        {candidateData.importantTraitsInMe && (
                          <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" color="primary" fontWeight="bold">תכונות חשובות בי:</Typography>
                            <Typography variant="body2">{candidateData.importantTraitsInMe}</Typography>
                          </Grid>
                        )}
                      </Grid>
                    </CardContent>
                  </InfoCard>
                </Grid>

                {/* פרטים נוספים */}
                {(candidateData.class || candidateData.club) && (
                  <Grid item xs={12} md={6}>
                    <InfoCard>
                      <CardContent>
                        <SectionTitle variant="h6">פרטים נוספים</SectionTitle>
                        <Box display="flex" flexDirection="column" gap={1}>
                          {candidateData.class && <Typography><strong>כיתה:</strong> {candidateData.class}</Typography>}
                          {candidateData.club && <Typography><strong>מועדון:</strong> {candidateData.club}</Typography>}
                          <Typography><strong>מצב בריאותי:</strong> {candidateData.healthCondition ? 'תקין' : 'לא תקין'}</Typography>
                        </Box>
                      </CardContent>
                    </InfoCard>
                  </Grid>
                )}

                {/* העדפות ספציפיות */}
                {(candidateData.preferredSeminarStyle || candidateData.preferredProfessional || candidateData.preferredHeadCovering || candidateData.preferredAnOutsider || candidateData.prefferedIsLearning || candidateData.prefferedYeshivaStyle) && (
                  <Grid item xs={12} md={6}>
                    <InfoCard>
                      <CardContent>
                        <SectionTitle variant="h6">העדפות ספציפיות</SectionTitle>
                        <Box display="flex" flexDirection="column" gap={1}>
                          {candidateData.preferredSeminarStyle && <Typography><strong>סגנון סמינר מועדף:</strong> {candidateData.preferredSeminarStyle}</Typography>}
                          {candidateData.preferredProfessional && <Typography><strong>תחום מקצועי مועדף:</strong> {candidateData.preferredProfessional}</Typography>}
                          {candidateData.preferredHeadCovering && <Typography><strong>כיסוי ראש מועדף:</strong> {candidateData.preferredHeadCovering}</Typography>}
                          {candidateData.preferredAnOutsider && <Typography><strong>העדפה לבעל/ת תשובה:</strong> {candidateData.preferredAnOutsider}</Typography>}
                          {candidateData.prefferedIsLearning && <Typography><strong>העדפה ללומד/ת:</strong> {candidateData.prefferedIsLearning}</Typography>}
                          {candidateData.prefferedYeshivaStyle && <Typography><strong>סגנון ישיבה מועדף:</strong> {candidateData.prefferedYeshivaStyle}</Typography>}
                        </Box>
                      </CardContent>
                    </InfoCard>
                  </Grid>
                )}
              </Grid>
            ) : (
              <Box textAlign="center" py={8}>
                <Typography variant="h6" color="text.secondary">
                  לא נמצאו נתוני מועמד
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  נראה שלא השלמת את התהליך עדיין
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate("/candidate-gender")}
                  sx={{ mt: 3 }}
                >
                  התחל תהליך הרשמה
                </Button>
              </Box>
            )}

            {/* Footer */}
            <Divider sx={{ my: 4 }} />
            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                מערכת שידוכים מתקدמת • נוצר ב-{new Date().getFullYear()}
              </Typography>
            </Box>
          </MainCard>

          {/* קומپוננטت שליחת מייל */}
          <EmailSender
            open={emailDialogOpen}
            onClose={() => setEmailDialogOpen(false)}
            candidateData={candidateData}
            userToken={user?.token}
            onSuccess={handleEmailSuccess}
            onError={handleEmailError}
          />

          {/* הודעות הצלחה/שגיאה */}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert 
              onClose={() => setSnackbarOpen(false)} 
              severity={snackbarSeverity}
              variant="filled"
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </StyledContainer>
      </ThemeProvider>
    </CacheProvider>
  )
}

export default Dashboard