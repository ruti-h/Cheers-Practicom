// "use client"

// import React, { useState } from "react"
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Button,
//   Box,
//   Typography,
//   CircularProgress,
//   Alert,
//   IconButton,
//   Divider,
//   Paper,
//   Chip,
// } from "@mui/material"
// import {
//   Send as SendIcon,
//   Close as CloseIcon,
//   Email as EmailIcon,
//   Person as PersonIcon,
//   Visibility as VisibilityIcon,
// } from "@mui/icons-material"

// interface CandidateData {
//   id?: number
//   firstName?: string
//   lastName?: string
//   email?: string
//   tz?: string
//   phone?: string
//   fatherPhone?: string
//   motherPhone?: string
//   country?: string
//   city?: string
//   street?: string
//   numberHouse?: number
//   burnDate?: string
//   height?: number
//   status?: string
//   gender?: string
//   class?: string
//   club?: string
//   healthCondition?: boolean
//   // Male specific
//   beard?: string
//   hat?: string
//   suit?: string
//   isLearning?: string
//   yeshiva?: string
//   smoker?: boolean
//   driversLicense?: boolean
//   // Female specific
//   seminar?: string
//   professional?: string
//   headCovering?: string
//   anOutsider?: boolean
//   // Preferences
//   expectationsFromPartner?: string
//   importantTraitsInMe?: string
//   importantTraitsIAmLookingFor?: string
//   ageFrom?: number
//   ageTo?: number
//   backGround?: string
//   openness?: string
//   appearance?: string
//   // Preferences fields
//   preferredSeminarStyle?: string
//   preferredProfessional?: string
//   preferredHeadCovering?: string
//   preferredAnOutsider?: string
//   prefferedIsLearning?: string
//   prefferedYeshivaStyle?: string
// }

// interface EmailSenderProps {
//   open: boolean
//   onClose: () => void
//   candidateData: CandidateData | null
//   userToken?: string
//   onSuccess?: (message: string) => void
//   onError?: (message: string) => void
// }

// const EmailSender: React.FC<EmailSenderProps> = ({
//   open,
//   onClose,
//   candidateData,
//   userToken,
//   onSuccess,
//   onError
// }) => {
//   const [recipientEmail, setRecipientEmail] = useState("")
//   const [emailSubject, setEmailSubject] = useState("")
//   const [sendingEmail, setSendingEmail] = useState(false)
//   const [previewMode, setPreviewMode] = useState(false)
//   const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({})

//   // קבע ברירת מחדל לנושא כשהדיאלוג נפתח
//   React.useEffect(() => {
//     if (open && candidateData && !emailSubject) {
//       setEmailSubject(`פרטי מועמד לשידוכים - ${candidateData.firstName} ${candidateData.lastName}`)
//     }
//   }, [open, candidateData, emailSubject])

//   // ולידציה
//   const validateForm = () => {
//     const errors: {[key: string]: string} = {}
    
