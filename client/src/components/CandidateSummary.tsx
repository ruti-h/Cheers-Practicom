// {/* <InfoRow>
//                     <Typography variant="body2" color="text.secondary">כיתה:</Typography>
//                     <Typography variant="body1" fontWeight="medium">{candidateData.class || "לא צוין"}</Typography>
//                   </InfoRow>
//                   <InfoRow>
//                     <Typography variant="body2" color="text.secondary">מועדון:</Typography>
//                     <Typography variant="body1" fontWeight="medium">{candidateData.club || "לא צוין"}</Typography>
//                   </InfoRow>
//                   <InfoRow>
//                     <Typography variant="body2" color="text.secondary">גובה:</Typography>
//                     <Typography variant="body1" fontWeight="medium">
//                       {candidateData.height ? `${candidateData.height} ס"מ` : "לא צוין"}
//                     </Typography>
//                   </InfoRow>"use client" */}

// import type React from "react"
// import { useEffect, useState } from "react"
// import { useNavigate } from "react-router-dom"
// import { useSelector, useDispatch } from "react-redux"
// import {
//   Box,
//   Typography,
//   Button,
//   Container,
//   Grid,
//   Paper,
//   ThemeProvider,
//   createTheme,
//   styled,
//   Chip,
//   Divider,
//   Card,
//   CardContent,
//   CardHeader,
//   Alert
// } from "@mui/material"
// import { Edit, CheckCircle, Person, ContactPhone, LocationOn, School, Favorite, Settings } from "@mui/icons-material"
// import { CacheProvider } from "@emotion/react"
// import createCache from "@emotion/cache"
// import rtlPlugin from "stylis-plugin-rtl"
// import { prefixer } from "stylis"
// import { setFormCompleted } from "./store/authSlice"
// import type { RootState, AppDispatch } from "./store/store"

// // RTL configuration
// const rtlCache = createCache({
//   key: "muirtl",
//   stylisPlugins: [prefixer, rtlPlugin],
// })

// // Custom theme
// const theme = createTheme(
//   {
//     direction: "rtl",
//     typography: {
//       fontFamily: "Arial, sans-serif",
//     },
//     palette: {
//       primary: {
//         main: "#D4AF37", // Gold color
//       },
//       secondary: {
//         main: "#212121", // Dark gray (almost black)
//       },
//       background: {
//         default: "#f5f5f5",
//         paper: "#ffffff",
//       },
//       text: {
//         primary: "#212121",
//         secondary: "#757575",
//       },
//     },
//   }
// )

// // Styled components
// const SectionCard = styled(Card)(({ theme }) => ({
//   marginBottom: theme.spacing(3),
//   borderRadius: 12,
//   boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
//   transition: "all 0.3s ease",
//   "&:hover": {
//     boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
//     transform: "translateY(-2px)"
//   }
// }))

// const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
//   backgroundColor: theme.palette.primary.main,
//   color: theme.palette.common.white,
//   "& .MuiCardHeader-title": {
//     fontWeight: "bold",
//     display: "flex",
//     alignItems: "center",
//     gap: theme.spacing(1)
//   }
// }))

// const InfoRow = styled(Box)(({ theme }) => ({
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
//   padding: theme.spacing(1, 0),
//   borderBottom: `1px solid ${theme.palette.divider}`,
//   "&:last-child": {
//     borderBottom: "none"
//   }
// }))

// const CandidateSummary: React.FC = () => {
//   const navigate = useNavigate()
//   const dispatch = useDispatch<AppDispatch>()
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   // Redux selectors
//   const { user } = useSelector((state: RootState) => state.auth)

//   // קבל נתונים מ-localStorage (זמנית עד שנעביר לRedux slice מלא)
//   const getCandidateDataFromStorage = () => {
//     try {
//       // נסה לקבל נתונים מהטופס שמולא
//       const formData = localStorage.getItem('candidateFormData');
//       const selectedGender = localStorage.getItem('selectedGender');
      
//       console.log('📋 נתוני טופס מ-localStorage:', formData);
//       console.log('👤 מגדר נבחר:', selectedGender);
      
//       if (formData) {
//         const parsedData = JSON.parse(formData);
//         return {
//           ...parsedData,
//           gender: selectedGender || parsedData.gender || 'male'
//         };
//       }
      
//       // אם אין נתונים, החזר נתונים בסיסיים
//       return {
//         firstName: user?.username || "לא צוין",
//         lastName: "לא צוין",
//         email: user?.email || "לא צוין",
//         phone: "לא צוין",
//         tz: "לא צוין",
//         city: "לא צוין",
//         street: "לא צוין",
//         country: "ישראל",
//         gender: selectedGender || 'male'
//       };
//     } catch (error) {
//       console.error('שגיאה בקריאת נתונים:', error);
//       return {
//         firstName: user?.username || "לא צוין",
//         lastName: "לא צוין", 
//         email: user?.email || "לא צוין",
//         gender: 'male'
//       };
//     }
//   };

//   const candidateData = getCandidateDataFromStorage();

//   useEffect(() => {
//     if (!user) {
//       navigate("/login")
//       return
//     }
//   }, [navigate, user])

