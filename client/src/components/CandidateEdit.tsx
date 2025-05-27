"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { heIL } from "@mui/material/locale"
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Paper,
  ThemeProvider,
  createTheme,
  CssBaseline,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  FormControlLabel,
  Checkbox
} from "@mui/material"
import { CacheProvider } from "@emotion/react"
import createCache from "@emotion/cache"
import rtlPlugin from "stylis-plugin-rtl"
import { prefixer } from "stylis"
import { styled } from "@mui/material/styles"
import type { RootState } from "../store/store"
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SaveIcon from '@mui/icons-material/Save'
import LockIcon from '@mui/icons-material/Lock'

// RTL cache
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
  maxWidth: 900,
  width: "100%",
  margin: "0 auto",
  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(10px)",
}))

const SectionCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(3),
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  border: "1px solid rgba(0,0,0,0.05)",
}))

const LockedField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    backgroundColor: '#f5f5f5',
    '& input': {
      color: theme.palette.text.secondary,
    }
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.text.secondary,
  }
}))

const SectionTitle = styled(Typography)(({ theme }) => ({
  position: "relative",
  marginBottom: theme.spacing(3),
  paddingBottom: theme.spacing(1),
  color: theme.palette.primary.main,
  fontWeight: "bold",
  "&:after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    background: `linear-gradient(to right, ${theme.palette.primary.main}, rgba(212, 175, 55, 0.1))`,
    borderRadius: 4,
  },
}))

// Validation Schema
const candidateSchema = z.object({
  firstName: z.string().min(1, "שם פרטי חובה"),
  lastName: z.string().min(1, "שם משפחה חובה"),
  tz: z.string().min(9, "תעודת זהות חובה"),
  email: z.string().email("כתובת אימייל לא תקינה"),
  phone: z.string().min(9, "מספר טלפון חובה"),
  fatherPhone: z.string().optional(),
  motherPhone: z.string().optional(),
  country: z.string().min(1, "מדינה חובה"),
  city: z.string().min(1, "עיר חובה"),
  street: z.string().min(1, "רחוב חובה"),
  numberHouse: z.number().min(1, "מספר בית חובה"),
  burnDate: z.string().min(1, "תאריך לידה חובה"),
  height: z.number().min(100, "גובה חובה"),
  status: z.string().min(1, "מצב משפחתי חובה"),
  class: z.string().optional(),
  club: z.string().optional(),
  healthCondition: z.boolean().optional(),
  // Male specific
  beard: z.string().optional(),
  hat: z.string().optional(),
  suit: z.string().optional(),
  isLearning: z.string().optional(),
  yeshiva: z.string().optional(),
  smoker: z.boolean().optional(),
  driversLicense: z.boolean().optional(),
  // Female specific
  seminar: z.string().optional(),
  professional: z.string().optional(),
  headCovering: z.string().optional(),
  anOutsider: z.boolean().optional(),
  // Preferences
  expectationsFromPartner: z.string().optional(),
  importantTraitsInMe: z.string().optional(),
  importantTraitsIAmLookingFor: z.string().optional(),
  ageFrom: z.number().min(18, "גיל מינימלי 18").optional(),
  ageTo: z.number().max(50, "גיל מקסימלי 50").optional(),
  backGround: z.string().optional(),
  openness: z.string().optional(),
  appearance: z.string().optional(),
  // Preferences fields
  preferredSeminarStyle: z.string().optional(),
  preferredProfessional: z.string().optional(),
  preferredHeadCovering: z.string().optional(),
  preferredAnOutsider: z.string().optional(),
  prefferedIsLearning: z.string().optional(),
  prefferedYeshivaStyle: z.string().optional(),
})

type CandidateFormData = z.infer<typeof candidateSchema>

