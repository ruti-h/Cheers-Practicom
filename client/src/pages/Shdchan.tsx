// import React, { useState, useEffect } from "react";
// import { observer } from "mobx-react-lite";
// import axios from "axios";
// import { CandidateData } from "./store/candidateStore";

// const Shadchan = observer(() => {


//   const [candidates, setCandidates] = useState<CandidateData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedCandidate, setSelectedCandidate] = useState<CandidateData | null>(null);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);

//   useEffect(() => {
//     const fetchCandidates = async () => {
//       try {
//         const response = await axios.get('https://localhost:7215/api/Candidate');
      
//         const data = await response.data;
//         setCandidates(data);
//         setLoading(false);
//       } catch (err) {
       
//         setLoading(false);
//       }
//     };

//     fetchCandidates();
//   }, []);
 
//   const DisplayMoreDetails = (candidate: CandidateData) => {
//     setSelectedCandidate(candidate);
//     setIsDialogOpen(true);
//   };

//   const closeDialog = () => {
//     setIsDialogOpen(false);
//   };
//   if (loading) return <div>Loading candidates...</div>;
//   if (error) return <div>Error loading candidates: {error}</div>;

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">Candidates List</h1>
//       {candidates.length === 0 ? (
//         <p>No candidates found</p>
//       ) : (
//         <ul className="space-y-2">
//           {candidates.map((candidate) => (
//             <li key={candidate.lastName} className="border p-3 rounded shadow" onClick={() => DisplayMoreDetails(candidate)}>
//               {/* Replace these with your actual candidate properties */}
//               <h2 className="font-semibold">{candidate.firstName}</h2>
//               <p>{candidate.lastName}</p>
//             </li>
//           ))}
//         </ul>
//       )}
//       {/* Candidate Details Dialog */}
//       {isDialogOpen && selectedCandidate && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 max-h-screen overflow-y-auto">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold">
//                 {selectedCandidate.firstName} {selectedCandidate.lastName}
//               </h2>
//               <button 
//                 onClick={closeDialog}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 ✕
//               </button>
//             </div>
            
//             <div className="space-y-4">
//               {/* Display all candidate properties */}
//               {Object.entries(selectedCandidate).map(([key, value]) => (
//                 <div key={key} className="border-b pb-2">
//                   <span className="font-medium">{key}: </span>
//                   <span>{typeof value === 'object' ? JSON.stringify(value) : value}</span>
//                 </div>
//               ))}
//             </div>
            
//             <div className="mt-6 flex justify-end">
//               <button 
//                 onClick={closeDialog}
//                 className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// });

// export default Shadchan;

"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { observer } from "mobx-react-lite"
import axios from "axios"
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Divider,
  Avatar,
  IconButton,
  useTheme,
  useMediaQuery,
  CircularProgress,
  TextField,
  InputAdornment,
  Paper,
} from "@mui/material"
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Cake as CakeIcon,
  Height as HeightIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material"
import type { CandidateData } from "../store/candidateStore"