//   const handleEdit = () => {
//     navigate("/candidate")
//   }

//   const handleFinalSubmit = async () => {
//     console.log('🚀 מתחיל שליחה סופית של טופס עם הנתונים:', candidateData);
//     setIsSubmitting(true)
    
//     try {
//       // הכן נתונים לשליחה לשרת
//       const dataToSend = {
//         firstName: candidateData.firstName || "",
//         lastName: candidateData.lastName || "",
//         email: candidateData.email || user?.email || "",
//         phone: candidateData.phone || "",
//         tz: candidateData.tz || "",
//         city: candidateData.city || "",
//         street: candidateData.street || "",
//         country: candidateData.country || "ישראל",
//         gender: candidateData.gender || "male",
//         // הוסף שדות נדרשים נוספים
//         burnDate: candidateData.burnDate || new Date().toISOString(),
//         numberHouse: candidateData.numberHouse || 1,
//         height: candidateData.height || 170,
//         healthCondition: candidateData.healthCondition ?? true,
//         status: candidateData.status || "single",
//         smoker: candidateData.smoker ?? false,
//         driversLicense: candidateData.driversLicense ?? false,
//         anOutsider: candidateData.anOutsider ?? false,
//         // שדות לגברים/נשים
//         ...(candidateData.gender === 'male' ? {
//           beard: candidateData.beard || "none",
//           hat: candidateData.hat || "none", 
//           suit: candidateData.suit || "sometimes",
//           isLearning: candidateData.isLearning || "partTime",
//           yeshiva: candidateData.yeshiva || ""
//         } : {
//           seminar: candidateData.seminar || "",
//           professional: candidateData.professional || "other",
//           headCovering: candidateData.headCovering || "scarf"
//         }),
//         // העדפות
//         ageFrom: candidateData.ageFrom || 18,
//         ageTo: candidateData.ageTo || 35,
//         prefferedIsLearning: candidateData.prefferedIsLearning || "doesnt_matter"
//       };

//       console.log('📡 שולח נתונים לשרת:', dataToSend);

//       const response = await fetch('https://localhost:7215/api/Candidate', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${user?.token}`
//         },
//         body: JSON.stringify(dataToSend)
//       });

//       if (!response.ok) {
//         const errorData = await response.text();
//         console.error('❌ שגיאת שרת:', response.status, errorData);
        
//         // הצג שגיאה מפורטת למשתמש
//         throw new Error(`שגיאה ${response.status}: ${errorData}`);
//       }

//       const result = await response.json();
//       console.log('✅ נתונים נשלחו בהצלחה:', result);
      
//       // עדכן את ה-Redux state שהטופס הושלם
//       dispatch(setFormCompleted(true));
      
//       // נקה את הנתונים הזמניים
//       localStorage.removeItem('candidateFormData');
//       localStorage.removeItem('selectedGender');
      
//       // נתב לאיזור אישי
//       navigate("/dashboard");
      
//     } catch (error: any) {
//       console.error("❌ שגיאה בשליחת הטופס:", error);
//       alert(`שגיאה בשליחת הטופס:\n${error.message}`);
//     } finally {
//       setIsSubmitting(false);
//     }
//   }

//   if (!user) {
//     return (
//       <CacheProvider value={rtlCache}>
//         <ThemeProvider theme={theme}>
//           <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
//             <Typography variant="h6">יש להתחבר כדי לצפות בסיכום</Typography>
//             <Button onClick={() => navigate("/login")} sx={{ mt: 2 }}>
//               התחבר
//             </Button>
//           </Container>
//         </ThemeProvider>
//       </CacheProvider>
//     )
//   }

//   const formatDate = (dateString: string) => {
//     if (!dateString) return "לא צוין"
//     try {
//       const date = new Date(dateString)
//       return date.toLocaleDateString('he-IL')
//     } catch {
//       return dateString
//     }
//   }

//   const getBooleanText = (value?: boolean) => value ? "כן" : "לא"

//   return (
//     <CacheProvider value={rtlCache}>
//       <ThemeProvider theme={theme}>
//         <Container maxWidth="lg" sx={{ py: 4 }}>
//           {/* כותרת ראשית */}
//           <Paper elevation={3} sx={{ mb: 4, borderRadius: 2, overflow: "hidden" }}>
//             <Box sx={{ bgcolor: "secondary.main", py: 3, px: 4, textAlign: "center" }}>
//               <Typography variant="h4" sx={{ color: "primary.main", fontWeight: "bold", mb: 1 }}>
//                 סיכום פרטי המועמד
//               </Typography>
//               <Typography variant="body1" sx={{ color: "primary.main", opacity: 0.8 }}>
//                 אנא בדק את הפרטים לפני השליחה הסופית
//               </Typography>
//             </Box>
//           </Paper>

//           {/* הודעת אימות ת.ז */}
//           <Alert severity="success" sx={{ mb: 3 }} icon={<CheckCircle />}>
//             <Typography variant="h6" sx={{ mb: 1 }}>
//               ✓ מוכן לשליחה
//             </Typography>
//             <Typography variant="body2">
//               כל הפרטים מוכנים לשליחה. ניתן לבצע שינויים או לשלוח את הטופס.
//             </Typography>
//           </Alert>