//     if (!recipientEmail) {
//       errors.recipientEmail = "יש למלא כתובת אימייל"
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail)) {
//       errors.recipientEmail = "כתובת אימייל לא תקינה"
//     }
    
//     if (!emailSubject) {
//       errors.emailSubject = "יש למלא נושא המייל"
//     }
    
//     setValidationErrors(errors)
//     return Object.keys(errors).length === 0
//   }

//   // פונקציה ליצירת HTML למייל
//   const generateEmailHTML = (data: CandidateData): string => {
//     const currentDate = new Date().toLocaleDateString('he-IL')
    
//     return `
//     <div style="font-family: Arial, sans-serif; direction: rtl; max-width: 800px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
//       <!-- Header מעוצב -->
//       <div style="background: linear-gradient(135deg, #D4AF37 0%, #212121 100%); padding: 30px; border-radius: 15px; text-align: center; color: white; margin-bottom: 30px;">
//         <h1 style="margin: 0; font-size: 32px; font-weight: bold;">🤝 פרופיל מועמד לשידוכים</h1>
//         <h2 style="margin: 10px 0 0 0; font-size: 24px; opacity: 0.9;">${data.firstName} ${data.lastName}</h2>
//         <div style="background: ${data.gender === 'male' ? '#2196F3' : '#E91E63'}; color: white; padding: 8px 20px; border-radius: 25px; display: inline-block; margin-top: 15px; font-weight: bold;">
//           ${data.gender === 'male' ? '👨 זכר' : '👩 נקבה'}
//         </div>
//       </div>

//       <!-- פרטים אישיים -->
//       <div style="background: white; padding: 25px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
//         <h3 style="color: #D4AF37; font-size: 20px; margin-bottom: 20px; border-bottom: 3px solid #D4AF37; padding-bottom: 10px;">👤 פרטים אישיים</h3>
//         <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px;">
//           <div><strong>🏷️ שם מלא:</strong> ${data.firstName} ${data.lastName}</div>
//           <div><strong>📧 אימייל:</strong> ${data.email || 'לא צוין'}</div>
//           <div><strong>📱 טלפון:</strong> ${data.phone || 'לא צוין'}</div>
//           <div><strong>🆔 תעודת זהות:</strong> ${data.tz || 'לא צוין'}</div>
//           <div><strong>🎂 גיל:</strong> ${data.burnDate ? new Date().getFullYear() - new Date(data.burnDate).getFullYear() : 'לא צוין'}</div>
//           <div><strong>📏 גובה:</strong> ${data.height || 'לא צוין'} ס"מ</div>
//           <div><strong>💍 מצב משפחתי:</strong> ${data.status || 'לא צוין'}</div>
//         </div>
//       </div>

//       <!-- כתובת -->
//       <div style="background: white; padding: 25px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
//         <h3 style="color: #D4AF37; font-size: 20px; margin-bottom: 20px; border-bottom: 3px solid #D4AF37; padding-bottom: 10px;">🏠 כתובת</h3>
//         <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
//           <div><strong>🌍 מדינה:</strong> ${data.country || 'לא צוין'}</div>
//           <div><strong>🏙️ עיר:</strong> ${data.city || 'לא צוין'}</div>
//           <div><strong>🏠 כתובת:</strong> ${data.street || 'לא צוין'} ${data.numberHouse || ''}</div>
//         </div>
//       </div>

//       ${(data.fatherPhone || data.motherPhone) ? `
//       <div style="background: white; padding: 25px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
//         <h3 style="color: #D4AF37; font-size: 20px; margin-bottom: 20px; border-bottom: 3px solid #D4AF37; padding-bottom: 10px;">👨‍👩‍👧‍👦 פרטי קשר משפחה</h3>
//         <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px;">
//           ${data.fatherPhone ? `<div><strong>👨 טלפון אבא:</strong> ${data.fatherPhone}</div>` : ''}
//           ${data.motherPhone ? `<div><strong>👩 טלפון אמא:</strong> ${data.motherPhone}</div>` : ''}
//         </div>
//       </div>
//       ` : ''}

//       ${data.gender === 'male' ? `
//       <div style="background: white; padding: 25px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
//         <h3 style="color: #D4AF37; font-size: 20px; margin-bottom: 20px; border-bottom: 3px solid #D4AF37; padding-bottom: 10px;">👨 פרטים ספציפיים לגברים</h3>
//         <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
//           ${data.beard ? `<div><strong>🧔 זקן:</strong> ${data.beard}</div>` : ''}
//           ${data.hat ? `<div><strong>🎩 כובע:</strong> ${data.hat}</div>` : ''}
//           ${data.suit ? `<div><strong>🤵 חליפה:</strong> ${data.suit}</div>` : ''}
//           ${data.isLearning ? `<div><strong>📚 לומד:</strong> ${data.isLearning}</div>` : ''}
//           ${data.yeshiva ? `<div><strong>🏛️ ישיבה:</strong> ${data.yeshiva}</div>` : ''}
//           <div><strong>🚬 מעשן:</strong> ${data.smoker ? 'כן' : 'לא'}</div>
//           <div><strong>🚗 רישיון נהיגה:</strong> ${data.driversLicense ? 'כן' : 'לא'}</div>
//         </div>
//       </div>
//       ` : ''}

//       ${data.gender === 'female' ? `
//       <div style="background: white; padding: 25px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
//         <h3 style="color: #D4AF37; font-size: 20px; margin-bottom: 20px; border-bottom: 3px solid #D4AF37; padding-bottom: 10px;">👩 פרטים ספציפיים לנשים</h3>
//         <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
//           ${data.seminar ? `<div><strong>🏫 סמינר:</strong> ${data.seminar}</div>` : ''}
//           ${data.professional ? `<div><strong>💼 תחום מקצועי:</strong> ${data.professional}</div>` : ''}
//           ${data.headCovering ? `<div><strong>👑 כיסוי ראש:</strong> ${data.headCovering}</div>` : ''}
//           <div><strong>🔄 בעלת תשובה:</strong> ${data.anOutsider ? 'כן' : 'לא'}</div>
//         </div>
//       </div>
//       ` : ''}

//       ${(data.backGround || data.openness || data.appearance) ? `
//       <div style="background: white; padding: 25px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
//         <h3 style="color: #D4AF37; font-size: 20px; margin-bottom: 20px; border-bottom: 3px solid #D4AF37; padding-bottom: 10px;">🎯 רקע ומאפיינים</h3>
//         ${data.backGround ? `
//         <div style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; border-right: 4px solid #D4AF37;">
//           <strong style="color: #D4AF37;">📖 רקע:</strong><br>
//           <span style="line-height: 1.6;">${data.backGround}</span>
//         </div>
//         ` : ''}
//         ${data.openness ? `
//         <div style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; border-right: 4px solid #D4AF37;">
//           <strong style="color: #D4AF37;">🌟 פתיחות:</strong><br>
//           <span style="line-height: 1.6;">${data.openness}</span>
//         </div>
//         ` : ''}
//         ${data.appearance ? `
//         <div style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; border-right: 4px solid #D4AF37;">
//           <strong style="color: #D4AF37;">👀 מראה חיצוני:</strong><br>
//           <span style="line-height: 1.6;">${data.appearance}</span>
//         </div>
//         ` : ''}
//       </div>
//       ` : ''}

//       <!-- העדפות לבן/בת זוג -->
//       <div style="background: white; padding: 25px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
//         <h3 style="color: #D4AF37; font-size: 20px; margin-bottom: 20px; border-bottom: 3px solid #D4AF37; padding-bottom: 10px;">💕 העדפות לבן/בת זוג</h3>
//         <div style="margin-bottom: 15px;"><strong>🎂 טווח גילאים:</strong> ${data.ageFrom || 18} - ${data.ageTo || 30}</div>
//         ${data.expectationsFromPartner ? `
//         <div style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; border-right: 4px solid #D4AF37;">
//           <strong style="color: #D4AF37;">🎯 ציפיות מבן/בת הזוג:</strong><br>
//           <span style="line-height: 1.6;">${data.expectationsFromPartner}</span>
//         </div>
//         ` : ''}
//         ${data.importantTraitsIAmLookingFor ? `
//         <div style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; border-right: 4px solid #D4AF37;">
//           <strong style="color: #D4AF37;">🔍 תכונות חשובות שאני מחפש/ת:</strong><br>
//           <span style="line-height: 1.6;">${data.importantTraitsIAmLookingFor}</span>
//         </div>
//         ` : ''}
//         ${data.importantTraitsInMe ? `
//         <div style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; border-right: 4px solid #D4AF37;">
//           <strong style="color: #D4AF37;">⭐ תכונות חשובות בי:</strong><br>
//           <span style="line-height: 1.6;">${data.importantTraitsInMe}</span>
//         </div>
//         ` : ''}
//       </div>

//       ${(data.class || data.club) ? `
//       <div style="background: white; padding: 25px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
//         <h3 style="color: #D4AF37; font-size: 20px; margin-bottom: 20px; border-bottom: 3px solid #D4AF37; padding-bottom: 10px;">📚 פרטים נוספים</h3>
//         <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
//           ${data.class ? `<div><strong>🎓 כיתה:</strong> ${data.class}</div>` : ''}
//           ${data.club ? `<div><strong>🏆 מועדון:</strong> ${data.club}</div>` : ''}
//           <div><strong>🏥 מצב בריאותי:</strong> ${data.healthCondition ? 'תקין' : 'לא תקין'}</div>
//         </div>
//       </div>
//       ` : ''}

//       <!-- Footer -->
//       <div style="text-align: center; margin-top: 40px; padding: 20px; background: linear-gradient(135deg, #D4AF37 0%, #212121 100%); border-radius: 12px; color: white;">
//         <p style="margin: 0; font-size: 16px;">📅 דוח זה נוצר ב-${currentDate}</p>
//         <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">💝 מערכת שידוכים מתקדמת</p>
//       </div>
//     </div>
//     `
//   }

//   // פונקציה לשליחת המייל
//   const handleSendEmail = async () => {
//     if (!validateForm() || !candidateData) return

//     setSendingEmail(true)
    
//     try {
//       const emailHtmlContent = generateEmailHTML(candidateData)
      
//       const emailRequest = {
//         to: recipientEmail,
//         subject: emailSubject,
//         body: emailHtmlContent,
//         senderName: `${candidateData.firstName} ${candidateData.lastName}`,
//         imageUrl: "https://via.placeholder.com/150x150/D4AF37/FFFFFF?text=👤"
//       }

//       const response = await fetch('https://localhost:7215/api/Mail/send-email', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           ...(userToken && { 'Authorization': `Bearer ${userToken}` })
//         },
//         body: JSON.stringify(emailRequest)
//       })

//       if (response.ok) {
//         onSuccess?.("המייל נשלח בהצלחה! 📧")
//         handleClose()
//       } else {
//         const errorData = await response.text()
//         throw new Error(`שגיאה בשליחת המייל: ${errorData}`)
//       }
//     } catch (error) {
//       console.error('❌ שגיאה בשליחת המייל:', error)
//       onError?.("שגיאה בשליחת המייל. אנא נסה שוב.")
//     } finally {
//       setSendingEmail(false)
//     }
//   }

//   const handleClose = () => {
//     setRecipientEmail("")
//     setEmailSubject("")
//     setValidationErrors({})
//     setPreviewMode(false)
//     onClose()
//   }

//   const togglePreview = () => {
//     setPreviewMode(!previewMode)
//   }

//   if (!candidateData) return null

//   return (
//     <Dialog 
//       open={open} 
//       onClose={handleClose}
//       maxWidth="md" 
//       fullWidth
//       sx={{
//         '& .MuiDialog-paper': {
//           borderRadius: 2,
//           direction: 'rtl'
//         }
//       }}
//     >
//       <DialogTitle sx={{ 
//         bgcolor: 'primary.main', 
//         color: 'white', 
//         display: 'flex', 
//         alignItems: 'center', 
//         justifyContent: 'space-between',
//         p: 3
//       }}>
//         <Box display="flex" alignItems="center" gap={2}>
//           <EmailIcon />
//           <Typography variant="h6" fontWeight="bold">
//             שליחת פרטי מועמד במייל
//           </Typography>
//         </Box>
//         <IconButton onClick={handleClose} sx={{ color: 'white' }}>
//           <CloseIcon />
//         </IconButton>
//       </DialogTitle>

//       <DialogContent sx={{ p: 3 }}>
//         {/* פרטי המועמד */}
//         <Paper sx={{ p: 2, mb: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
//           <Box display="flex" alignItems="center" gap={2} mb={2}>
//             <PersonIcon color="primary" />
//             <Typography variant="h6" color="primary" fontWeight="bold">
//               פרטי מועמד לשליחה
//             </Typography>
//           </Box>
//           <Box display="flex" alignItems="center" gap={2}>
//             <Typography variant="body1">
//               <strong>{candidateData.firstName} {candidateData.lastName}</strong>
//             </Typography>
//             <Chip 
//               label={candidateData.gender === 'male' ? 'זכר' : 'נקבה'}
//               color={candidateData.gender === 'male' ? 'primary' : 'secondary'}
//               size="small"
//             />
//           </Box>
//           <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
//             {candidateData.email} • {candidateData.phone}
//           </Typography>
//         </Paper>

//         {!previewMode ? (
//           <>
//             {/* שדות המייל */}
//             <Box display="flex" flexDirection="column" gap={3}>
//               <TextField
//                 label="כתובת אימייל של הנמען *"
//                 value={recipientEmail}
//                 onChange={(e) => setRecipientEmail(e.target.value)}
//                 fullWidth
//                 variant="outlined"
//                 error={!!validationErrors.recipientEmail}
//                 helperText={validationErrors.recipientEmail}
//                 placeholder="דוגמה: shadchan@example.com"
//                 InputLabelProps={{ shrink: true }}
//               />

//               <TextField
//                 label="נושא המייל *"
//                 value={emailSubject}
//                 onChange={(e) => setEmailSubject(e.target.value)}
//                 fullWidth
//                 variant="outlined"
//                 error={!!validationErrors.emailSubject}
//                 helperText={validationErrors.emailSubject}
//                 InputLabelProps={{ shrink: true }}
//               />

//               <Alert severity="info" sx={{ mt: 2 }}>
//                 <Typography variant="body2">
//                   <strong>💡 מה ישלח במייל:</strong><br/>
//                   המייל יכלול את כל פרטי המועמד בעיצוב מקצועי ומעוצב עם אייקונים וצבעים.
//                   הנתונים יוצגו בצורה ברורה ונוחה לקריאה.
//                 </Typography>
//               </Alert>
//             </Box>
//           </>
//         ) : (
//           /* תצוגה מקדימה */
//           <Box>
//             <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
//               תצוגה מקדימה של המייל
//             </Typography>
//             <Paper 
//               sx={{ 
//                 p: 2, 
//                 maxHeight: 400, 
//                 overflow: 'auto',
//                 border: '1px solid',
//                 borderColor: 'divider'
//               }}
//             >
//               <div 
//                 dangerouslySetInnerHTML={{ 
//                   __html: generateEmailHTML(candidateData) 
//                 }}
//                 style={{ fontSize: '12px' }}
//               />
//             </Paper>
//           </Box>
//         )}
//       </DialogContent>

//       <Divider />

//       <DialogActions sx={{ p: 3, gap: 1 }}>
//         <Button
//           variant="outlined"
//           onClick={togglePreview}
//           startIcon={<VisibilityIcon />}
//           disabled={sendingEmail}
//         >
//           {previewMode ? 'חזור לעריכה' : 'תצוגה מקדימה'}
//         </Button>

//         <Button
//           variant="outlined"
//           onClick={handleClose}
//           disabled={sendingEmail}
//         >
//           ביטול
//         </Button>

//         <Button
//           variant="contained"
//           onClick={handleSendEmail}
//           disabled={sendingEmail || previewMode}
//           startIcon={sendingEmail ? <CircularProgress size={20} /> : <SendIcon />}
//           sx={{ minWidth: 140 }}
//         >
//           {sendingEmail ? 'שולח...' : 'שלח מייל'}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   )
// }

// export default EmailSender







import React, { useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  Divider,
  Paper,
  Chip,
} from "@mui/material"
import {
  Send as SendIcon,
  Close as CloseIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Visibility as VisibilityIcon,
  AttachFile as AttachFileIcon,
} from "@mui/icons-material"

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
  preferredSeminarStyle?:string
  preferredProfessional?:string 
  preferredHeadCovering?:string
  preferredAnOutsider ?:string
  prefferedIsLearning ?:string
  prefferedYeshivaStyle?:string
}