const Shadchan = observer(() => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [tabValue, setTabValue] = useState(0)
  const [candidates, setCandidates] = useState<CandidateData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateData | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])

  // טעינת המועמדים
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${baseUrl}/Candidate`)
        const data = await response.data
        setCandidates(data)
        setLoading(false)
      } catch (err: any) {
        setError(err.message || "שגיאה בטעינת המועמדים")
        setLoading(false)
      }
    }

    fetchCandidates()
  }, [])

  // טיפול בשינוי לשונית
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  // פתיחת דיאלוג פרטי מועמד
  const handleOpenCandidateDetails = (candidate: CandidateData) => {
    setSelectedCandidate(candidate)
    setIsDialogOpen(true)
  }

  // סגירת דיאלוג
  const handleCloseDialog = () => {
    setIsDialogOpen(false)
  }

  // הוספה/הסרה ממועדפים
  const toggleFavorite = (candidateId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    setFavorites((prev) => {
      if (prev.includes(candidateId)) {
        return prev.filter((id) => id !== candidateId)
      } else {
        return [...prev, candidateId]
      }
    })
  }
  const baseUrl  = import.meta.env.VITE_API_URL;

  // סינון מועמדים לפי מגדר ומונח חיפוש
  const filteredCandidates = candidates.filter((candidate) => {
    const genderMatch = tabValue === 0 ? candidate.gender === "male" : candidate.gender === "female"
    const searchMatch =
      searchTerm === "" ||
      candidate.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (candidate.backGround && candidate.backGround.toLowerCase().includes(searchTerm.toLowerCase()))

    return genderMatch && searchMatch
  })

  // חישוב גיל מתאריך לידה
  const calculateAge = (birthDateString: string) => {
    if (!birthDateString) return "לא צוין"

    const birthDate = new Date(birthDateString)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  }

  // פונקציה להצגת תמונת פרופיל
  const getProfileImage = (candidate: CandidateData) => {
    // במקרה אמיתי, כאן היה קוד להצגת תמונת הפרופיל של המועמד
    // כרגע נשתמש בתמונות פרופיל כלליות לפי מגדר
    return candidate.gender === "male"
      ? "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
      : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
  }

  // רינדור כרטיס מועמד
  const renderCandidateCard = (candidate: CandidateData) => {
    const isFavorite = favorites.includes(candidate.tz)

    return (
      <Grid item xs={12} sm={6} md={4} lg={3} key={candidate.tz}>
        <Card
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            transition: "transform 0.3s, box-shadow 0.3s",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
              cursor: "pointer",
            },
            position: "relative",
            overflow: "visible",
            borderRadius: 2,
            border: "1px solid rgba(218, 165, 32, 0.2)",
          }}
          onClick={() => handleOpenCandidateDetails(candidate)}
        >
          <Box sx={{ position: "relative" }}>
            <CardMedia
              component="img"
              height="200"
              image={getProfileImage(candidate)}
              alt={`${candidate.firstName} ${candidate.lastName}`}
              sx={{ objectFit: "cover" }}
            />
            <IconButton
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                bgcolor: "rgba(255, 255, 255, 0.8)",
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.9)",
                },
              }}
              onClick={(e) => toggleFavorite(candidate.tz, e)}
            >
              {isFavorite ? (
                <FavoriteIcon sx={{ color: "#d32f2f" }} />
              ) : (
                <FavoriteBorderIcon sx={{ color: "#757575" }} />
              )}
            </IconButton>
          </Box>

          <CardContent sx={{ flexGrow: 1, p: 2 }}>
            <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: "bold" }}>
              {candidate.firstName} {candidate.lastName}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <LocationIcon sx={{ color: "text.secondary", mr: 1, fontSize: 18 }} />
              <Typography variant="body2" color="text.secondary">
                {candidate.city}, {candidate.country}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <CakeIcon sx={{ color: "text.secondary", mr: 1, fontSize: 18 }} />
              <Typography variant="body2" color="text.secondary">
                גיל: {calculateAge(candidate.burnDate)}
              </Typography>
            </Box>

            {candidate.height && (
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <HeightIcon sx={{ color: "text.secondary", mr: 1, fontSize: 18 }} />
                <Typography variant="body2" color="text.secondary">
                  גובה: {candidate.height} ס"מ
                </Typography>
              </Box>
            )}

            <Divider sx={{ my: 1.5 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontWeight: "bold" }}>
                רקע:
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {candidate.backGround || "לא צוין"}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 2 }}>
              {candidate.gender === "male" ? (
                <>
                  {candidate.isLearning && (
                    <Chip
                      label={
                        candidate.isLearning === "fullTime"
                          ? "תורתו אומנתו"
                          : candidate.isLearning === "partTime"
                            ? "חצי יום לומד"
                            : "קובע עיתים"
                      }
                      size="small"
                      sx={{ bgcolor: "rgba(218, 165, 32, 0.1)", color: "#daa520" }}
                    />
                  )}
                  {candidate.beard && (
                    <Chip
                      label={
                        candidate.beard === "full" ? "זקן מלא" : candidate.beard === "partial" ? "זקן קצוץ" : "מגולח"
                      }
                      size="small"
                      sx={{ bgcolor: "rgba(0, 0, 0, 0.05)" }}
                    />
                  )}
                </>
              ) : (
                <>
                  {candidate.professional && (
                    <Chip
                      label={
                        candidate.professional === "education"
                          ? "חינוך"
                          : candidate.professional === "tech"
                            ? "היי-טק"
                            : candidate.professional === "office"
                              ? "משרדי"
                              : candidate.professional === "therapy"
                                ? "טיפולי"
                                : "אחר"
                      }
                      size="small"
                      sx={{ bgcolor: "rgba(218, 165, 32, 0.1)", color: "#daa520" }}
                    />
                  )}
                  {candidate.headCovering && (
                    <Chip
                      label={
                        candidate.headCovering === "wig"
                          ? "פאה"
                          : candidate.headCovering === "scarf"
                            ? "מטפחת"
                            : candidate.headCovering === "hat"
                              ? "כובע"
                              : "שילוב"
                      }
                      size="small"
                      sx={{ bgcolor: "rgba(0, 0, 0, 0.05)" }}
                    />
                  )}
                </>
              )}
              {candidate.openness && (
                <Chip
                  label={
                    candidate.openness === "very_open"
                      ? "פתוח/ה"
                      : candidate.openness === "medium"
                        ? "בינוני/ת"
                        : "שמרני/ת"
                  }
                  size="small"
                  sx={{ bgcolor: "rgba(0, 0, 0, 0.05)" }}
                />
              )}
            </Box>

            <Button
              variant="outlined"
              fullWidth
              startIcon={<VisibilityIcon />}
              sx={{
                borderColor: "#daa520",
                color: "#daa520",
                "&:hover": {
                  borderColor: "#c49619",
                  bgcolor: "rgba(218, 165, 32, 0.05)",
                },
              }}
            >
              צפייה בפרטים
            </Button>
          </CardContent>
        </Card>
      </Grid>
    )
  }

  // רינדור דיאלוג פרטי מועמד
  const renderCandidateDetailsDialog = () => {
    if (!selectedCandidate) return null

    return (
      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 2,
            bgcolor: "#fafafa",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
            bgcolor: "#f5f5f5",
          }}
        >
          <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
            {selectedCandidate.firstName} {selectedCandidate.lastName}
          </Typography>
          <IconButton edge="end" color="inherit" onClick={handleCloseDialog} aria-label="close">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          <Grid container>
            {/* תמונת פרופיל ופרטים בסיסיים */}
            <Grid item xs={12} md={4} sx={{ bgcolor: "#f0f0f0" }}>
              <Box sx={{ p: 3, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Avatar
                  src={getProfileImage(selectedCandidate)}
                  alt={`${selectedCandidate.firstName} ${selectedCandidate.lastName}`}
                  sx={{ width: 150, height: 150, mb: 2, border: "4px solid white", boxShadow: 2 }}
                />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", textAlign: "center" }}>
                  {selectedCandidate.firstName} {selectedCandidate.lastName}
                </Typography>

                <Box sx={{ width: "100%", mt: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <LocationIcon sx={{ color: "text.secondary", mr: 1 }} />
                    <Typography variant="body1">
                      {selectedCandidate.city}, {selectedCandidate.country}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <CakeIcon sx={{ color: "text.secondary", mr: 1 }} />
                    <Typography variant="body1">גיל: {calculateAge(selectedCandidate.burnDate)}</Typography>
                  </Box>

                  {selectedCandidate.height && (
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <HeightIcon sx={{ color: "text.secondary", mr: 1 }} />
                      <Typography variant="body1">גובה: {selectedCandidate.height} ס"מ</Typography>
                    </Box>
                  )}

                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <HomeIcon sx={{ color: "text.secondary", mr: 1 }} />
                    <Typography variant="body1">
                      {selectedCandidate.street} {selectedCandidate.numberHouse}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <PhoneIcon sx={{ color: "text.secondary", mr: 1 }} />
                    <Typography variant="body1" dir="ltr">
                      {selectedCandidate.phone}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <EmailIcon sx={{ color: "text.secondary", mr: 1 }} />
                    <Typography variant="body1" dir="ltr">
                      {selectedCandidate.email}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* פרטים מורחבים */}
            <Grid item xs={12} md={8}>
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: "#daa520" }}>
                  פרטים אישיים
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Paper sx={{ p: 2, height: "100%" }}>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
                        רקע משפחתי
                      </Typography>
                      <Typography variant="body2">{selectedCandidate.backGround || "לא צוין"}</Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Paper sx={{ p: 2, height: "100%" }}>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
                        מראה חיצוני
                      </Typography>
                      <Typography variant="body2">{selectedCandidate.appearance || "לא צוין"}</Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
                        תכונות חשובות שלי
                      </Typography>
                      <Typography variant="body2">{selectedCandidate.importantTraitsInMe || "לא צוין"}</Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
                        תכונות חשובות שאני מחפש/ת
                      </Typography>
                      <Typography variant="body2">
                        {selectedCandidate.importantTraitsIAmLookingFor || "לא צוין"}
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
                        ציפיות מבן/בת הזוג
                      </Typography>
                      <Typography variant="body2">{selectedCandidate.expectationsFromPartner || "לא צוין"}</Typography>
                    </Paper>
                  </Grid>
                </Grid>

                {/* פרטים ספציפיים למגדר */}
                <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: "#daa520", mt: 4 }}>
                  {selectedCandidate.gender === "male" ? "פרטים נוספים" : "פרטים נוספים"}
                </Typography>

                <Grid container spacing={3}>
                  {selectedCandidate.gender === "male" ? (
                    // פרטים ספציפיים לגברים
                    <>
                      <Grid item xs={12} sm={6}>
                        <Paper sx={{ p: 2, height: "100%" }}>
                          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
                            לימודים
                          </Typography>
                          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                ישיבה:
                              </Typography>
                              <Typography variant="body2">{selectedCandidate.yeshiva || "לא צוין"}</Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                לימוד תורה:
                              </Typography>
                              <Typography variant="body2">
                                {selectedCandidate.isLearning === "fullTime"
                                  ? "תורתו אומנתו"
                                  : selectedCandidate.isLearning === "partTime"
                                    ? "חצי יום לומד"
                                    : selectedCandidate.isLearning === "evening"
                                      ? "קובע עיתים לתורה"
                                      : "לא צוין"}
                              </Typography>
                            </Box>
                          </Box>
                        </Paper>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Paper sx={{ p: 2, height: "100%" }}>
                          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
                            מראה חיצוני
                          </Typography>
                          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                זקן:
                              </Typography>
                              <Typography variant="body2">
                                {selectedCandidate.beard === "full"
                                  ? "מזוקן"
                                  : selectedCandidate.beard === "partial"
                                    ? "קצוץ/צמוד"
                                    : selectedCandidate.beard === "none"
                                      ? "מגולח"
                                      : "לא צוין"}
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                כובע:
                              </Typography>
                              <Typography variant="body2">
                                {selectedCandidate.hat === "black"
                                  ? "שחור"
                                  : selectedCandidate.hat === "streimel"
                                    ? "שטריימל"
                                    : selectedCandidate.hat === "knitted"
                                      ? "כיפה סרוגה"
                                      : selectedCandidate.hat === "none"
                                        ? "ללא"
                                        : "לא צוין"}
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                חליפה:
                              </Typography>
                              <Typography variant="body2">
                                {selectedCandidate.suit === "always"
                                  ? "תמיד"
                                  : selectedCandidate.suit === "sometimes"
                                    ? "לעיתים"
                                    : selectedCandidate.suit === "none"
                                      ? "לא לובש"
                                      : "לא צוין"}
                              </Typography>
                            </Box>
                          </Box>
                        </Paper>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Paper sx={{ p: 2, height: "100%" }}>
                          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
                            פרטים נוספים
                          </Typography>
                          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                מעשן:
                              </Typography>
                              <Typography variant="body2">{selectedCandidate.smoker === true ? "כן" : "לא"}</Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                רישיון נהיגה:
                              </Typography>
                              <Typography variant="body2">
                                {selectedCandidate.driversLicense === true ? "כן" : "לא"}
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                מצב בריאותי תקין:
                              </Typography>
                              <Typography variant="body2">
                                {selectedCandidate.healthCondition === true ? "כן" : "לא"}
                              </Typography>
                            </Box>
                          </Box>
                        </Paper>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Paper sx={{ p: 2, height: "100%" }}>
                          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
                            העדפות לגבי בת הזוג
                          </Typography>
                          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                העדפת סמינר:
                              </Typography>
                              <Typography variant="body2">
                                {selectedCandidate.preferredSeminarStyle === "lithuanian"
                                  ? "ליטאי"
                                  : selectedCandidate.preferredSeminarStyle === "hasidic"
                                    ? "חסידי"
                                    : selectedCandidate.preferredSeminarStyle === "modern"
                                      ? "מודרני"
                                      : selectedCandidate.preferredSeminarStyle === "any"
                                        ? "לא משנה"
                                        : "לא צוין"}
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                העדפת כיסוי ראש:
                              </Typography>
                              <Typography variant="body2">
                                {selectedCandidate.preferredHeadCovering === "wig"
                                  ? "פאה"
                                  : selectedCandidate.preferredHeadCovering === "scarf"
                                    ? "מטפחת"
                                    : selectedCandidate.preferredHeadCovering === "hat"
                                      ? "כובע"
                                      : selectedCandidate.preferredHeadCovering === "any"
                                        ? "לא משנה"
                                        : "לא צוין"}
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                טווח גילאים:
                              </Typography>
                              <Typography variant="body2">
                                {selectedCandidate.ageFrom}-{selectedCandidate.ageTo}
                              </Typography>
                            </Box>
                          </Box>
                        </Paper>
                      </Grid>
                    </>
                  ) : (
                    // פרטים ספציפיים לנשים
                    <>
                      <Grid item xs={12} sm={6}>
                        <Paper sx={{ p: 2, height: "100%" }}>
                          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
                            לימודים ומקצוע
                          </Typography>
                          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                סמינר:
                              </Typography>
                              <Typography variant="body2">{selectedCandidate.seminar || "לא צוין"}</Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                תחום מקצועי:
                              </Typography>
                              <Typography variant="body2">
                                {selectedCandidate.professional === "education"
                                  ? "חינוך"
                                  : selectedCandidate.professional === "tech"
                                    ? "היי-טק"
                                    : selectedCandidate.professional === "office"
                                      ? "משרדי"
                                      : selectedCandidate.professional === "therapy"
                                        ? "טיפולי"
                                        : selectedCandidate.professional === "other"
                                          ? "אחר"
                                          : "לא צוין"}
                              </Typography>
                            </Box>
                          </Box>
                        </Paper>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Paper sx={{ p: 2, height: "100%" }}>
                          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
                            פרטים נוספים
                          </Typography>
                          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                כיסוי ראש מועדף:
                              </Typography>
                              <Typography variant="body2">
                                {selectedCandidate.headCovering === "wig"
                                  ? "פאה"
                                  : selectedCandidate.headCovering === "scarf"
                                    ? "מטפחת"
                                    : selectedCandidate.headCovering === "hat"
                                      ? "כובע"
                                      : selectedCandidate.headCovering === "combination"
                                        ? "שילוב"
                                        : "לא צוין"}
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                בעלת תשובה:
                              </Typography>
                              <Typography variant="body2">
                                {selectedCandidate.anOutsider === true ? "כן" : "לא"}
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                מצב בריאותי תקין:
                              </Typography>
                              <Typography variant="body2">
                                {selectedCandidate.healthCondition === true ? "כן" : "לא"}
                              </Typography>
                            </Box>
                          </Box>
                        </Paper>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Paper sx={{ p: 2, height: "100%" }}>
                          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
                            העדפות לגבי בן הזוג
                          </Typography>
                          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                העדפת לימוד תורה:
                              </Typography>
                              <Typography variant="body2">
                                {selectedCandidate.prefferedIsLearning === "fullTime"
                                  ? "תורתו אומנתו"
                                  : selectedCandidate.prefferedIsLearning === "partTime"
                                    ? "חצי יום עובד חצי יום לומד"
                                    : selectedCandidate.prefferedIsLearning === "working"
                                      ? "קובע עיתים לתורה"
                                      : selectedCandidate.prefferedIsLearning === "combined"
                                        ? "שילוב לימודים ועבודה"
                                        : "לא צוין"}
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                העדפת סגנון ישיבה:
                              </Typography>
                              <Typography variant="body2">
                                {selectedCandidate.prefferedYeshivaStyle === "lithuanian"
                                  ? "ליטאי"
                                  : selectedCandidate.prefferedYeshivaStyle === "hasidic"
                                    ? "חסידי"
                                    : selectedCandidate.prefferedYeshivaStyle === "sephardic"
                                      ? "ספרדי"
                                      : selectedCandidate.prefferedYeshivaStyle === "modern"
                                        ? "מודרני"
                                        : selectedCandidate.prefferedYeshivaStyle === "any"
                                          ? "לא משנה"
                                          : "לא צוין"}
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                טווח גילאים:
                              </Typography>
                              <Typography variant="body2">
                                {selectedCandidate.ageFrom}-{selectedCandidate.ageTo}
                              </Typography>
                            </Box>
                          </Box>
                        </Paper>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Paper sx={{ p: 2, height: "100%" }}>
                          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
                            פרטי קשר הורים
                          </Typography>
                          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                טלפון אב:
                              </Typography>
                              <Typography variant="body2" dir="ltr">
                                {selectedCandidate.fatherPhone || "לא צוין"}
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                טלפון אם:
                              </Typography>
                              <Typography variant="body2" dir="ltr">
                                {selectedCandidate.motherPhone || "לא צוין"}
                              </Typography>
                            </Box>
                          </Box>
                        </Paper>
                      </Grid>
                    </>
                  )}
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: "1px solid rgba(0, 0, 0, 0.1)" }}>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{
              borderColor: "#daa520",
              color: "#daa520",
              "&:hover": {
                borderColor: "#c49619",
                bgcolor: "rgba(218, 165, 32, 0.05)",
              },
            }}
          >
            סגור
          </Button>
          <Button
            variant="contained"
            onClick={(e) => toggleFavorite(selectedCandidate.tz, e)}
            startIcon={favorites.includes(selectedCandidate.tz) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            sx={{
              bgcolor: favorites.includes(selectedCandidate.tz) ? "#d32f2f" : "#daa520",
              "&:hover": {
                bgcolor: favorites.includes(selectedCandidate.tz) ? "#b71c1c" : "#c49619",
              },
            }}
          >
            {favorites.includes(selectedCandidate.tz) ? "הסר ממועדפים" : "הוסף למועדפים"}
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", pt: 8, pb: 6 }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4, mt: 2 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#333", textAlign: "center" }}
          >
            מאגר המועמדים
          </Typography>
          <Typography variant="subtitle1" sx={{ color: "text.secondary", textAlign: "center", mb: 4 }}>
            מצא את השידוך המתאים מתוך מאגר המועמדים שלנו
          </Typography>

          {/* חיפוש וסינון */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              mb: 4,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TextField
              placeholder="חיפוש לפי שם, עיר או רקע..."
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: { xs: "100%", sm: "50%" },
                bgcolor: "white",
                borderRadius: 1,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                },
              }}
            />

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<FilterListIcon />}
                sx={{
                  borderColor: "#daa520",
                  color: "#daa520",
                  "&:hover": {
                    borderColor: "#c49619",
                    bgcolor: "rgba(218, 165, 32, 0.05)",
                  },
                }}
              >
                סינון מתקדם
              </Button>
            </Box>
          </Box>

          {/* לשוניות מגדר */}
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                "& .MuiTab-root": {
                  fontWeight: "bold",
                  fontSize: "1rem",
                },
                "& .Mui-selected": {
                  color: "#daa520",
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#daa520",
                },
              }}
            >
              <Tab icon={<PersonIcon />} label="גברים" id="tab-0" aria-controls="tabpanel-0" />
              <Tab icon={<PersonIcon />} label="נשים" id="tab-1" aria-controls="tabpanel-1" />
            </Tabs>
          </Box>

          {/* תצוגת מועמדים */}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 8 }}>
              <CircularProgress sx={{ color: "#daa520" }} />
            </Box>
          ) : error ? (
            <Box
              sx={{
                textAlign: "center",
                py: 8,
                px: 2,
                bgcolor: "white",
                borderRadius: 2,
                boxShadow: 1,
              }}
            >
              <InfoIcon sx={{ fontSize: 60, color: "#d32f2f", mb: 2, opacity: 0.7 }} />
              <Typography variant="h6" gutterBottom>
                שגיאה בטעינת המועמדים
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {error}
              </Typography>
            </Box>
          ) : filteredCandidates.length === 0 ? (
            <Box
              sx={{
                textAlign: "center",
                py: 8,
                px: 2,
                bgcolor: "white",
                borderRadius: 2,
                boxShadow: 1,
              }}
            >
              <InfoIcon sx={{ fontSize: 60, color: "#daa520", mb: 2, opacity: 0.7 }} />
              <Typography variant="h6" gutterBottom>
                לא נמצאו מועמדים
              </Typography>
              <Typography variant="body1" color="text.secondary">
                נסה לשנות את מונחי החיפוש או הסינון
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredCandidates.map((candidate) => renderCandidateCard(candidate))}
            </Grid>
          )}
        </Box>
      </Container>

      {/* דיאלוג פרטי מועמד */}
      {renderCandidateDetailsDialog()}
    </Box>
  )
})

export default Shadchan