//           <Grid container spacing={3}>
//             {/* פרטים אישיים */}
//             <Grid item xs={12} md={6}>
//               <SectionCard>
//                 <StyledCardHeader
//                   title={
//                     <>
//                       <Person />
//                       פרטים אישיים
//                     </>
//                   }
//                 />
//                 <CardContent>
//                   <InfoRow>
//                     <Typography variant="body2" color="text.secondary">שם פרטי:</Typography>
//                     <Typography variant="body1" fontWeight="medium">{candidateData.firstName || "לא צוין"}</Typography>
//                   </InfoRow>
//                   <InfoRow>
//                     <Typography variant="body2" color="text.secondary">שם משפחה:</Typography>
//                     <Typography variant="body1" fontWeight="medium">{candidateData.lastName || "לא צוין"}</Typography>
//                   </InfoRow>
//                   <InfoRow>
//                     <Typography variant="body2" color="text.secondary">תעודת זהות:</Typography>
//                     <Typography variant="body1" fontWeight="medium" sx={{ fontFamily: "monospace" }}>
//                       {candidateData.tz || "לא צוין"}
//                     </Typography>
//                   </InfoRow>
//                   <InfoRow>
//                     <Typography variant="body2" color="text.secondary">תאריך לידה:</Typography>
//                     <Typography variant="body1" fontWeight="medium">{formatDate(candidateData.burnDate)}</Typography>
//                   </InfoRow>
//                   <InfoRow>
//                     <Typography variant="body2" color="text.secondary">מצב משפחתי:</Typography>
//                     <Chip 
//                       label={
//                         candidateData.status === "single" ? "רווק/ה" :
//                         candidateData.status === "divorced" ? "גרוש/ה" :
//                         candidateData.status === "widowed" ? "אלמן/ה" : "לא צוין"
//                       }
//                       size="small"
//                       color="primary"
//                       variant="outlined"
//                     />
//                   </InfoRow>
//                   <InfoRow>
//                     <Typography variant="body2" color="text.secondary">מגדר:</Typography>
//                     <Chip 
//                       label={candidateData.gender === 'male' ? 'זכר' : 'נקבה'}
//                       size="small"
//                       color="primary"
//                       variant="outlined"
//                     />
//                   </InfoRow>
//                   <InfoRow>
//                     <Typography variant="body2" color="text.secondary">מצב בריאותי תקין:</Typography>
//                     <Chip 
//                       label={getBooleanText(candidateData.healthCondition)} 
//                       size="small"
//                       color={candidateData.healthCondition ? "success" : "warning"}
//                     />
//                   </InfoRow>
//                 </CardContent>
//               </SectionCard>
//             </Grid>

//             {/* פרטים לגברים */}
//             {candidateData.gender === 'male' && (
//               <Grid item xs={12} md={6}>
//                 <SectionCard>
//                   <StyledCardHeader
//                     title={
//                       <>
//                         <School />
//                         פרטים לגברים
//                       </>
//                     }
//                   />
//                   <CardContent>
//                     <InfoRow>
//                       <Typography variant="body2" color="text.secondary">זקן:</Typography>
//                       <Chip 
//                         label={
//                           candidateData.beard === "full" ? "מלא" :
//                           candidateData.beard === "partial" ? "חלקי" :
//                           candidateData.beard === "none" ? "ללא" : "לא צוין"
//                         }
//                         size="small"
//                         color="primary"
//                         variant="outlined"
//                       />
//                     </InfoRow>
//                     <InfoRow>
//                       <Typography variant="body2" color="text.secondary">כובע:</Typography>
//                       <Chip 
//                         label={
//                           candidateData.hat === "black" ? "שחור" :
//                           candidateData.hat === "colored" ? "צבעוני" :
//                           candidateData.hat === "none" ? "ללא" : "לא צוין"
//                         }
//                         size="small"
//                         color="primary"
//                         variant="outlined"
//                       />
//                     </InfoRow>
//                     <InfoRow>
//                       <Typography variant="body2" color="text.secondary">חליפה:</Typography>
//                       <Chip 
//                         label={
//                           candidateData.suit === "always" ? "תמיד" :
//                           candidateData.suit === "sometimes" ? "לפעמים" :
//                           candidateData.suit === "never" ? "לעולם לא" : "לא צוין"
//                         }
//                         size="small"
//                         color="primary"
//                         variant="outlined"
//                       />
//                     </InfoRow>
//                     <InfoRow>
//                       <Typography variant="body2" color="text.secondary">לומד:</Typography>
//                       <Chip 
//                         label={
//                           candidateData.isLearning === "fullTime" ? "לימודים מלאים" :
//                           candidateData.isLearning === "partTime" ? "לימודים חלקיים" :
//                           candidateData.isLearning === "none" ? "לא לומד" : "לא צוין"
//                         }
//                         size="small"
//                         color="primary"
//                         variant="outlined"
//                       />
//                     </InfoRow>
//                     <InfoRow>
//                       <Typography variant="body2" color="text.secondary">ישיבה:</Typography>
//                       <Typography variant="body1" fontWeight="medium">{candidateData.yeshiva || "לא צוין"}</Typography>
//                     </InfoRow>
//                   </CardContent>
//                 </SectionCard>
//               </Grid>
//             )}

