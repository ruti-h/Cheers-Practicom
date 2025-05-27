"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { useNavigate } from "react-router-dom"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { heIL } from "@mui/material/locale"
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Button,
  Container,
  Grid,
  FormControlLabel,
  Paper,
  ThemeProvider,
  createTheme,
  styled,
  Checkbox,
  CssBaseline,
} from "@mui/material"
import { Upload } from "@mui/icons-material"
import { CacheProvider } from "@emotion/react"
import createCache from "@emotion/cache"
import rtlPlugin from "stylis-plugin-rtl"
import { prefixer } from "stylis"
import candidateStore, { Gender } from "../store/candidateStore"
import UploadDialog from "./file_pages/UploadDialog" // נוסיף את הקומפוננט החדש

// RTL configuration
const rtlCache = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
})

// Custom theme
const theme = createTheme(
  {
    direction: "rtl",
    typography: {
      fontFamily: "Arial, sans-serif",
    },
    palette: {
      primary: {
        main: "#D4AF37", // Gold color
      },
      secondary: {
        main: "#212121", // Dark gray (almost black)
      },
      background: {
        default: "#f5f5f5",
        paper: "#ffffff",
      },
      text: {
        primary: "#212121",
        secondary: "#757575",
      },
    },
  },
  heIL,
)