interface EmailSenderProps {
  open: boolean
  onClose: () => void
  candidateData: CandidateData | null
  userToken?: string
  onSuccess?: (message: string) => void
  onError?: (message: string) => void
}

const EmailSender: React.FC<EmailSenderProps> = ({
  open,
  onClose,
  candidateData,
  userToken,
  onSuccess,
  onError
}) => {
  const [recipientEmail, setRecipientEmail] = useState("")
  const [emailSubject, setEmailSubject] = useState("")
  const [emailBody, setEmailBody] = useState("")
  const [sendingEmail, setSendingEmail] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({})

  // קבע ברירת מחדל לנושא וגוף המייל כשהדיאלוג נפתח
  React.useEffect(() => {
    if (open && candidateData) {
      if (!emailSubject) {
        setEmailSubject(`פרטי מועמד לשידוכים - ${candidateData.firstName} ${candidateData.lastName}`)
      }
      if (!emailBody) {
        setEmailBody(`שלום רב,

מצורף פרופיל מפורט של מועמד/ת לשידוכים:
${candidateData.firstName} ${candidateData.lastName}

הפרטים המלאים מצורפים בקובץ PDF.

בברכה,
מערכת השידוכים`)
      }
    }
  }, [open, candidateData, emailSubject, emailBody])

  // ולידציה
  const validateForm = () => {
    const errors: {[key: string]: string} = {}
    
    if (!recipientEmail) {
      errors.recipientEmail = "יש למלא כתובת אימייל"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail)) {
      errors.recipientEmail = "כתובת אימייל לא תקינה"
    }
    
    if (!emailSubject) {
      errors.emailSubject = "יש למלא נושא המייל"
    }

    if (!emailBody) {
      errors.emailBody = "יש למלא תוכן המייל"
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // פונקציה ליצירת HTML לתצוגה מקדימה
  const generatePreviewHTML = (data: CandidateData): string => {
    const currentDate = new Date().toLocaleDateString('he-IL')
    
    return `
    <div style="font-family: Arial, sans-serif; direction: rtl; max-width: 800px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
      <!-- Header מעוצב -->
      <div style="background: linear-gradient(135deg, #D4AF37 0%, #212121 100%); padding: 30px; border-radius: 15px; text-align: center; color: white; margin-bottom: 30px;">
        <h1 style="margin: 0; font-size: 32px; font-weight: bold;">🤝 פרופיל מועמד לשידוכים</h1>
        <h2 style="margin: 10px 0 0 0; font-size: 24px; opacity: 0.9;">${data.firstName} ${data.lastName}</h2>
        <div style="background: ${data.gender === 'male' ? '#2196F3' : '#E91E63'}; color: white; padding: 8px 20px; border-radius: 25px; display: inline-block; margin-top: 15px; font-weight: bold;">
          ${data.gender === 'male' ? '👨 זכר' : '👩 נקבה'}
        </div>
      </div>

      <!-- פרטים אישיים -->
      <div style="background: white; padding: 25px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
        <h3 style="color: #D4AF37; font-size: 20px; margin-bottom: 20px; border-bottom: 3px solid #D4AF37; padding-bottom: 10px;">👤 פרטים אישיים</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px;">
          <div><strong>🏷️ שם מלא:</strong> ${data.firstName} ${data.lastName}</div>
          <div><strong>📧 אימייל:</strong> ${data.email || 'לא צוין'}</div>
          <div><strong>📱 טלפון:</strong> ${data.phone || 'לא צוין'}</div>
          <div><strong>🆔 תעודת זהות:</strong> ${data.tz || 'לא צוין'}</div>
          <div><strong>🎂 גיל:</strong> ${data.burnDate ? new Date().getFullYear() - new Date(data.burnDate).getFullYear() : 'לא צוין'}</div>
          <div><strong>📏 גובה:</strong> ${data.height || 'לא צוין'} ס"מ</div>
          <div><strong>💍 מצב משפחתי:</strong> ${data.status || 'לא צוין'}</div>
        </div>
      </div>

      <!-- Footer -->
      <div style="text-align: center; margin-top: 40px; padding: 20px; background: linear-gradient(135deg, #D4AF37 0%, #212121 100%); border-radius: 12px; color: white;">
        <p style="margin: 0; font-size: 16px;">📅 דוח זה נוצר ב-${currentDate}</p>
        <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">💝 מערכת שידוכים מתקדמת</p>
      </div>
    </div>
    `
  }

  // פונקציה לשליחת המייל
//   const handleSendEmail = async () => {
//     if (!validateForm() || !candidateData) return

//     setSendingEmail(true)
    
//     try {
//       const emailRequest = {
//         to: recipientEmail,
//         subject: emailSubject,
//         body: emailBody,
//         senderName: `${candidateData.firstName} ${candidateData.lastName}`,
//         candidateData: {
//           // המרת שמות השדות לפורמט של C#
//           id: candidateData.id,
//           firstName: candidateData.firstName,
//           lastName: candidateData.lastName,
//           email: candidateData.email,
//           tz: candidateData.tz,
//           phone: candidateData.phone,
//           fatherPhone: candidateData.fatherPhone,
//           motherPhone: candidateData.motherPhone,
//           country: candidateData.country,
//           city: candidateData.city,
//           street: candidateData.street,
//           numberHouse: candidateData.numberHouse,
//           burnDate: candidateData.burnDate,
//           height: candidateData.height,
//           status: candidateData.status,
//           gender: candidateData.gender,
//           class: candidateData.class,
//           club: candidateData.club,
//           healthCondition: candidateData.healthCondition,
//           // Male specific
//           beard: candidateData.beard,
//           hat: candidateData.hat,
//           suit: candidateData.suit,
//           isLearning: candidateData.isLearning,
//           yeshiva: candidateData.yeshiva,
//           smoker: candidateData.smoker,
//           driversLicense: candidateData.driversLicense,
//           // Female specific
//           seminar: candidateData.seminar,
//           professional: candidateData.professional,
//           headCovering: candidateData.headCovering,
//           anOutsider: candidateData.anOutsider,
//           // Preferences
//           expectationsFromPartner: candidateData.expectationsFromPartner,
//           importantTraitsInMe: candidateData.importantTraitsInMe,
//           importantTraitsIAmLookingFor: candidateData.importantTraitsIAmLookingFor,
//           ageFrom: candidateData.ageFrom,
//           ageTo: candidateData.ageTo,
//           backGround: candidateData.backGround,
//           openness: candidateData.openness,
//           appearance: candidateData.appearance
//         }
//       }

//       const response = await fetch('https://localhost:7215/api/Email/send-email', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           ...(userToken && { 'Authorization': `Bearer ${userToken}` })
//         },
//         body: JSON.stringify(emailRequest)
//       })

//       if (response.ok) {
//         onSuccess?.("המייל נשלח בהצלחה עם קובץ PDF מצורף! 📧📎")
//         handleClose()
//       } else {
//         const errorData = await response.text()
//         throw new Error(`שגיאה בשליחת המייל: ${errorData}`)
//       }
//     } catch (error) {
//       console.error('❌ שגיאה בשליחת המייל:', error)
//       onError?.("שגיאה בשליחת המייל. אנא נסה שוב.")
//     } finally {
//       setSendingEmail(false)
//     }
//   }


// פונקציה לשליחת המייל עם debugging מתקדם
const handleSendEmail = async () => {
    if (!validateForm() || !candidateData) return
  
    setSendingEmail(true)
    
    try {
      // 🔍 הדפסת נתוני המועמד לפני השליחה
  
      
      // בדיקת קידוד UTF-8
      // const testString = candidateData.firstName || '';
      // console.log('🔤 בדיקת קידוד UTF-8:', {
      //   original: testString,
      //   length: testString.length,
      //   charCodes: Array.from(testString).map(char => char.charCodeAt(0)),
      //   encoded: encodeURIComponent(testString),
      //   isHebrew: /[\u0590-\u05FF]/.test(testString)
      // });
  
      const emailRequest = {
        to: recipientEmail,
        subject: emailSubject,
        body: emailBody,
        senderName: `${candidateData.firstName} ${candidateData.lastName}`,
        candidateData: {
          // המרת שמות השדות לפורמט של C#
          id: candidateData.id,
          firstName: candidateData.firstName,
          lastName: candidateData.lastName,
          email: candidateData.email,
          tz: candidateData.tz,
          phone: candidateData.phone,
          fatherPhone: candidateData.fatherPhone,
          motherPhone: candidateData.motherPhone,
          country: candidateData.country,
          city: candidateData.city,
          street: candidateData.street,
          numberHouse: candidateData.numberHouse,
          burnDate: candidateData.burnDate,
          height: candidateData.height,
          status: candidateData.status,
          gender: candidateData.gender,
          class: candidateData.class,
          club: candidateData.club,
          healthCondition: candidateData.healthCondition,
          // Male specific
          beard: candidateData.beard,
          hat: candidateData.hat,
          suit: candidateData.suit,
          isLearning: candidateData.isLearning,
          yeshiva: candidateData.yeshiva,
          smoker: candidateData.smoker,
          driversLicense: candidateData.driversLicense,
          // Female specific
          seminar: candidateData.seminar,
          professional: candidateData.professional,
          headCovering: candidateData.headCovering,
          anOutsider: candidateData.anOutsider,
          // Preferences
          expectationsFromPartner: candidateData.expectationsFromPartner,
          importantTraitsInMe: candidateData.importantTraitsInMe,
          importantTraitsIAmLookingFor: candidateData.importantTraitsIAmLookingFor,
          ageFrom: candidateData.ageFrom,
          ageTo: candidateData.ageTo,
          backGround: candidateData.backGround,
          openness: candidateData.openness,
          appearance: candidateData.appearance,
          preferredSeminarStyle: candidateData.preferredSeminarStyle,
          preferredProfessional: candidateData.preferredProfessional, 
          preferredHeadCovering: candidateData.preferredHeadCovering,
          preferredAnOutsider: candidateData.preferredAnOutsider,
          prefferedIsLearning: candidateData.prefferedIsLearning,
          prefferedYeshivaStyle: candidateData.prefferedYeshivaStyle,
        }
      }
  
      // 🔍 הדפסת הבקשה שנשלחת
   const baseUrl  = import.meta.env.VITE_API_URL;
  
      // שליחה עם הגדרות קידוד מפורשות
      const response = await fetch(`${baseUrl}/Email/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Accept': 'application/json',
          'Accept-Charset': 'utf-8',
          ...(userToken && { 'Authorization': `Bearer ${userToken}` })
        },
        body: JSON.stringify(emailRequest)
      })
  
      console.log('📡 תשובת שרת (status):', response.status);
      console.log('📡 תשובת שרת (headers):', Object.fromEntries(response.headers.entries()));
  
      if (response.ok) {
        const responseText = await response.text();
        console.log('✅ תשובת שרת מוצלחת:', responseText);
        onSuccess?.("המייל נשלח בהצלחה עם קובץ PDF מצורף! 📧📎")
        handleClose()
      } else {
        const errorData = await response.text()
        console.error('❌ שגיאה מהשרת:', errorData);
        throw new Error(`שגיאה בשליחת המייל: ${errorData}`)
      }
    } catch (error) {
      console.error('❌ שגיאה בשליחת המייל:', error)
      onError?.("שגיאה בשליחת המייל. אנא נסה שוב.")
    } finally {
      setSendingEmail(false)
    }
  }

  const handleClose = () => {
    setRecipientEmail("")
    setEmailSubject("")
    setEmailBody("")
    setValidationErrors({})
    setPreviewMode(false)
    onClose()
  }

  const togglePreview = () => {
    setPreviewMode(!previewMode)
  }

  if (!candidateData) return null

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md" 
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 2,
          direction: 'rtl'
        }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: 'primary.main', 
        color: 'white', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        p: 3
      }}>
        <Box display="flex" alignItems="center" gap={2}>
          <EmailIcon />
          <Typography variant="h6" fontWeight="bold">
            שליחת פרטי מועמד במייל עם קובץ PDF
          </Typography>
        </Box>
        <IconButton onClick={handleClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* פרטי המועמד */}
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <PersonIcon color="primary" />
            <Typography variant="h6" color="primary" fontWeight="bold">
              פרטי מועמד לשליחה
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body1">
              <strong>{candidateData.firstName} {candidateData.lastName}</strong>
            </Typography>
            <Chip 
              label={candidateData.gender === 'male' ? 'זכר' : 'נקבה'}
              color={candidateData.gender === 'male' ? 'primary' : 'secondary'}
              size="small"
            />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {candidateData.email} • {candidateData.phone}
          </Typography>
        </Paper>

        {!previewMode ? (
          <>
            {/* שדות המייל */}
            <Box display="flex" flexDirection="column" gap={3}>
              <TextField
                label="כתובת אימייל של הנמען *"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                fullWidth
                variant="outlined"
                error={!!validationErrors.recipientEmail}
                helperText={validationErrors.recipientEmail}
                placeholder="דוגמה: shadchan@example.com"
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                label="נושא המייל *"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                fullWidth
                variant="outlined"
                error={!!validationErrors.emailSubject}
                helperText={validationErrors.emailSubject}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                label="תוכן המייל *"
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                fullWidth
                multiline
                rows={6}
                variant="outlined"
                error={!!validationErrors.emailBody}
                helperText={validationErrors.emailBody}
                placeholder="הכנס את תוכן המייל כאן..."
                InputLabelProps={{ shrink: true }}
              />

              <Alert severity="success" sx={{ mt: 2 }}>
                <Box display="flex" alignItems="center" gap={1}>
                  <AttachFileIcon />
                  <Typography variant="body2">
                    <strong>📎 קובץ PDF יצורף למייל</strong><br/>
                    המייל יכלול קובץ PDF מעוצב עם כל פרטי המועמד בפורמט מקצועי וברור.
                  </Typography>
                </Box>
              </Alert>
            </Box>
          </>
        ) : (
          /* תצוגה מקדימה */
          <Box>
            <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
              תצוגה מקדימה של תוכן קובץ ה-PDF
            </Typography>
            <Paper 
              sx={{ 
                p: 2, 
                maxHeight: 400, 
                overflow: 'auto',
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: generatePreviewHTML(candidateData) 
                }}
                style={{ fontSize: '12px' }}
              />
            </Paper>
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                💡 זוהי תצוגה מקדימה של התוכן שיופיע בקובץ ה-PDF המצורף. 
                התוכן המלא יכלול את כל הפרטים הזמינים במערכת.
              </Typography>
            </Alert>
          </Box>
        )}
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          variant="outlined"
          onClick={togglePreview}
          startIcon={<VisibilityIcon />}
          disabled={sendingEmail}
        >
          {previewMode ? 'חזור לעריכה' : 'תצוגה מקדימה'}
        </Button>

        <Button
          variant="outlined"
          onClick={handleClose}
          disabled={sendingEmail}
        >
          ביטול
        </Button>

        <Button
          variant="contained"
          onClick={handleSendEmail}
          disabled={sendingEmail || previewMode}
          startIcon={sendingEmail ? <CircularProgress size={20} /> : <SendIcon />}
          sx={{ minWidth: 140 }}
        >
          {sendingEmail ? 'שולח...' : 'שלח מייל + PDF'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EmailSender