//             {/* פרטים לנשים */}
//             {candidateData.gender === 'female' && (
//               <Grid item xs={12} md={6}>
//                 <SectionCard>
//                   <StyledCardHeader
//                     title={
//                       <>
//                         <School />
//                         פרטים לנשים
//                       </>
//                     }
//                   />
//                   <CardContent>
//                     <InfoRow>
//                       <Typography variant="body2" color="text.secondary">סמינר:</Typography>
//                       <Typography variant="body1" fontWeight="medium">{candidateData.seminar || "לא צוין"}</Typography>
//                     </InfoRow>
//                     <InfoRow>
//                       <Typography variant="body2" color="text.secondary">תחום מקצועי:</Typography>
//                       <Chip 
//                         label={
//                           candidateData.professional === "education" ? "חינוך" :
//                           candidateData.professional === "tech" ? "היי-טק" :
//                           candidateData.professional === "office" ? "משרדי" :
//                           candidateData.professional === "therapy" ? "טיפולי" :
//                           candidateData.professional === "other" ? "אחר" : "לא צוין"
//                         }
//                         size="small"
//                         color="primary"
//                         variant="outlined"
//                       />
//                     </InfoRow>
//                     <InfoRow>
//                       <Typography variant="body2" color="text.secondary">כיסוי ראש מועדף:</Typography>
//                       <Chip 
//                         label={
//                           candidateData.headCovering === "wig" ? "פאה" :
//                           candidateData.headCovering === "scarf" ? "מטפחת" :
//                           candidateData.headCovering === "hat" ? "כובע" :
//                           candidateData.headCovering === "combination" ? "שילוב" : "לא צוין"
//                         }
//                         size="small"
//                         color="primary"
//                         variant="outlined"
//                       />
//                     </InfoRow>
//                     <InfoRow>
//                       <Typography variant="body2" color="text.secondary">בעלת תשובה:</Typography>
//                       <Chip 
//                         label={getBooleanText(candidateData.anOutsider)} 
//                         size="small"
//                         color={candidateData.anOutsider ? "secondary" : "default"}
//                       />
//                     </InfoRow>
//                   </CardContent>
//                 </SectionCard>
//               </Grid>
//             )}

//             {/* העדפות */}
//             <Grid item xs={12}>
//               <SectionCard>
//                 <StyledCardHeader
//                   title={
//                     <>
//                       <Favorite />
//                       העדפות לבן/בת זוג
//                     </>
//                   }
//                 />
//                 <CardContent>
//                   <Grid container spacing={2}>
//                     <Grid item xs={12} sm={6}>
//                       <InfoRow>
//                         <Typography variant="body2" color="text.secondary">טווח גילאים:</Typography>
//                         <Typography variant="body1" fontWeight="medium">
//                           {candidateData.ageFrom && candidateData.ageTo ? `${candidateData.ageFrom}-${candidateData.ageTo}` : "לא צוין"}
//                         </Typography>
//                       </InfoRow>
//                     </Grid>
//                     <Grid item xs={12} sm={6}>
//                       <InfoRow>
//                         <Typography variant="body2" color="text.secondary">העדפה ללומד/ת:</Typography>
//                         <Chip 
//                           label={
//                             candidateData.prefferedIsLearning === "fullTime" ? "לימודים מלאים" :
//                             candidateData.prefferedIsLearning === "partTime" ? "לימודים חלקיים" :
//                             candidateData.prefferedIsLearning === "doesnt_matter" ? "לא משנה" : "לא צוין"
//                           }
//                           size="small"
//                           color="primary"
//                           variant="outlined"
//                         />
//                       </InfoRow>
//                     </Grid>
//                     {candidateData.expectationsFromPartner && (
//                       <Grid item xs={12}>
//                         <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
//                           ציפיות מבן/בת הזוג:
//                         </Typography>
//                         <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
//                           <Typography variant="body2">{candidateData.expectationsFromPartner}</Typography>
//                         </Paper>
//                       </Grid>
//                     )}
//                     {candidateData.importantTraitsIAmLookingFor && (
//                       <Grid item xs={12}>
//                         <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
//                           תכונות חשובות שאני מחפש/ת:
//                         </Typography>
//                         <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
//                           <Typography variant="body2">{candidateData.importantTraitsIAmLookingFor}</Typography>
//                         </Paper>
//                       </Grid>
//                     )}
//                     {candidateData.importantTraitsInMe && (
//                       <Grid item xs={12}>
//                         <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
//                           תכונות חשובות בי:
//                         </Typography>
//                         <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
//                           <Typography variant="body2">{candidateData.importantTraitsInMe}</Typography>
//                         </Paper>
//                       </Grid>
//                     )}
//                   </Grid>
//                 </CardContent>
//               </SectionCard>
//             </Grid>