// Styled components
const SectionTitle = styled(Typography)(({ theme }) => ({
  position: "relative",
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(3),
  paddingBottom: theme.spacing(1),
  color: theme.palette.secondary.main,
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

const formSchema = z.object({
  firstName: z.string().min(2, { message: "שדה חובה" }),
  lastName: z.string().min(2, { message: "שדה חובה" }),
  country: z.string().min(2, { message: "שדה חובה" }),
  city: z.string().min(2, { message: "שדה חובה" }),
  street: z.string().optional(),
  numberHouse: z.coerce.number().optional(),
  tz: z.string().min(2, { message: "שדה חובה" }),
  backGround: z.string().optional(),
  openness: z.string().optional(),
  burnDate: z.date(),
  healthCondition: z.boolean().default(true),
  status: z.string().optional(),
  height: z.coerce.number().optional(),
  phone: z.string().min(9, { message: "מספר טלפון לא תקין" }),
  email: z.string().email({ message: "כתובת אימייל לא תקינה" }),
  appearance: z.string().optional(),
  fatherPhone: z.string().optional(),
  motherPhone: z.string().optional(),
  class: z.string().optional(),
  expectationsFromPartner: z.string().optional(),
  club: z.string().optional(),
  ageFrom: z.coerce.number().optional(),
  ageTo: z.coerce.number().optional(),
  importantTraitsInMe: z.string().optional(),
  importantTraitsIAmLookingFor: z.string().optional(),
  smoker: z.boolean().default(false),
  beard: z.string().optional(),
  hat: z.string().optional(),
  suit: z.string().optional(),
  driversLicense: z.boolean().default(false),
  isLearning: z.string().optional(),
  yeshiva: z.string().optional(),
  preferredSeminarStyle: z.string().optional(),
  preferredProfessional: z.string().optional(),
  preferredHeadCovering: z.string().optional(),
  preferredAnOutsider: z.string().optional(),
  seminar: z.string().optional(),
  anOutsider: z.boolean().default(false),
  prefferedIsLearning: z.string().optional(),
  prefferedYeshivaStyle: z.string().optional(),
  professional: z.string().optional(),
  headCovering: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

// Types for verification result
interface VerificationResult {
  success: boolean;
  message: string;
  data?: {
    idNumber: string;
    birthDate: string;
    extractedFirstName?: string;
    extractedLastName?: string;
  };
  errors?: string[];
  extractedData?: {
    idNumber: string;
    birthDate: string;
    extractedFirstName?: string;
    extractedLastName?: string;
  };
  ocrSource?: string;
}

const CandidateForm: React.FC = observer(() => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [idVerified, setIdVerified] = useState(false)
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null)

  // בדיקה אם המשתמש בחר מגדר, אם לא - ניתוב לדף בחירת מגדר
  useEffect(() => {
    if (!candidateStore.selectedGender) {
      navigate("/candidate-gender")
      return
    }
    candidateStore.resetMessages()
    candidateStore.initializeEmptyCandidate()
  }, [navigate])

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue, // הוספנו את setValue למילוי אוטומטי של שדות
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: candidateStore.registerData?.firstName || "",
      lastName: candidateStore.registerData?.lastName || "",
      country: candidateStore.registerData?.country || "",
      city: candidateStore.registerData?.city || "",
      street: candidateStore.registerData?.street || "",
      phone: candidateStore.registerData?.phone || "",
      email: candidateStore.registerData?.email || "",
      appearance: candidateStore.registerData?.appearance || "",
      fatherPhone: candidateStore.registerData?.fatherPhone || "",
      motherPhone: candidateStore.registerData?.motherPhone || "",
      class: candidateStore.registerData?.class || "",
      expectationsFromPartner: candidateStore.registerData?.expectationsFromPartner || "",
      club: candidateStore.registerData?.club || "",
      ageFrom: candidateStore.registerData?.ageFrom || 18,
      ageTo: candidateStore.registerData?.ageTo || 30,
      importantTraitsInMe: candidateStore.registerData?.importantTraitsInMe || "",
      importantTraitsIAmLookingFor: candidateStore.registerData?.importantTraitsIAmLookingFor || "",
      smoker: candidateStore.registerData?.smoker || false,
      beard: candidateStore.registerData?.beard || "",
      hat: candidateStore.registerData?.hat || "",
      suit: candidateStore.registerData?.suit || "",
      driversLicense: candidateStore.registerData?.driversLicense || false,
      isLearning: candidateStore.registerData?.isLearning || "",
      yeshiva: candidateStore.registerData?.yeshiva || "",
      preferredSeminarStyle: candidateStore.registerData?.preferredSeminarStyle || "",
      preferredProfessional: candidateStore.registerData?.preferredProfessional || "",
      preferredHeadCovering: candidateStore.registerData?.preferredHeadCovering || "",
      preferredAnOutsider: candidateStore.registerData?.preferredAnOutsider || "",
      seminar: candidateStore.registerData?.seminar || "",
      anOutsider: candidateStore.registerData?.anOutsider || false,
      prefferedIsLearning: candidateStore.registerData?.prefferedIsLearning || "",
      prefferedYeshivaStyle: candidateStore.registerData?.prefferedYeshivaStyle || "",
      professional: candidateStore.registerData?.professional || "",
      headCovering: candidateStore.registerData?.headCovering || "",
    },
  })

  const handleInputChange = (field: string, value: any) => {
    // עדכן את candidateStore (אם עדיין משתמש בו)
    candidateStore.updateField(field, value)
    
    // שמור גם ב-localStorage
    try {
      const existingData = localStorage.getItem('candidateFormData');
      const currentData = existingData ? JSON.parse(existingData) : {};
      
      const updatedData = {
        ...currentData,
        [field]: value
      };
      
      localStorage.setItem('candidateFormData', JSON.stringify(updatedData));
      console.log(`💾 שמרתי ${field}:`, value);
    } catch (error) {
      console.error('שגיאה בשמירת נתונים:', error);
    }
  }

  const handleVerificationSuccess = (result: VerificationResult) => {
    setVerificationResult(result)
    setIdVerified(true)
    setUploadDialogOpen(false)

    // מילוי אוטומטי של השדות מהמידע שחולץ
    const extractedData = result.data || result.extractedData;
    if (extractedData) {
      // מילוי מספר ת.ז
      if (extractedData.idNumber) {
        setValue("tz", extractedData.idNumber);
        handleInputChange("tz", extractedData.idNumber);
      }

      // מילוי שם פרטי אם זמין
      if (extractedData.extractedFirstName) {
        setValue("firstName", extractedData.extractedFirstName);
        handleInputChange("firstName", extractedData.extractedFirstName);
      }

      // מילוי שם משפחה אם זמין
      if (extractedData.extractedLastName) {
        setValue("lastName", extractedData.extractedLastName);
        handleInputChange("lastName", extractedData.extractedLastName);
      }

      // הסרתי את המילוי האוטומטי של תאריך הלידה - המשתמש ימלא בעצמו
    }
  }

  const onSubmit = async (data: FormValues) => {
    if (!idVerified) {
      alert("יש להעלות ולאמת תעודת זהות לפני שליחת הטופס")
      return
    }
  
    setIsSubmitting(true)
    try {
      // שמור את כל נתוני הטופס ב-localStorage
      localStorage.setItem('candidateFormData', JSON.stringify(data));
      console.log('💾 כל נתוני הטופס נשמרו:', data);
  
      // עדכון כל הנתונים ב-store (אם עדיין משתמש בו)
      Object.entries(data).forEach(([key, value]) => {
        candidateStore.updateField(key, value)
      })
  
      // ניתוב לדף סיכום
      navigate("/candidate-summary")
    } catch (error) {
      console.error("שגיאה בשליחת הטופס:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
              <Box
                sx={{ bgcolor: "secondary.main", py: 3, px: 4, borderBottom: "1px solid", borderColor: "primary.main" }}
              >
                <Typography
                  variant="h4"
                  component="h1"
                  align="center"
                  sx={{ color: "primary.main", fontWeight: "bold" }}
                >
                  טופס הרשמה לשידוכים
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 4 }}>
                {/* אינדיקטור אימות ת.ז */}
                {idVerified && verificationResult && (
                  <Box sx={{ mb: 3 }}>
                    <Paper 
                      elevation={2} 
                      sx={{ 
                        p: 2, 
                        bgcolor: 'success.light', 
                        border: '1px solid', 
                        borderColor: 'success.main',
                        borderRadius: 2
                      }}
                    >
                      <Typography variant="h6" sx={{ color: 'success.dark', mb: 1 }}>
                        ✓ תעודת זהות אומתה בהצלחה
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'success.dark' }}>
                        הפרטים הבאים מולאו אוטומטי מתעודת הזהות:
                      </Typography>
                      <Box component="ul" sx={{ mt: 1, mb: 0, pl: 2, color: 'success.dark' }}>
                        {verificationResult.data?.idNumber && (
                          <li>מספר ת.ז: {verificationResult.data.idNumber}</li>
                        )}
                        {verificationResult.data?.extractedFirstName && (
                          <li>שם פרטי: {verificationResult.data.extractedFirstName}</li>
                        )}
                        {verificationResult.data?.extractedLastName && (
                          <li>שם משפחה: {verificationResult.data.extractedLastName}</li>
                        )}
                      </Box>
                    </Paper>
                  </Box>
                )}

                {/* פרטים אישיים */}
                <SectionTitle variant="h5">פרטים אישיים</SectionTitle>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="firstName"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="שם פרטי *"
                          fullWidth
                          variant="outlined"
                          error={!!errors.firstName}
                          helperText={errors.firstName?.message}
                          disabled={idVerified} // השדה נעול אחרי אימות
                          InputProps={{
                            sx: idVerified ? { backgroundColor: 'action.disabledBackground' } : {}
                          }}
                          onChange={(e) => {
                            if (!idVerified) { // רק אם לא אומת עדיין
                              field.onChange(e)
                              handleInputChange("firstName", e.target.value)
                            }
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="lastName"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="שם משפחה *"
                          fullWidth
                          variant="outlined"
                          error={!!errors.lastName}
                          helperText={errors.lastName?.message}
                          disabled={idVerified} // השדה נעול אחרי אימות
                          InputProps={{
                            sx: idVerified ? { backgroundColor: 'action.disabledBackground' } : {}
                          }}
                          onChange={(e) => {
                            if (!idVerified) { // רק אם לא אומת עדיין
                              field.onChange(e)
                              handleInputChange("lastName", e.target.value)
                            }
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="tz"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="תעודת זהות *"
                          fullWidth
                          variant="outlined"
                          error={!!errors.tz}
                          helperText={errors.tz?.message}
                          disabled={idVerified} // השדה נעול אחרי אימות
                          InputProps={{
                            sx: idVerified ? { backgroundColor: 'action.disabledBackground' } : {}
                          }}
                          onChange={(e) => {
                            if (!idVerified) { // רק אם לא אומת עדיין
                              field.onChange(e)
                              handleInputChange("tz", e.target.value)
                            }
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="burnDate"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          label="תאריך לידה *"
                          value={field.value}
                          onChange={(date) => {
                            field.onChange(date)
                            if (date) {
                              handleInputChange("burnDate", date.toISOString())
                            }
                          }}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              variant: "outlined",
                              error: !!errors.burnDate,
                              helperText: errors.burnDate?.message,
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel id="status-label">מצב משפחתי</InputLabel>
                          <Select
                            {...field}
                            labelId="status-label"
                            label="מצב משפחתי"
                            onChange={(e) => {
                              field.onChange(e)
                              handleInputChange("status", e.target.value)
                            }}
                          >
                            <MenuItem value="single">רווק/ה</MenuItem>
                            <MenuItem value="divorced">גרוש/ה</MenuItem>
                            <MenuItem value="widowed">אלמן/ה</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="height"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="גובה (בס״מ)"
                          type="number"
                          fullWidth
                          variant="outlined"
                          error={!!errors.height}
                          helperText={errors.height?.message}
                          onChange={(e) => {
                            field.onChange(e)
                            handleInputChange("height", Number(e.target.value))
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>

                {/* פרטי קשר */}
                <SectionTitle variant="h5">פרטי קשר</SectionTitle>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="טלפון *"
                          fullWidth
                          variant="outlined"
                          error={!!errors.phone}
                          helperText={errors.phone?.message}
                          inputProps={{ dir: "ltr" }}
                          onChange={(e) => {
                            field.onChange(e)
                            handleInputChange("phone", e.target.value)
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="אימייל *"
                          fullWidth
                          variant="outlined"
                          error={!!errors.email}
                          helperText={errors.email?.message}
                          inputProps={{ dir: "ltr" }}
                          onChange={(e) => {
                            field.onChange(e)
                            handleInputChange("email", e.target.value)
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="fatherPhone"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="טלפון אבא"
                          fullWidth
                          variant="outlined"
                          inputProps={{ dir: "ltr" }}
                          onChange={(e) => {
                            field.onChange(e)
                            handleInputChange("fatherPhone", e.target.value)
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="motherPhone"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="טלפון אמא"
                          fullWidth
                          variant="outlined"
                          inputProps={{ dir: "ltr" }}
                          onChange={(e) => {
                            field.onChange(e)
                            handleInputChange("motherPhone", e.target.value)
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>

                {/* כתובת */}
                <SectionTitle variant="h5">כתובת</SectionTitle>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="country"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="מדינה *"
                          fullWidth
                          variant="outlined"
                          error={!!errors.country}
                          helperText={errors.country?.message}
                          onChange={(e) => {
                            field.onChange(e)
                            handleInputChange("country", e.target.value)
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="city"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="עיר *"
                          fullWidth
                          variant="outlined"
                          error={!!errors.city}
                          helperText={errors.city?.message}
                          onChange={(e) => {
                            field.onChange(e)
                            handleInputChange("city", e.target.value)
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="street"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="רחוב"
                          fullWidth
                          variant="outlined"
                          onChange={(e) => {
                            field.onChange(e)
                            handleInputChange("street", e.target.value)
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="numberHouse"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="מספר בית"
                          type="number"
                          fullWidth
                          variant="outlined"
                          onChange={(e) => {
                            field.onChange(e)
                            handleInputChange("numberHouse", Number(e.target.value))
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>

                {/* רקע ומאפיינים */}
                <SectionTitle variant="h5">רקע ומאפיינים</SectionTitle>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="backGround"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="רקע"
                          fullWidth
                          variant="outlined"
                          multiline
                          rows={4}
                          onChange={(e) => {
                            field.onChange(e)
                            handleInputChange("backGround", e.target.value)
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="openness"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="פתיחות"
                          fullWidth
                          variant="outlined"
                          multiline
                          rows={4}
                          onChange={(e) => {
                            field.onChange(e)
                            handleInputChange("openness", e.target.value)
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="appearance"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="מראה חיצוני"
                          fullWidth
                          variant="outlined"
                          multiline
                          rows={4}
                          onChange={(e) => {
                            field.onChange(e)
                            handleInputChange("appearance", e.target.value)
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="healthCondition"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={field.value}
                              onChange={(e) => {
                                field.onChange(e.target.checked)
                                handleInputChange("healthCondition", e.target.checked)
                              }}
                            />
                          }
                          label="מצב בריאותי תקין"
                        />
                      )}
                    />
                  </Grid>
                </Grid>

                {/* פרטים נוספים */}
                <SectionTitle variant="h5">פרטים נוספים</SectionTitle>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="class"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="כיתה"
                          fullWidth
                          variant="outlined"
                          onChange={(e) => {
                            field.onChange(e)
                            handleInputChange("class", e.target.value)
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="club"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="מועדון"
                          fullWidth
                          variant="outlined"
                          onChange={(e) => {
                            field.onChange(e)
                            handleInputChange("club", e.target.value)
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="smoker"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={field.value}
                              onChange={(e) => {
                                field.onChange(e.target.checked)
                                handleInputChange("smoker", e.target.checked)
                              }}
                            />
                          }
                          label="מעשן/ת"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="driversLicense"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={field.value}
                              onChange={(e) => {
                                field.onChange(e.target.checked)
                                handleInputChange("driversLicense", e.target.checked)
                              }}
                            />
                          }
                          label="רישיון נהיגה"
                        />
                      )}
                    />
                  </Grid>
                </Grid>

                {/* פרטים לגברים - מוצג רק אם המגדר הוא זכר */}
                {candidateStore.selectedGender === Gender.MALE && (
                  <>
                    <SectionTitle variant="h5">פרטים לגברים</SectionTitle>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <Controller
                          name="beard"
                          control={control}
                          render={({ field }) => (
                            <FormControl fullWidth>
                              <InputLabel id="beard-label">זקן</InputLabel>
                              <Select
                                {...field}
                                labelId="beard-label"
                                label="זקן"
                                onChange={(e) => {
                                  field.onChange(e)
                                  handleInputChange("beard", e.target.value)
                                }}
                              >
                                <MenuItem value="full">מלא</MenuItem>
                                <MenuItem value="partial">חלקי</MenuItem>
                                <MenuItem value="none">ללא</MenuItem>
                              </Select>
                            </FormControl>
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Controller
                          name="hat"
                          control={control}
                          render={({ field }) => (
                            <FormControl fullWidth>
                              <InputLabel id="hat-label">כובע</InputLabel>
                              <Select
                                {...field}
                                labelId="hat-label"
                                label="כובע"
                                onChange={(e) => {
                                  field.onChange(e)
                                  handleInputChange("hat", e.target.value)
                                }}
                              >
                                <MenuItem value="black">שחור</MenuItem>
                                <MenuItem value="colored">צבעוני</MenuItem>
                                <MenuItem value="none">ללא</MenuItem>
                              </Select>
                            </FormControl>
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Controller
                          name="suit"
                          control={control}
                          render={({ field }) => (
                            <FormControl fullWidth>
                              <InputLabel id="suit-label">חליפה</InputLabel>
                              <Select
                                {...field}
                                labelId="suit-label"
                                label="חליפה"
                                onChange={(e) => {
                                  field.onChange(e)
                                  handleInputChange("suit", e.target.value)
                                }}
                              >
                                <MenuItem value="always">תמיד</MenuItem>
                                <MenuItem value="sometimes">לפעמים</MenuItem>
                                <MenuItem value="never">לעולם לא</MenuItem>
                              </Select>
                            </FormControl>
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Controller
                          name="isLearning"
                          control={control}
                          render={({ field }) => (
                            <FormControl fullWidth>
                              <InputLabel id="isLearning-label">לומד</InputLabel>
                              <Select
                                {...field}
                                labelId="isLearning-label"
                                label="לומד"
                                onChange={(e) => {
                                  field.onChange(e)
                                  handleInputChange("isLearning", e.target.value)
                                }}
                              >
                                <MenuItem value="fullTime">לימודים מלאים</MenuItem>
                                <MenuItem value="partTime">לימודים חלקיים</MenuItem>
                                <MenuItem value="none">לא לומד</MenuItem>
                              </Select>
                            </FormControl>
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Controller
                          name="yeshiva"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="ישיבה"
                              fullWidth
                              variant="outlined"
                              onChange={(e) => {
                                field.onChange(e)
                                handleInputChange("yeshiva", e.target.value)
                              }}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </>
                )}

                {/* פרטים לנשים - מוצג רק אם המגדר הוא נקבה */}
                {candidateStore.selectedGender === Gender.FEMALE && (
                  <>
                    <SectionTitle variant="h5">פרטים לנשים</SectionTitle>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <Controller
                          name="seminar"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="סמינר"
                              fullWidth
                              variant="outlined"
                              onChange={(e) => {
                                field.onChange(e)
                                handleInputChange("seminar", e.target.value)
                              }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Controller
                          name="professional"
                          control={control}
                          render={({ field }) => (
                            <FormControl fullWidth>
                              <InputLabel id="professional-label">תחום מקצועי</InputLabel>
                              <Select
                                {...field}
                                labelId="professional-label"
                                label="תחום מקצועי"
                                onChange={(e) => {
                                  field.onChange(e)
                                  handleInputChange("professional", e.target.value)
                                }}
                              >
                                <MenuItem value="education">חינוך</MenuItem>
                                <MenuItem value="tech">היי-טק</MenuItem>
                                <MenuItem value="office">משרדי</MenuItem>
                                <MenuItem value="therapy">טיפולי</MenuItem>
                                <MenuItem value="other">אחר</MenuItem>
                              </Select>
                            </FormControl>
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Controller
                          name="headCovering"
                          control={control}
                          render={({ field }) => (
                            <FormControl fullWidth>
                              <InputLabel id="headCovering-label">כיסוי ראש מועדף לאחר החתונה</InputLabel>
                              <Select
                                {...field}
                                labelId="headCovering-label"
                                label="כיסוי ראש מועדף לאחר החתונה"
                                onChange={(e) => {
                                  field.onChange(e)
                                  handleInputChange("headCovering", e.target.value)
                                }}
                              >
                                <MenuItem value="wig">פאה</MenuItem>
                                <MenuItem value="scarf">מטפחת</MenuItem>
                                <MenuItem value="hat">כובע</MenuItem>
                                <MenuItem value="combination">שילוב</MenuItem>
                              </Select>
                            </FormControl>
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Controller
                          name="anOutsider"
                          control={control}
                          render={({ field }) => (
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={field.value}
                                  onChange={(e) => {
                                    field.onChange(e.target.checked)
                                    handleInputChange("anOutsider", e.target.checked)
                                  }}
                                />
                              }
                              label="בעלת תשובה"
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </>
                )}

                {/* העדפות לבן/בת זוג */}
                <SectionTitle variant="h5">העדפות לבן/בת זוג</SectionTitle>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="ageFrom"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="גיל מינימלי"
                          type="number"
                          fullWidth
                          variant="outlined"
                          onChange={(e) => {
                            field.onChange(e)
                            handleInputChange("ageFrom", Number(e.target.value))
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="ageTo"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="גיל מקסימלי"
                          type="number"
                          fullWidth
                          variant="outlined"
                          onChange={(e) => {
                            field.onChange(e)
                            handleInputChange("ageTo", Number(e.target.value))
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="expectationsFromPartner"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="ציפיות מבן/בת הזוג"
                          fullWidth
                          variant="outlined"
                          multiline
                          rows={4}
                          onChange={(e) => {
                            field.onChange(e)
                            handleInputChange("expectationsFromPartner", e.target.value)
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="importantTraitsIAmLookingFor"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="תכונות חשובות שאני מחפש/ת"
                          fullWidth
                          variant="outlined"
                          multiline
                          rows={4}
                          onChange={(e) => {
                            field.onChange(e)
                            handleInputChange("importantTraitsIAmLookingFor", e.target.value)
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="importantTraitsInMe"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="תכונות חשובות בי"
                          fullWidth
                          variant="outlined"
                          multiline
                          rows={4}
                          onChange={(e) => {
                            field.onChange(e)
                            handleInputChange("importantTraitsInMe", e.target.value)
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>

                {/* העדפות ספציפיות */}
                <SectionTitle variant="h5">העדפות ספציפיות</SectionTitle>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="preferredSeminarStyle"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="סגנון סמינר מועדף"
                          fullWidth
                          variant="outlined"
                          onChange={(e) => {
                            field.onChange(e)
                            handleInputChange("preferredSeminarStyle", e.target.value)
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="preferredProfessional"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="תחום מקצועי מועדף"
                          fullWidth
                          variant="outlined"
                          onChange={(e) => {
                            field.onChange(e)
                            handleInputChange("preferredProfessional", e.target.value)
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="preferredHeadCovering"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="כיסוי ראש מועדף"
                          fullWidth
                          variant="outlined"
                          onChange={(e) => {
                            field.onChange(e)
                            handleInputChange("preferredHeadCovering", e.target.value)
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="preferredAnOutsider"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel id="preferredAnOutsider-label">העדפה לבעל/ת תשובה</InputLabel>
                          <Select
                            {...field}
                            labelId="preferredAnOutsider-label"
                            label="העדפה לבעל/ת תשובה"
                            onChange={(e) => {
                              field.onChange(e)
                              handleInputChange("preferredAnOutsider", e.target.value)
                            }}
                          >
                            <MenuItem value="yes">כן</MenuItem>
                            <MenuItem value="no">לא</MenuItem>
                            <MenuItem value="doesnt_matter">לא משנה</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="prefferedIsLearning"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel id="prefferedIsLearning-label">העדפה ללומד/ת</InputLabel>
                          <Select
                            {...field}
                            labelId="prefferedIsLearning-label"
                            label="העדפה ללומד/ת"
                            onChange={(e) => {
                              field.onChange(e)
                              handleInputChange("prefferedIsLearning", e.target.value)
                            }}
                          >
                            <MenuItem value="fullTime">לימודים מלאים</MenuItem>
                            <MenuItem value="partTime">לימודים חלקיים</MenuItem>
                            <MenuItem value="doesnt_matter">לא משנה</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="prefferedYeshivaStyle"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="סגנון ישיבה מועדף"
                          fullWidth
                          variant="outlined"
                          onChange={(e) => {
                            field.onChange(e)
                            handleInputChange("prefferedYeshivaStyle", e.target.value)
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting || !idVerified}
                    sx={{
                      width: "100%",
                      maxWidth: "400px",
                      py: 1.5,
                      bgcolor: idVerified ? "secondary.main" : "grey.400",
                      color: idVerified ? "primary.main" : "white",
                      border: "1px solid",
                      borderColor: idVerified ? "primary.main" : "grey.400",
                      "&:hover": {
                        bgcolor: idVerified ? "secondary.dark" : "grey.400",
                      },
                      fontSize: "1.1rem",
                    }}
                  >
                    {isSubmitting ? "מכין סיכום..." : idVerified ? "המשך לסיכום" : "יש לאמת ת.ז תחילה"}
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={() => setUploadDialogOpen(true)}
                    sx={{
                      width: "100%",
                      maxWidth: "400px",
                      py: 1.5,
                      borderColor: idVerified ? "success.main" : "secondary.main",
                      color: idVerified ? "success.main" : "secondary.main",
                      backgroundColor: idVerified ? "success.light" : "transparent",
                      "&:hover": {
                        bgcolor: idVerified ? "success.light" : "rgba(33, 33, 33, 0.05)",
                        borderColor: idVerified ? "success.main" : "secondary.main",
                      },
                      fontSize: "1.1rem",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Upload />
                    {idVerified ? "✓ ת.ז אומתה - לחץ לעדכון" : "העלאת ת.ז חובה!!"}
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Container>

          {/* דיאלוג ההעלאה */}
          <UploadDialog
            open={uploadDialogOpen}
            onClose={() => setUploadDialogOpen(false)}
            onVerificationSuccess={handleVerificationSuccess}
          />
        </LocalizationProvider>
      </ThemeProvider>
    </CacheProvider>
  )
})

export default CandidateForm