interface CandidateData {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  tz?: string;
  phone?: string;
  fatherPhone?: string;
  motherPhone?: string;
  country?: string;
  city?: string;
  street?: string;
  numberHouse?: number;
  burnDate?: string;
  height?: number;
  status?: string;
  gender?: string;
  class?: string;
  club?: string;
  healthCondition?: boolean;
  // Male specific
  beard?: string;
  hat?: string;
  suit?: string;
  isLearning?: string;
  yeshiva?: string;
  smoker?: boolean;
  driversLicense?: boolean;
  // Female specific
  seminar?: string;
  professional?: string;
  headCovering?: string;
  anOutsider?: boolean;
  // Preferences
  expectationsFromPartner?: string;
  importantTraitsInMe?: string;
  importantTraitsIAmLookingFor?: string;
  ageFrom?: number;
  ageTo?: number;
  backGround?: string;
  openness?: string;
  appearance?: string;
  // Preferences fields
  preferredSeminarStyle?: string;
  preferredProfessional?: string;
  preferredHeadCovering?: string;
  preferredAnOutsider?: string;
  prefferedIsLearning?: string;
  prefferedYeshivaStyle?: string;
}

const CandidateEdit: React.FC = () => {
  const navigate = useNavigate()
//   const dispatch = useDispatch<AppDispatch>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [candidateData, setCandidateData] = useState<CandidateData | null>(null)
  const [loading, setLoading] = useState(true)

  const { user } = useSelector((state: RootState) => state.auth as { user: { email: string; token: string } })

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CandidateFormData>({
    resolver: zodResolver(candidateSchema),
  })

  // טען נתונים קיימים
  useEffect(() => {
    const loadExistingData = async () => {
      if (!user) {
        navigate("/login")
        return
      }

      try {
        setLoading(true)
        
        // נסה לטעון מהשרת
        try {
          const response = await fetch(`https://localhost:7215/api/Candidate/by-email/${encodeURIComponent(user.email)}`, {
            headers: {
              'Authorization': `Bearer ${user.token}`,
              'Content-Type': 'application/json'
            }
          })

          if (response.ok) {
            const serverData = await response.json()
            console.log('✅ נתונים נטענו מהשרת:', serverData)
            setCandidateData(serverData)
            
            // מלא את הטופס בנתונים מהשרת
            reset({
              firstName: serverData.firstName || "",
              lastName: serverData.lastName || "",
              tz: serverData.tz || "",
              email: serverData.email || user.email,
              phone: serverData.phone || "",
              fatherPhone: serverData.fatherPhone || "",
              motherPhone: serverData.motherPhone || "",
              country: serverData.country || "ישראל",
              city: serverData.city || "",
              street: serverData.street || "",
              numberHouse: serverData.numberHouse || 0,
              burnDate: serverData.burnDate ? serverData.burnDate.split('T')[0] : "",
              height: serverData.height || 170,
              status: serverData.status || "",
              class: serverData.class || "",
              club: serverData.club || "",
              healthCondition: serverData.healthCondition ?? true,
              // Male specific
              beard: serverData.beard || "",
              hat: serverData.hat || "",
              suit: serverData.suit || "",
              isLearning: serverData.isLearning || "",
              yeshiva: serverData.yeshiva || "",
              smoker: serverData.smoker ?? false,
              driversLicense: serverData.driversLicense ?? false,
              // Female specific
              seminar: serverData.seminar || "",
              professional: serverData.professional || "",
              headCovering: serverData.headCovering || "",
              anOutsider: serverData.anOutsider ?? false,
              // Preferences
              expectationsFromPartner: serverData.expectationsFromPartner || "",
              importantTraitsInMe: serverData.importantTraitsInMe || "",
              importantTraitsIAmLookingFor: serverData.importantTraitsIAmLookingFor || "",
              ageFrom: serverData.ageFrom || 18,
              ageTo: serverData.ageTo || 30,
              backGround: serverData.backGround || "",
              openness: serverData.openness || "",
              appearance: serverData.appearance || "",
              // Preferences fields
              preferredSeminarStyle: serverData.preferredSeminarStyle || "",
              preferredProfessional: serverData.preferredProfessional || "",
              preferredHeadCovering: serverData.preferredHeadCovering || "",
              preferredAnOutsider: serverData.preferredAnOutsider || "",
              prefferedIsLearning: serverData.prefferedIsLearning || "",
              prefferedYeshivaStyle: serverData.prefferedYeshivaStyle || "",
            })
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
            email: user.email || parsedData.email
          }
          console.log('📱 נתונים נטענו מ-localStorage:', data)
          setCandidateData(data)
          
          // מלא את הטופס בנתונים מ-localStorage
          reset({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            tz: data.tz || "",
            email: data.email || user.email,
            phone: data.phone || "",
            fatherPhone: data.fatherPhone || "",
            motherPhone: data.motherPhone || "",
            country: data.country || "ישראל",
            city: data.city || "",
            street: data.street || "",
            numberHouse: data.numberHouse || 0,
            burnDate: typeof data.burnDate === 'string' ? data.burnDate.split('T')[0] : "",
            height: data.height || 170,
            status: data.status || "",
            class: data.class || "",
            club: data.club || "",
            healthCondition: data.healthCondition ?? true,
            // Male specific
            beard: data.beard || "",
            hat: data.hat || "",
            suit: data.suit || "",
            isLearning: data.isLearning || "",
            yeshiva: data.yeshiva || "",
            smoker: data.smoker ?? false,
            driversLicense: data.driversLicense ?? false,
            // Female specific
            seminar: data.seminar || "",
            professional: data.professional || "",
            headCovering: data.headCovering || "",
            anOutsider: data.anOutsider ?? false,
            // Preferences
            expectationsFromPartner: data.expectationsFromPartner || "",
            importantTraitsInMe: data.importantTraitsInMe || "",
            importantTraitsIAmLookingFor: data.importantTraitsIAmLookingFor || "",
            ageFrom: data.ageFrom || 18,
            ageTo: data.ageTo || 30,
            backGround: data.backGround || "",
            openness: data.openness || "",
            appearance: data.appearance || "",
            // Preferences fields
            preferredSeminarStyle: data.preferredSeminarStyle || "",
            preferredProfessional: data.preferredProfessional || "",
            preferredHeadCovering: data.preferredHeadCovering || "",
            preferredAnOutsider: data.preferredAnOutsider || "",
            prefferedIsLearning: data.prefferedIsLearning || "",
            prefferedYeshivaStyle: data.prefferedYeshivaStyle || "",
          })
        }
      } catch (error) {
        console.error('❌ שגיאה בטעינת נתונים:', error)
        setSubmitError('שגיאה בטעינת הנתונים הקיימים')
      } finally {
        setLoading(false)
      }
    }

    loadExistingData()
  }, [user, reset, navigate])

  const onSubmit = async (data: CandidateFormData) => {
    console.log('🚀 עדכון פרטי מועמד:', data)
    setIsSubmitting(true)
    setSubmitError(null)
    setSuccessMessage(null)

    try {
      // הכן נתונים לעדכון
      const dataToUpdate = {
        ...data,
        gender: candidateData?.gender || "male", // שמור מגדר קיים
        burnDate: new Date(data.burnDate).toISOString(),
      }

      console.log('📤 שולח עדכון לשרת:', dataToUpdate)

      // אם יש ID קיים, עדכן. אחרת צור חדש
      const method = candidateData?.id ? 'PUT' : 'POST'
      const url = candidateData?.id 
        ? `https://localhost:7215/api/Candidate/${candidateData.id}`
        : 'https://localhost:7215/api/Candidate'

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify(dataToUpdate)
      })

      if (response.ok) {
        console.log('✅ פרטי המועמד עודכנו בהצלחה')
        
        // עדכן localStorage עם הנתונים החדשים
        localStorage.setItem('candidateFormData', JSON.stringify(data))
        
        setSuccessMessage('הפרטים עודכנו בהצלחה!')
        
        // חזור לדשבורד אחרי 2 שניות
        setTimeout(() => {
          navigate("/dashboard")
        }, 2000)
      } else {
        const errorData = await response.json()
        console.error('❌ שגיאה בעדכון:', errorData)
        setSubmitError(`שגיאה בעדכון הנתונים: ${errorData.title || 'שגיאה לא ידועה'}`)
      }
    } catch (error) {
      console.error("שגיאה בעדכון פרטי המועמד:", error)
      setSubmitError('שגיאה בתקשורת עם השרת')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate("/dashboard")
  }

  if (loading) {
    return (
      <CacheProvider value={rtlCache}>
        <ThemeProvider theme={theme}>
          <StyledContainer>
            <MainCard>
              <Box textAlign="center" py={4}>
                <CircularProgress size={40} />
                <Typography variant="h6" sx={{ mt: 2 }}>
                  טוען את הפרטים הקיימים...
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
              <Box textAlign="center" py={4}>
                <Typography variant="h6" color="error">
                  יש להתחבר כדי לערוך פרטים
                </Typography>
                <Button onClick={() => navigate("/login")} sx={{ mt: 2 }}>
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
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <StyledContainer>
            <MainCard>
              {/* Header */}
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
                <Box>
                  <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
                    עריכת פרטים אישיים
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    עדכן את הפרטים שלך (שדות ת.ז ושם נועלו לביטחון)
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={handleCancel}
                >
                  חזור לאיזור אישי
                </Button>
              </Box>

              {/* Success Message */}
              {successMessage && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  {successMessage}
                </Alert>
              )}

              {/* Error Message */}
              {submitError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {submitError}
                </Alert>
              )}

              <form onSubmit={handleSubmit(onSubmit)}>
                {/* פרטים אישיים - שדות נעולים */}
                <SectionCard>
                  <SectionTitle variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LockIcon color="action" />
                    פרטים אישיים (נעולים לביטחון)
                  </SectionTitle>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="firstName"
                        control={control}
                        render={({ field }) => (
                          <LockedField
                            {...field}
                            fullWidth
                            label="שם פרטי"
                            disabled
                            value={field.value || ""}
                            InputProps={{
                              startAdornment: <LockIcon sx={{ mr: 1, color: 'text.secondary' }} />
                            }}
                            helperText="שדה זה נעול ולא ניתן לעריכה"
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Controller
                        name="lastName"
                        control={control}
                        render={({ field }) => (
                          <LockedField
                            {...field}
                            fullWidth
                            label="שם משפחה"
                            disabled
                            value={field.value || ""}
                            InputProps={{
                              startAdornment: <LockIcon sx={{ mr: 1, color: 'text.secondary' }} />
                            }}
                            helperText="שדה זה נעול ולא ניתן לעריכה"
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Controller
                        name="tz"
                        control={control}
                        render={({ field }) => (
                          <LockedField
                            {...field}
                            fullWidth
                            label="תעודת זהות"
                            disabled
                            value={field.value || ""}
                            InputProps={{
                              startAdornment: <LockIcon sx={{ mr: 1, color: 'text.secondary' }} />
                            }}
                            helperText="שדה זה נעול ולא ניתן לעריכה"
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                          <LockedField
                            {...field}
                            fullWidth
                            label="אימייל"
                            disabled
                            value={field.value || ""}
                            InputProps={{
                              startAdornment: <LockIcon sx={{ mr: 1, color: 'text.secondary' }} />
                            }}
                            helperText="שדה זה נעול ולא ניתן לעריכה"
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Chip 
                        label={`מגדר: ${candidateData?.gender === 'male' ? 'זכר' : 'נקבה'}`}
                        color={candidateData?.gender === 'male' ? 'primary' : 'secondary'}
                        icon={<LockIcon />}
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        המגדר נקבע בעת הרשמה ולא ניתן לשינוי
                      </Typography>
                    </Grid>
                  </Grid>
                </SectionCard>

                {/* פרטי קשר - ניתנים לעריכה */}
                <SectionCard>
                  <SectionTitle variant="h6">
                    פרטי קשר (ניתנים לעריכה)
                  </SectionTitle>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="טלפון *"
                            error={!!errors.phone}
                            helperText={errors.phone?.message}
                            value={field.value || ""}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Controller
                        name="fatherPhone"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="טלפון האב"
                            value={field.value || ""}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Controller
                        name="motherPhone"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="טלפון האם"
                            value={field.value || ""}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </SectionCard>

                {/* כתובת */}
                <SectionCard>
                  <SectionTitle variant="h6">
                    כתובת מגורים
                  </SectionTitle>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="country"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth error={!!errors.country}>
                            <InputLabel>מדינה *</InputLabel>
                            <Select
                              {...field}
                              label="מדינה *"
                              value={field.value || ""}
                            >
                              <MenuItem value="ישראל">ישראל</MenuItem>
                              <MenuItem value="ארצות הברית">ארצות הברית</MenuItem>
                              <MenuItem value="צרפת">צרפת</MenuItem>
                              <MenuItem value="אנגליה">אנגליה</MenuItem>
                              <MenuItem value="אחר">אחר</MenuItem>
                            </Select>
                            {errors.country && (
                              <Typography variant="caption" color="error">
                                {errors.country.message}
                              </Typography>
                            )}
                          </FormControl>
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Controller
                        name="city"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="עיר *"
                            error={!!errors.city}
                            helperText={errors.city?.message}
                            value={field.value || ""}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Controller
                        name="street"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="רחוב *"
                            error={!!errors.street}
                            helperText={errors.street?.message}
                            value={field.value || ""}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Controller
                        name="numberHouse"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="מספר בית *"
                            type="number"
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            error={!!errors.numberHouse}
                            helperText={errors.numberHouse?.message}
                            value={field.value || ""}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </SectionCard>

                {/* פרטים אישיים נוספים */}
                <SectionCard>
                  <SectionTitle variant="h6">
                    פרטים אישיים נוספים
                  </SectionTitle>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="burnDate"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="תאריך לידה *"
                            type="date"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            error={!!errors.burnDate}
                            helperText={errors.burnDate?.message}
                            value={field.value || ""}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Controller
                        name="height"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="גובה (ס&quot;מ) *"
                            type="number"
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            error={!!errors.height}
                            helperText={errors.height?.message}
                            value={field.value || ""}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth error={!!errors.status}>
                            <InputLabel>מצב משפחתי *</InputLabel>
                            <Select
                              {...field}
                              label="מצב משפחתי *"
                              value={field.value || ""}
                            >
                              <MenuItem value="single">רווק/ה</MenuItem>
                              <MenuItem value="divorced">גרוש/ה</MenuItem>
                              <MenuItem value="widowed">אלמן/ה</MenuItem>
                            </Select>
                            {errors.status && (
                              <Typography variant="caption" color="error">
                                {errors.status.message}
                              </Typography>
                            )}
                          </FormControl>
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Controller
                        name="class"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="כיתה"
                            value={field.value || ""}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Controller
                        name="club"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="מועדון"
                            value={field.value || ""}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Controller
                        name="healthCondition"
                        control={control}
                        render={({ field }) => (
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={field.value ?? true}
                                onChange={(e) => field.onChange(e.target.checked)}
                              />
                            }
                            label="מצב בריאותי תקין"
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </SectionCard>

                {/* פרטים ספציפיים לגברים */}
                {candidateData?.gender === 'male' && (
                  <SectionCard>
                    <SectionTitle variant="h6">
                      פרטים נוספים (גברים)
                    </SectionTitle>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Controller
                          name="beard"
                          control={control}
                          render={({ field }) => (
                            <FormControl fullWidth>
                              <InputLabel>זקן</InputLabel>
                              <Select
                                {...field}
                                label="זקן"
                                value={field.value || ""}
                              >
                                <MenuItem value="יש">יש</MenuItem>
                                <MenuItem value="אין">אין</MenuItem>
                                <MenuItem value="זקן קצר">זקן קצר</MenuItem>
                                <MenuItem value="זקן ארוך">זקן ארוך</MenuItem>
                              </Select>
                            </FormControl>
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Controller
                          name="hat"
                          control={control}
                          render={({ field }) => (
                            <FormControl fullWidth>
                              <InputLabel>כובע</InputLabel>
                              <Select
                                {...field}
                                label="כובע"
                                value={field.value || ""}
                              >
                                <MenuItem value="כיפה">כיפה</MenuItem>
                                <MenuItem value="כובע">כובע</MenuItem>
                                <MenuItem value="ללא">ללא</MenuItem>
                              </Select>
                            </FormControl>
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Controller
                          name="suit"
                          control={control}
                          render={({ field }) => (
                            <FormControl fullWidth>
                              <InputLabel>חליפה</InputLabel>
                              <Select
                                {...field}
                                label="חליפה"
                                value={field.value || ""}
                              >
                                <MenuItem value="שחור">שחור</MenuItem>
                                <MenuItem value="כחול">כחול</MenuItem>
                                <MenuItem value="אפור">אפור</MenuItem>
                                <MenuItem value="אחר">אחר</MenuItem>
                              </Select>
                            </FormControl>
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Controller
                          name="isLearning"
                          control={control}
                          render={({ field }) => (
                            <FormControl fullWidth>
                              <InputLabel>לומד</InputLabel>
                              <Select
                                {...field}
                                label="לומד"
                                value={field.value || ""}
                              >
                                <MenuItem value="כן">כן</MenuItem>
                                <MenuItem value="לא">לא</MenuItem>
                                <MenuItem value="חלקית">חלקית</MenuItem>
                              </Select>
                            </FormControl>
                          )}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Controller
                          name="yeshiva"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="ישיבה"
                              value={field.value || ""}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Controller
                          name="smoker"
                          control={control}
                          render={({ field }) => (
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={field.value ?? false}
                                  onChange={(e) => field.onChange(e.target.checked)}
                                />
                              }
                              label="מעשן"
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Controller
                          name="driversLicense"
                          control={control}
                          render={({ field }) => (
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={field.value ?? false}
                                  onChange={(e) => field.onChange(e.target.checked)}
                                />
                              }
                              label="רישיון נהיגה"
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </SectionCard>
                )}

                {/* פרטים ספציפיים לנשים */}
                {candidateData?.gender === 'female' && (
                  <SectionCard>
                    <SectionTitle variant="h6">
                      פרטים נוספים (נשים)
                    </SectionTitle>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Controller
                          name="seminar"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="סמינר"
                              value={field.value || ""}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Controller
                          name="professional"
                          control={control}
                          render={({ field }) => (
                            <FormControl fullWidth>
                              <InputLabel>תחום מקצועי</InputLabel>
                              <Select
                                {...field}
                                label="תחום מקצועי"
                                value={field.value || ""}
                              >
                                <MenuItem value="חינוך">חינוך</MenuItem>
                                <MenuItem value="היי-טק">היי-טק</MenuItem>
                                <MenuItem value="משרדי">משרדי</MenuItem>
                                <MenuItem value="טיפולי">טיפולי</MenuItem>
                                <MenuItem value="אחר">אחר</MenuItem>
                              </Select>
                            </FormControl>
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Controller
                          name="headCovering"
                          control={control}
                          render={({ field }) => (
                            <FormControl fullWidth>
                              <InputLabel>כיסוי ראש מועדף לאחר החתונה</InputLabel>
                              <Select
                                {...field}
                                label="כיסוי ראש מועדף לאחר החתונה"
                                value={field.value || ""}
                              >
                                <MenuItem value="פאה">פאה</MenuItem>
                                <MenuItem value="מטפחת">מטפחת</MenuItem>
                                <MenuItem value="כובע">כובע</MenuItem>
                                <MenuItem value="שילוב">שילוב</MenuItem>
                              </Select>
                            </FormControl>
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Controller
                          name="anOutsider"
                          control={control}
                          render={({ field }) => (
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={field.value ?? false}
                                  onChange={(e) => field.onChange(e.target.checked)}
                                />
                              }
                              label="בעלת תשובה"
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </SectionCard>
                )}

                {/* רקע ומאפיינים */}
                <SectionCard>
                  <SectionTitle variant="h6">
                    רקע ומאפיינים
                  </SectionTitle>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="backGround"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="רקע"
                            multiline
                            rows={4}
                            value={field.value || ""}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Controller
                        name="openness"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="פתיחות"
                            multiline
                            rows={4}
                            value={field.value || ""}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Controller
                        name="appearance"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="מראה חיצוני"
                            multiline
                            rows={4}
                            value={field.value || ""}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </SectionCard>

                {/* העדפות לבן/בת זוג */}
                <SectionCard>
                  <SectionTitle variant="h6">
                    העדפות לבן/בת זוג
                  </SectionTitle>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="ageFrom"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="גיל מינימלי"
                            type="number"
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 18)}
                            error={!!errors.ageFrom}
                            helperText={errors.ageFrom?.message}
                            value={field.value || ""}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Controller
                        name="ageTo"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="גיל מקסימלי"
                            type="number"
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 30)}
                            error={!!errors.ageTo}
                            helperText={errors.ageTo?.message}
                            value={field.value || ""}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Controller
                        name="expectationsFromPartner"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="ציפיות מבן/בת הזוג"
                            multiline
                            rows={4}
                            value={field.value || ""}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Controller
                        name="importantTraitsIAmLookingFor"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="תכונות חשובות שאני מחפש/ת"
                            multiline
                            rows={4}
                            value={field.value || ""}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Controller
                        name="importantTraitsInMe"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="תכונות חשובות בי"
                            multiline
                            rows={4}
                            value={field.value || ""}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </SectionCard>

                {/* העדפות ספציפיות */}
                <SectionCard>
                  <SectionTitle variant="h6">
                    העדפות ספציפיות
                  </SectionTitle>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="preferredSeminarStyle"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="סגנון סמינר מועדף"
                            value={field.value || ""}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Controller
                        name="preferredProfessional"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="תחום מקצועי מועדף"
                            value={field.value || ""}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Controller
                        name="preferredHeadCovering"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="כיסוי ראש מועדף"
                            value={field.value || ""}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Controller
                        name="preferredAnOutsider"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth>
                            <InputLabel>העדפה לבעל/ת תשובה</InputLabel>
                            <Select
                              {...field}
                              label="העדפה לבעל/ת תשובה"
                              value={field.value || ""}
                            >
                              <MenuItem value="כן">כן</MenuItem>
                              <MenuItem value="לא">לא</MenuItem>
                              <MenuItem value="לא משנה">לא משנה</MenuItem>
                            </Select>
                          </FormControl>
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Controller
                        name="prefferedIsLearning"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth>
                            <InputLabel>העדפה ללומד/ת</InputLabel>
                            <Select
                              {...field}
                              label="העדפה ללומד/ת"
                              value={field.value || ""}
                            >
                              <MenuItem value="לימודים מלאים">לימודים מלאים</MenuItem>
                              <MenuItem value="לימודים חלקיים">לימודים חלקיים</MenuItem>
                              <MenuItem value="לא משנה">לא משנה</MenuItem>
                            </Select>
                          </FormControl>
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Controller
                        name="prefferedYeshivaStyle"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="סגנון ישיבה מועדף"
                            value={field.value || ""}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </SectionCard>

                {/* כפתורי פעולה */}
                <Box 
                  display="flex" 
                  justifyContent="center" 
                  gap={2} 
                  mt={4}
                  sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
                >
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    sx={{ minWidth: 150 }}
                  >
                    ביטול
                  </Button>
                  
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isSubmitting}
                    startIcon={isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
                    sx={{ minWidth: 150 }}
                  >
                    {isSubmitting ? 'שומר...' : 'שמור שינויים'}
                  </Button>
                </Box>
              </form>
            </MainCard>
          </StyledContainer>
        </LocalizationProvider>
      </ThemeProvider>
    </CacheProvider>
  )
}

export default CandidateEdit