//             {/* פרטי קשר */}
//             <Grid item xs={12} md={6}>
//               <SectionCard>
//                 <StyledCardHeader
//                   title={
//                     <>
//                       <ContactPhone />
//                       פרטי קשר
//                     </>
//                   }
//                 />
//                 <CardContent>
//                   <InfoRow>
//                     <Typography variant="body2" color="text.secondary">טלפון:</Typography>
//                     <Typography variant="body1" fontWeight="medium" sx={{ fontFamily: "monospace" }}>
//                       {candidateData.phone || "לא צוין"}
//                     </Typography>
//                   </InfoRow>
//                   <InfoRow>
//                     <Typography variant="body2" color="text.secondary">אימייל:</Typography>
//                     <Typography variant="body1" fontWeight="medium">{candidateData.email || user?.email || "לא צוין"}</Typography>
//                   </InfoRow>
//                   <InfoRow>
//                     <Typography variant="body2" color="text.secondary">טלפון אבא:</Typography>
//                     <Typography variant="body1" fontWeight="medium" sx={{ fontFamily: "monospace" }}>
//                       {candidateData.fatherPhone || "לא צוין"}
//                     </Typography>
//                   </InfoRow>
//                   <InfoRow>
//                     <Typography variant="body2" color="text.secondary">טלפון אמא:</Typography>
//                     <Typography variant="body1" fontWeight="medium" sx={{ fontFamily: "monospace" }}>
//                       {candidateData.motherPhone || "לא צוין"}
//                     </Typography>
//                   </InfoRow>
//                 </CardContent>
//               </SectionCard>
//             </Grid>

//             {/* כתובת */}
//             <Grid item xs={12} md={6}>
//               <SectionCard>
//                 <StyledCardHeader
//                   title={
//                     <>
//                       <LocationOn />
//                       כתובת
//                     </>
//                   }
//                 />
//                 <CardContent>
//                   <InfoRow>
//                     <Typography variant="body2" color="text.secondary">מדינה:</Typography>
//                     <Typography variant="body1" fontWeight="medium">{candidateData.country || "ישראל"}</Typography>
//                   </InfoRow>
//                   <InfoRow>
//                     <Typography variant="body2" color="text.secondary">עיר:</Typography>
//                     <Typography variant="body1" fontWeight="medium">{candidateData.city || "לא צוין"}</Typography>
//                   </InfoRow>
//                   <InfoRow>
//                     <Typography variant="body2" color="text.secondary">רחוב:</Typography>
//                     <Typography variant="body1" fontWeight="medium">{candidateData.street || "לא צוין"}</Typography>
//                   </InfoRow>
//                 </CardContent>
//               </SectionCard>
//             </Grid>

//             {/* פרטים נוספים */}
//             <Grid item xs={12} md={6}>
//               <SectionCard>
//                 <StyledCardHeader
//                   title={
//                     <>
//                       <Settings />
//                       פרטים נוספים
//                     </>
//                   }
//                 />
//                 <CardContent>
//                   <InfoRow>
//                     <Typography variant="body2" color="text.secondary">מעשן/ת:</Typography>
//                     <Chip 
//                       label={getBooleanText(candidateData.smoker)} 
//                       size="small"
//                       color={candidateData.smoker ? "error" : "success"}
//                     />
//                   </InfoRow>
//                   <InfoRow>
//                     <Typography variant="body2" color="text.secondary">רישיון נהיגה:</Typography>
//                     <Chip 
//                       label={getBooleanText(candidateData.driversLicense)} 
//                       size="small"
//                       color={candidateData.driversLicense ? "success" : "default"}
//                     />
//                   </InfoRow>
//                 </CardContent>
//               </SectionCard>
//             </Grid>
//           </Grid>

//           {/* כפתורי פעולה */}
//           <Box sx={{ mt: 4, display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
//             <Button
//               variant="outlined"
//               size="large"
//               startIcon={<Edit />}
//               onClick={handleEdit}
//               sx={{
//                 minWidth: 200,
//                 py: 1.5,
//                 fontSize: "1.1rem",
//                 borderColor: "secondary.main",
//                 color: "secondary.main",
//                 "&:hover": {
//                   bgcolor: "rgba(33, 33, 33, 0.05)",
//                   borderColor: "secondary.main",
//                 },
//               }}
//             >
//               עריכת פרטים
//             </Button>
//             <Button
//               variant="contained"
//               size="large"
//               disabled={isSubmitting}
//               onClick={handleFinalSubmit}
//               sx={{
//                 minWidth: 200,
//                 py: 1.5,
//                 fontSize: "1.1rem",
//                 bgcolor: "primary.main",
//                 color: "secondary.main",
//                 "&:hover": {
//                   bgcolor: "primary.dark",
//                 },
//               }}
//             >
//               {isSubmitting ? "שולח..." : "שליחה סופית"}
//             </Button>
//           </Box>
//         </Container>
//       </ThemeProvider>
//     </CacheProvider>
//   )
// }

// export default CandidateSummary


"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
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
  Chip,
  CircularProgress,
  Alert
} from "@mui/material"
import { CacheProvider } from "@emotion/react"
import createCache from "@emotion/cache"
import rtlPlugin from "stylis-plugin-rtl"
import { prefixer } from "stylis"
import { styled } from "@mui/material/styles"
import { setFormCompleted } from "../store/authSlice"
import type { RootState, AppDispatch } from "../store/store"

// RTL cache
const rtlCache = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
})

// Theme
const theme = createTheme({
  direction: "rtl",
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Arial", sans-serif',
  },
})

// Styled Components
const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  padding: theme.spacing(2),
}))

const MainCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  maxWidth: 900,
  width: "100%",
  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(10px)",
}))

const SectionCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  height: "100%",
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  border: "1px solid rgba(0,0,0,0.05)",
}))

const InfoRow = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(1, 0),
  borderBottom: "1px solid rgba(0,0,0,0.05)",
  "&:last-child": {
    borderBottom: "none",
  },
}))

const StyledCardHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  paddingBottom: theme.spacing(1),
  borderBottom: "2px solid #667eea",
}))

interface CandidateData {
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
  // Male specific
  beard?: string;
  hat?: string;
  suit?: string;
  isLearning?: string;
  yeshiva?: string;
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
}

const CandidateSummary: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Redux selectors
  const { user } = useSelector((state: RootState) => state.auth)

  // קבל נתונים מ-localStorage
  const getCandidateDataFromStorage = (): CandidateData => {
    try {
      const formData = localStorage.getItem('candidateFormData');
      const selectedGender = localStorage.getItem('selectedGender');
      
      console.log('📋 נתוני טופס מ-localStorage:', formData);
      console.log('👤 מגדר נבחר:', selectedGender);

      let data: CandidateData = {};
      
      if (formData) {
        data = JSON.parse(formData);
      }
      
      if (selectedGender) {
        data.gender = selectedGender;
      }

      // הוסף email מהמשתמש המחובר
      if (user?.email) {
        data.email = user.email;
      }

      return data;
    } catch (error) {
      console.error('שגיאה בקריאת נתונים:', error);
      return {};
    }
  }

  const candidateData = getCandidateDataFromStorage();
const baseUrl= import.meta.env.VITE_API_URL;
  useEffect(() => {
    if (!user) {
      navigate("/login")
      return
    }
  }, [navigate, user])

  const formatDate = (dateString?: string) => {
    if (!dateString) return "לא צוין";
    try {
      return new Date(dateString).toLocaleDateString('he-IL');
    } catch {
      return dateString;
    }
  }

  const handleFinalSubmit = async () => {
    console.log('🚀 מתחיל שליחה סופית של טופס');
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // הכן נתונים לשליחה עם ערכי ברירת מחדל לשדות נדרשים
      const dataToSubmit = {
        firstName: candidateData.firstName || "",
        lastName: candidateData.lastName || "",
        email: candidateData.email || user?.email || "",
        tz: candidateData.tz || "",
        phone: candidateData.phone || "",
        fatherPhone: candidateData.fatherPhone || "",
        motherPhone: candidateData.motherPhone || "",
        country: candidateData.country || "ישראל",
        city: candidateData.city || "",
        street: candidateData.street || "",
        numberHouse: candidateData.numberHouse || 0,
        burnDate: candidateData.burnDate || new Date().toISOString(),
        height: candidateData.height || 170,
        status: candidateData.status || "רווק/ה",
        gender: candidateData.gender || "male",
        class: candidateData.class || "",
        club: candidateData.club || "",
        // Male specific fields
        beard: candidateData.beard || "",
        hat: candidateData.hat || "",
        suit: candidateData.suit || "",
        isLearning: candidateData.isLearning || "",
        yeshiva: candidateData.yeshiva || "",
        // Female specific fields
        seminar: candidateData.seminar || "",
        professional: candidateData.professional || "",
        headCovering: candidateData.headCovering || "",
        anOutsider: candidateData.anOutsider || false,
        // Preferences
        expectationsFromPartner: candidateData.expectationsFromPartner || "",
        importantTraitsInMe: candidateData.importantTraitsInMe || "",
        importantTraitsIAmLookingFor: candidateData.importantTraitsIAmLookingFor || "",
        ageFrom: candidateData.ageFrom || 18,
        ageTo: candidateData.ageTo || 30,
      };

      console.log('📤 שולח נתונים לשרת:', dataToSubmit);

      const response = await fetch(`${baseUrl}/Candidate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify(dataToSubmit)
      });

      if (response.ok) {
        console.log('✅ הטופס נשלח בהצלחה');
        
        // עדכן את ה-Redux state שהטופס הושלם
        dispatch(setFormCompleted(true));
        
        // שמור בlocalstorage שהטופס הושלם
        localStorage.setItem('formCompleted', 'true');
        
        // נתב לאיזור אישי
        navigate("/dashboard");
      } else {
        const errorData = await response.json();
        console.error('❌ שגיאה מהשרת:', errorData);
        setSubmitError(`שגיאה בשליחת הנתונים: ${errorData.title || 'שגיאה לא ידועה'}`);
      }
    } catch (error) {
      console.error("שגיאה בשליחת הטופס:", error);
      setSubmitError('שגיאה בתקשורת עם השרת');
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleEditDetails = () => {
    navigate("/candidate-edit");
  }

  // אם אין משתמש מחובר
  if (!user) {
    return (
      <CacheProvider value={rtlCache}>
        <ThemeProvider theme={theme}>
          <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
            <Typography variant="h6">יש להתחבר כדי לראות את הסיכום</Typography>
            <Button onClick={() => navigate("/login")}>התחבר</Button>
          </Container>
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
            {/* Header */}
            <Box textAlign="center" mb={4}>
              <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
                סיכום פרטי המועמד
              </Typography>
              <Typography variant="body1" color="text.secondary">
                בדוק את הפרטים שלך לפני השליחה הסופית
              </Typography>
            </Box>

            {/* Error Alert */}
            {submitError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {submitError}
              </Alert>
            )}

            <Grid container spacing={3}>
              {/* פרטים אישיים */}
              <Grid item xs={12} md={6}>
                <SectionCard>
                  <StyledCardHeader>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      פרטים אישיים
                    </Typography>
                  </StyledCardHeader>
                  
                  <InfoRow>
                    <Typography variant="body2" color="text.secondary">שם מלא:</Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {`${candidateData.firstName || ""} ${candidateData.lastName || ""}`.trim() || "לא צוין"}
                    </Typography>
                  </InfoRow>

                  <InfoRow>
                    <Typography variant="body2" color="text.secondary">תעודת זהות:</Typography>
                    <Typography variant="body1" fontWeight="medium">{candidateData.tz || "לא צוין"}</Typography>
                  </InfoRow>

                  <InfoRow>
                    <Typography variant="body2" color="text.secondary">תאריך לידה:</Typography>
                    <Typography variant="body1" fontWeight="medium">{formatDate(candidateData.burnDate)}</Typography>
                  </InfoRow>

                  <InfoRow>
                    <Typography variant="body2" color="text.secondary">מגדר:</Typography>
                    <Chip 
                      label={candidateData.gender === 'male' ? 'זכר' : 'נקבה'}
                      size="small"
                      color={candidateData.gender === 'male' ? 'primary' : 'secondary'}
                    />
                  </InfoRow>

                  <InfoRow>
                    <Typography variant="body2" color="text.secondary">מצב משפחתי:</Typography>
                    <Typography variant="body1" fontWeight="medium">{candidateData.status || "לא צוין"}</Typography>
                  </InfoRow>

                  <InfoRow>
                    <Typography variant="body2" color="text.secondary">גובה:</Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {candidateData.height ? `${candidateData.height} ס"מ` : "לא צוין"}
                    </Typography>
                  </InfoRow>
                </SectionCard>
              </Grid>

              {/* פרטי קשר */}
              <Grid item xs={12} md={6}>
                <SectionCard>
                  <StyledCardHeader>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      פרטי קשר
                    </Typography>
                  </StyledCardHeader>

                  <InfoRow>
                    <Typography variant="body2" color="text.secondary">אימייל:</Typography>
                    <Typography variant="body1" fontWeight="medium">{candidateData.email || user?.email || "לא צוין"}</Typography>
                  </InfoRow>

                  <InfoRow>
                    <Typography variant="body2" color="text.secondary">טלפון:</Typography>
                    <Typography variant="body1" fontWeight="medium">{candidateData.phone || "לא צוין"}</Typography>
                  </InfoRow>

                  <InfoRow>
                    <Typography variant="body2" color="text.secondary">טלפון האב:</Typography>
                    <Typography variant="body1" fontWeight="medium">{candidateData.fatherPhone || "לא צוין"}</Typography>
                  </InfoRow>

                  <InfoRow>
                    <Typography variant="body2" color="text.secondary">טלפון האם:</Typography>
                    <Typography variant="body1" fontWeight="medium">{candidateData.motherPhone || "לא צוין"}</Typography>
                  </InfoRow>

                  <InfoRow>
                    <Typography variant="body2" color="text.secondary">מדינה:</Typography>
                    <Typography variant="body1" fontWeight="medium">{candidateData.country || "לא צוין"}</Typography>
                  </InfoRow>

                  <InfoRow>
                    <Typography variant="body2" color="text.secondary">עיר:</Typography>
                    <Typography variant="body1" fontWeight="medium">{candidateData.city || "לא צוין"}</Typography>
                  </InfoRow>

                  <InfoRow>
                    <Typography variant="body2" color="text.secondary">רחוב:</Typography>
                    <Typography variant="body1" fontWeight="medium">{candidateData.street || "לא צוין"}</Typography>
                  </InfoRow>

                  <InfoRow>
                    <Typography variant="body2" color="text.secondary">מספר בית:</Typography>
                    <Typography variant="body1" fontWeight="medium">{candidateData.numberHouse || "לא צוין"}</Typography>
                  </InfoRow>
                </SectionCard>
              </Grid>

              {/* פרטים לגברים */}
              {candidateData.gender === 'male' && (
                <Grid item xs={12} md={6}>
                  <SectionCard>
                    <StyledCardHeader>
                      <Typography variant="h6" fontWeight="bold" color="primary">
                        פרטים נוספים
                      </Typography>
                    </StyledCardHeader>
                    
                    <InfoRow>
                      <Typography variant="body2" color="text.secondary">זקן:</Typography>
                      <Typography variant="body1" fontWeight="medium">{candidateData.beard || "לא צוין"}</Typography>
                    </InfoRow>

                    <InfoRow>
                      <Typography variant="body2" color="text.secondary">כובע:</Typography>
                      <Typography variant="body1" fontWeight="medium">{candidateData.hat || "לא צוין"}</Typography>
                    </InfoRow>

                    <InfoRow>
                      <Typography variant="body2" color="text.secondary">חליפה:</Typography>
                      <Typography variant="body1" fontWeight="medium">{candidateData.suit || "לא צוין"}</Typography>
                    </InfoRow>

                    <InfoRow>
                      <Typography variant="body2" color="text.secondary">לומד:</Typography>
                      <Typography variant="body1" fontWeight="medium">{candidateData.isLearning || "לא צוין"}</Typography>
                    </InfoRow>

                    <InfoRow>
                      <Typography variant="body2" color="text.secondary">ישיבה:</Typography>
                      <Typography variant="body1" fontWeight="medium">{candidateData.yeshiva || "לא צוין"}</Typography>
                    </InfoRow>

                    <InfoRow>
                      <Typography variant="body2" color="text.secondary">כיתה:</Typography>
                      <Typography variant="body1" fontWeight="medium">{candidateData.class || "לא צוין"}</Typography>
                    </InfoRow>

                    <InfoRow>
                      <Typography variant="body2" color="text.secondary">מועדון:</Typography>
                      <Typography variant="body1" fontWeight="medium">{candidateData.club || "לא צוין"}</Typography>
                    </InfoRow>
                  </SectionCard>
                </Grid>
              )}

              {/* פרטים לנשים */}
              {candidateData.gender === 'female' && (
                <Grid item xs={12} md={6}>
                  <SectionCard>
                    <StyledCardHeader>
                      <Typography variant="h6" fontWeight="bold" color="primary">
                        פרטים נוספים
                      </Typography>
                    </StyledCardHeader>
                    
                    <InfoRow>
                      <Typography variant="body2" color="text.secondary">סמינר:</Typography>
                      <Typography variant="body1" fontWeight="medium">{candidateData.seminar || "לא צוין"}</Typography>
                    </InfoRow>

                    <InfoRow>
                      <Typography variant="body2" color="text.secondary">מקצוע:</Typography>
                      <Typography variant="body1" fontWeight="medium">{candidateData.professional || "לא צוין"}</Typography>
                    </InfoRow>

                    <InfoRow>
                      <Typography variant="body2" color="text.secondary">כיסוי ראש:</Typography>
                      <Typography variant="body1" fontWeight="medium">{candidateData.headCovering || "לא צוין"}</Typography>
                    </InfoRow>

                    <InfoRow>
                      <Typography variant="body2" color="text.secondary">בעלת תשובה:</Typography>
                      <Chip 
                        label={candidateData.anOutsider ? 'כן' : 'לא'}
                        size="small"
                        color={candidateData.anOutsider ? 'success' : 'default'}
                      />
                    </InfoRow>

                    <InfoRow>
                      <Typography variant="body2" color="text.secondary">כיתה:</Typography>
                      <Typography variant="body1" fontWeight="medium">{candidateData.class || "לא צוין"}</Typography>
                    </InfoRow>

                    <InfoRow>
                      <Typography variant="body2" color="text.secondary">מועדון:</Typography>
                      <Typography variant="body1" fontWeight="medium">{candidateData.club || "לא צוין"}</Typography>
                    </InfoRow>
                  </SectionCard>
                </Grid>
              )}

              {/* העדפות לבן/בת זוג */}
              <Grid item xs={12}>
                <SectionCard>
                  <StyledCardHeader>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      העדפות לבן/בת זוג
                    </Typography>
                  </StyledCardHeader>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <InfoRow>
                        <Typography variant="body2" color="text.secondary">גיל מועדף:</Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {candidateData.ageFrom && candidateData.ageTo 
                            ? `${candidateData.ageFrom} - ${candidateData.ageTo}` 
                            : "לא צוין"
                          }
                        </Typography>
                      </InfoRow>
                    </Grid>
                  </Grid>

                  {candidateData.expectationsFromPartner && (
                    <Box mt={2}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        ציפיות מבן/בת הזוג:
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {candidateData.expectationsFromPartner}
                      </Typography>
                    </Box>
                  )}

                  {candidateData.importantTraitsInMe && (
                    <Box mt={2}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        תכונות חשובות בי:
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {candidateData.importantTraitsInMe}
                      </Typography>
                    </Box>
                  )}

                  {candidateData.importantTraitsIAmLookingFor && (
                    <Box mt={2}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        תכונות שאני מחפש/ת:
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {candidateData.importantTraitsIAmLookingFor}
                      </Typography>
                    </Box>
                  )}
                </SectionCard>
              </Grid>
            </Grid>

            {/* Action Buttons */}
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
                onClick={handleEditDetails}
                disabled={isSubmitting}
                sx={{ minWidth: 150 }}
              >
                עריכת פרטים
              </Button>
              
              <Button
                variant="contained"
                size="large"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                sx={{ minWidth: 150 }}
              >
                {isSubmitting ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    שולח...
                  </>
                ) : (
                  'שליחה סופית'
                )}
              </Button>
            </Box>
          </MainCard>
        </StyledContainer>
      </ThemeProvider>
    </CacheProvider>
  )
}

export default CandidateSummary