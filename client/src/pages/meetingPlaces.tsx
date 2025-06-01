
import React, { useState } from 'react';
//import { createPageUrl } from "@/utils";
import { 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  IconButton, 
  Select, 
  MenuItem, 
  FormControl, 
  Button, 
  TextField, 
  Autocomplete, 
  InputAdornment,
  Box,
  Container,
  Paper,
  Chip,
  Divider,
  InputLabel,
  Stack
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PeopleIcon from '@mui/icons-material/People';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CategoryIcon from '@mui/icons-material/Category';
import ArrowBackIcon from '@mui/icons-material/ArrowForward';
import ArrowForwardIcon from '@mui/icons-material/ArrowBack';
import InfoIcon from '@mui/icons-material/Info';
import '../components/style/meetingPlace.css';
import PlaceDetailsDialog from '../components/places/PlaceDetailsDialog';

// ייבוא התמונות
// import image1 from './Picture/storeShops_image1_id165_rnd4Qf9.jpg';
// import image2 from './Picture/WhatsApp-Image-2023-03-22-at-09.37.46-2-1024x768-1-jpeg.webp';
// import image3 from './Picture/הפארק-הלאומי-רמת-גן.jpg';
// import image4 from './Picture/מלון וולדורף אסטוריה.jpg';
// import image5 from './Picture/1-אקווריום-ישראל-ירושלים-צילום-שלומי-כהן-2.jpg';
// import image6 from './Picture/טילת נתניה.jpg';
// import image7 from './Picture/כפר המכביה.jpg';

type Location = {
  id: number;
  image: string;
  area: string;
  type: string;
  likes: number;
  meets: number;
  priceRange: string;
  openingHours: string;
  phone: string;
  website?: string;
  parking: boolean;
  kosher: string;
  accessibility: boolean;
  description: string;
}


const extendedLocations: Location[] = [
    { 
        id: 1, 
        image: "https://y33.co.il/wp-content/uploads/2023/07/%D7%9E%D7%9C%D7%95%D7%9F-%D7%99%D7%A8%D7%9E%D7%99%D7%94%D7%95-33-7.jpg", 
        area: 'ירושלים', 
        type: 'מלון', 
        likes: 0, 
        meets: 0,
        priceRange: '₪300-500 לסועד',
        openingHours: 'א-ה 10:00-22:00',
        phone: '02-1234567',
        website: 'www.hotel.co.il',
        parking: true,
        kosher: 'מהדרין',
        accessibility: true,
        description: 'מלון יוקרתי במיקום מרכזי בירושלים. המקום מציע אווירה שקטה ומכובדת, מתאים במיוחד לפגישות שידוכים. כולל לובי מרווח ובית קפה כשר למהדרין.'
    },
    { 
        id: 2, 
        image: "https://images.rest.co.il/Customers/80381841/41939ada1e7f4d5e84d28b9a486d86ae_56.jpg", 
        area: 'בני ברק', 
        type: 'מסעדה', 
        likes: 0, 
        meets: 0,
        priceRange: '₪100-200 לסועד',
        openingHours: 'א-ו 12:00-23:00',
        phone: '03-9876543',
        website: 'www.restaurant.co.il',
        parking: false,
        kosher: 'רגיל',
        accessibility: true,
        description: 'מסעדה חלבית באזור מרכזי. מתאימה לפגישות קלילות ונעימות. מציעה מגוון מנות חלביות וקינוחים.'
    },
    { 
        id: 3, 
        image: "https://cms-media.ramat-gan.muni.il/media/xahju2tl/banner-mobile.jpg", 
        area: 'תל אביב', 
        type: 'פארק הלאומי', 
        likes: 0, 
        meets: 0,
        priceRange: 'חינם',
        openingHours: '24/7',
        phone: 'אין',
        website: 'www.park.co.il',
        parking: true,
        kosher: 'לא',
        accessibility: true,
        description: 'פארק ירוק ורחב ידיים בתל אביב. מתאים לפיקניקים ופגישות באוויר הפתוח. ישנם אזורים מוצלים וספסלים.'
    },
    { 
        id: 4, 
        image: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/496718311.jpg?k=b48f906856b42e02f83875f7f1f6bc75401e6d70730fdfb48cdfffce8d4033c0&o=&hp=1", 
        area: 'ירושלים', 
        type: 'מלון וולדורף אסטוריה', 
        likes: 0, 
        meets: 0,
        priceRange: '₪500+ לסועד',
        openingHours: 'א-ש 07:00-24:00',
        phone: '02-1112223',
        website: 'www.waldorf.co.il',
        parking: true,
        kosher: 'למהדרין',
        accessibility: true,
        description: 'מלון יוקרה בירושלים, אווירה אלגנטית ומרשימה, מתאים לפגישות עסקיות ואישיות חשובות. מציע מסעדות גורמה ושטחים פרטיים לפגישות.'
    },
    { 
        id: 5, 
        image: "https://bvh.co.il/wp-content/uploads/2022/06/underwater-tunnel_78361-1327.webp", 
        area: 'ירושלים', 
        type: 'אקווריום ישראל', 
        likes: 0, 
        meets: 0,
        priceRange: '₪100 למבקר',
        openingHours: 'א-ה 09:00-17:00, ו 09:00-14:00',
        phone: '02-4445556',
        website: 'www.aquarium.co.il',
        parking: true,
        kosher: 'לא',
        accessibility: true,
        description: 'אטרקציה ייחודית בירושלים, סיור בין יצורי ים מרהיבים. מתאים למפגשים חווייתיים ומשפחות. ניתן לשלב ארוחה קלה בקפיטריה.'
    },
    { 
        id: 6, 
        image: "https://www.netanya.muni.il/PublishingImages/%D7%A9%D7%9B%D7%95%D7%A0%D7%95%D7%AA%20%D7%95%D7%A8%D7%91%D7%A2%D7%99%D7%9D/13.JPG", 
        area: 'נתניה', 
        type: 'טילת נתניה', 
        likes: 0, 
        meets: 0,
        priceRange: 'חינם',
        openingHours: '24/7',
        phone: 'אין',
        website: 'www.netanya.muni.il',
        parking: true,
        kosher: 'לא',
        accessibility: true,
        description: 'טיילת יפהפייה לאורך חוף הים בנתניה. מתאים לטיול רגלי ופגישות רומנטיות. ישנם בתי קפה ומסעדות לאורך הטיילת.'
    },
    { 
        id: 7, 
        image: "https://www.kmc-hotel.co.il/octopus/upload/images/resorts/thumbsautoxauto_mh_446_mw_318/untitled-26-1-.jpg", 
        area: 'רמת גן', 
        type: 'כפר המכביה', 
        likes: 0, 
        meets: 0,
        priceRange: '₪200-400 לסועד',
        openingHours: 'א-ש 08:00-23:00',
        phone: '03-7778889',
        website: 'www.maccabiah.co.il',
        parking: true,
        kosher: 'רגיל',
        accessibility: true,
        description: 'מלון ומרכז כנסים ברמת גן. מציע אווירה ספורטיבית ונעימה. מתאים לפגישות עסקיות ואירועים.'
    }
];

const ITEMS_PER_PAGE = 6;

const LoadingIndicator: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '24px', gap: 1 }}>
      <div className="loading-dot"></div>
      <div className="loading-dot"></div>
      <div className="loading-dot"></div>
    </Box>
  );
};

const MeetingPlaces = () => {
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [selectedArea, setSelectedArea] = useState<string>('');
    const [selectedType, setSelectedType] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [updatedLocations, setUpdatedLocations] = useState<Location[]>(extendedLocations);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedPlace, setSelectedPlace] = useState<Location | null>(null);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    const filteredLocations = updatedLocations.filter(location => {
        const matchesArea = selectedArea ? location.area === selectedArea : true;
        const matchesType = selectedType ? location.type === selectedType : true;

        const matchesSearch = searchTerm 
            ? searchTerm.split('').every(char =>
                location.area.includes(char) || location.type.includes(char)
              )
            : true;

        return matchesArea && matchesType && matchesSearch;
    });

    const displayedLocations = filteredLocations.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);
    const totalPages = Math.ceil(filteredLocations.length / ITEMS_PER_PAGE);

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setLoading(true);
            setTimeout(() => {
                setCurrentPage(currentPage + 1);
                setLoading(false);
            }, 800);
        }
    };

    const handleLike = (id: number) => {
        const newLocations = updatedLocations.map(location => {
            if (location.id === id) {
                return { ...location, likes: location.likes + 1 };
            }
            return location;
        });
        setUpdatedLocations(newLocations);
    };

    const handleMeet = (id: number) => {
        const newLocations = updatedLocations.map(location => {
            if (location.id === id) {
                return { ...location, meets: location.meets + 1 };
            }
            return location;
        });
        setUpdatedLocations(newLocations);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedArea('');
        setSelectedType('');
        setCurrentPage(0);
    };

    const handleOpenDetails = (place: Location) => {
        setSelectedPlace(place);
        setDialogOpen(true);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 5 }}>
            {/* כפתור חזרה לדף הבית */}
            <Box sx={{ mb: 4 }}>
                {/* <Button
                    component={Link}
                    to="/Home"
                    variant="outlined"
                    startIcon={<HomeIcon />}
                    sx={{
                        borderColor: '#daa520',
                        color: '#1a1a4e',
                        '&:hover': { borderColor: '#c49619', bgcolor: 'rgba(218, 165, 32, 0.1)' },
                    }}
                >
                    חזרה לדף הבית
                </Button> */}
            </Box>

            {/* כותרת העמוד */}
            <Box sx={{ 
                textAlign: 'center', 
                mb: 5,
                position: 'relative',
                '&::after': {
                    content: '""',
                    display: 'block',
                    width: '80px',
                    height: '4px',
                    bgcolor: '#daa520',
                    mx: 'auto',
                    mt: 1,
                    borderRadius: '2px'
                }
            }}>
                <Typography 
                    variant="h3" 
                    component="h1" 
                    sx={{ 
                        fontWeight: 'bold',
                        color: '#1a1a4e',
                        mb: 2
                    }}
                >
                    מקומות מומלצים לפגישה
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    מצאו את המקום המושלם לפגישת השידוך שלכם
                </Typography>
            </Box>

            {/* פאנל חיפוש וסינון */}
            <Paper 
                elevation={3} 
                sx={{ 
                    p: 3, 
                    mb: 5, 
                    borderRadius: '16px',
                    background: 'linear-gradient(to right, #f5f5fa, #ffffff)'
                }}
            >
                <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={4}>
                        <Autocomplete
                            options={updatedLocations}
                            getOptionLabel={(option) => `${option.area} - ${option.type}`}
                            onInputChange={(_, newInputValue) => {
                                setSearchTerm(newInputValue);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="חיפוש מקום"
                                    variant="outlined"
                                    fullWidth
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon color="primary" />
                                            </InputAdornment>
                                        ),
                                        endAdornment: searchTerm ? (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setSearchTerm('')} size="small">
                                                    <CancelIcon />
                                                </IconButton>
                                            </InputAdornment>
                                        ) : null,
                                    }}
                                />
                            )}
                            onChange={(_, newValue) => {
                                if (newValue) {
                                    setSelectedArea(newValue.area);
                                    setSelectedType(newValue.type);
                                }
                            }}
                            value={null}
                        />
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth>
                            <InputLabel id="area-select-label">
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <LocationOnIcon sx={{ mr: 1, fontSize: '1rem' }} />
                                    בחר עיר
                                </Box>
                            </InputLabel>
                            <Select
                                labelId="area-select-label"
                                value={selectedArea}
                                onChange={(e) => setSelectedArea(e.target.value as string)}
                                label="בחר עיר"
                            >
                                <MenuItem value=""><em>כל הערים</em></MenuItem>
                                <MenuItem value="ירושלים">ירושלים</MenuItem>
                                <MenuItem value="מרכז">מרכז</MenuItem>
                                <MenuItem value="תל אביב">תל אביב</MenuItem>
                                <MenuItem value="נתניה">נתניה</MenuItem>
                                <MenuItem value="רמת גן">רמת גן</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth>
                            <InputLabel id="type-select-label">
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <CategoryIcon sx={{ mr: 1, fontSize: '1rem' }} />
                                    סוג מקום
                                </Box>
                            </InputLabel>
                            <Select
                                labelId="type-select-label"
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value as string)}
                                label="סוג מקום"
                            >
                                <MenuItem value=""><em>כל הסוגים</em></MenuItem>
                                <MenuItem value="מלון">מלון</MenuItem>
                                <MenuItem value="מסעדה">מסעדה</MenuItem>
                                <MenuItem value="פארק">פארק</MenuItem>
                                <MenuItem value="טיילת">טיילת</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} md={2}>
                        <Button 
                            variant="outlined" 
                            fullWidth
                            onClick={clearFilters}
                            sx={{
                                borderColor: '#daa520',
                                color: '#1a1a4e',
                                '&:hover': { borderColor: '#c49619', bgcolor: 'rgba(218, 165, 32, 0.1)' },
                                height: '56px'
                            }}
                        >
                            נקה סינון
                        </Button>
                    </Grid>
                </Grid>
                
                {/* תצוגת פילטרים פעילים */}
                {(selectedArea || selectedType || searchTerm) && (
                    <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {selectedArea && (
                            <Chip 
                                icon={<LocationOnIcon />}
                                label={`עיר: ${selectedArea}`}
                                onDelete={() => setSelectedArea('')}
                                color="primary"
                                variant="outlined"
                            />
                        )}
                        {selectedType && (
                            <Chip 
                                icon={<CategoryIcon />}
                                label={`סוג: ${selectedType}`}
                                onDelete={() => setSelectedType('')}
                                color="primary"
                                variant="outlined"
                            />
                        )}
                        {searchTerm && (
                            <Chip 
                                icon={<SearchIcon />}
                                label={`חיפוש: ${searchTerm}`}
                                onDelete={() => setSearchTerm('')}
                                color="primary"
                                variant="outlined"
                            />
                        )}
                    </Box>
                )}
            </Paper>

            {/* מידע על תוצאות החיפוש */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" color="text.secondary">
                    מציג {displayedLocations.length} מתוך {filteredLocations.length} מקומות
                </Typography>
                {filteredLocations.length === 0 && (
                    <Typography variant="subtitle1" color="error">
                        לא נמצאו תוצאות לחיפוש שלך
                    </Typography>
                )}
            </Box>

            {/* תצוגת הכרטיסים */}
            {displayedLocations.length > 0 ? (
                <Grid container spacing={3}>
                    {displayedLocations.map(location => (
                        <Grid item xs={12} sm={6} md={4} key={location.id}>
                            <Card 
                                sx={{ 
                                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                                    borderRadius: '24px',
                                    overflow: 'hidden',
                                    transition: 'transform 0.3s, box-shadow 0.3s',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: '0 15px 30px rgba(0,0,0,0.15)',
                                    }
                                }}
                            >
                                <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                                    <img
                                        src={location.image}
                                        alt={location.area}
                                        style={{
                                            width: '100%',
                                            height: '220px',
                                            objectFit: 'cover',
                                            transition: 'transform 0.5s',
                                        }}
                                        onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05)' }}
                                        onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
                                    />
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 10,
                                            left: 10,
                                            backgroundColor: 'rgba(15, 16, 51, 0.8)',
                                            color: 'white',
                                            px: 1.5,
                                            py: 0.5,
                                            borderRadius: '20px',
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {location.area}
                                    </Box>
                                </Box>
                                
                                <CardContent sx={{ bgcolor: '#ffffff', p: 3 }}>
                                    <Typography 
                                        variant="h5" 
                                        sx={{ 
                                            fontWeight: 'bold', 
                                            color: '#1a1a4e',
                                            mb: 2,
                                            height: '60px',
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}
                                    >
                                        {location.type}
                                    </Typography>
                                    
                                    <Divider sx={{ mb: 2 }} />
                                    
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <IconButton 
                                                onClick={() => handleLike(location.id)} 
                                                sx={{ 
                                                    color: '#ff5e85', 
                                                    '&:hover': { bgcolor: 'rgba(255, 94, 133, 0.1)' },
                                                    mr: 1
                                                }}
                                            >
                                                <FavoriteIcon />
                                            </IconButton>
                                            <Typography variant="body2" fontWeight="bold">
                                                {location.likes}
                                            </Typography>
                                        </Box>
                                        
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <IconButton 
                                                onClick={() => handleMeet(location.id)} 
                                                sx={{ 
                                                    color: '#1a1a4e', 
                                                    '&:hover': { bgcolor: 'rgba(26, 26, 78, 0.1)' },
                                                    mr: 1
                                                }}
                                            >
                                                <PeopleIcon />
                                            </IconButton>
                                            <Typography variant="body2" fontWeight="bold">
                                                {location.meets}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Button 
                                        variant="contained" 
                                        fullWidth
                                        startIcon={<InfoIcon />}
                                        onClick={() => handleOpenDetails(location)}
                                        sx={{ 
                                            bgcolor: '#daa520', 
                                            color: '#fff',
                                            '&:hover': { bgcolor: '#c49619' },
                                            borderRadius: '30px',
                                            py: 1
                                        }}
                                    >
                                        פרטים נוספים
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Paper 
                    elevation={0}
                    sx={{ 
                        p: 5, 
                        textAlign: 'center', 
                        bgcolor: 'rgba(218, 165, 32, 0.05)',
                        borderRadius: '16px',
                        border: '1px dashed #daa520'
                    }}
                >
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        לא נמצאו תוצאות מתאימות
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        נסו לשנות את פרמטרי החיפוש או לנקות את הסינונים
                    </Typography>
                    <Button 
                        variant="outlined" 
                        onClick={clearFilters}
                        sx={{ 
                            mt: 2,
                            borderColor: '#daa520',
                            color: '#1a1a4e',
                            '&:hover': { borderColor: '#c49619', bgcolor: 'rgba(218, 165, 32, 0.1)' }
                        }}
                    >
                        נקה סינונים
                    </Button>
                </Paper>
            )}

            {/* כפתורי דפדוף */}
            {displayedLocations.length > 0 && (
                <Stack 
                    direction="row" 
                    spacing={2} 
                    sx={{ 
                        mt: 5, 
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Button 
                        variant="outlined"
                        disabled={currentPage === 0} 
                        onClick={() => setCurrentPage(currentPage - 1)}
                        startIcon={<ArrowForwardIcon />}
                        sx={{
                            borderColor: currentPage === 0 ? 'rgba(0, 0, 0, 0.12)' : '#daa520',
                            color: currentPage === 0 ? 'rgba(0, 0, 0, 0.26)' : '#1a1a4e',
                            '&:hover': { 
                                borderColor: '#c49619', 
                                bgcolor: 'rgba(218, 165, 32, 0.1)' 
                            },
                            borderRadius: '20px',
                            minWidth: '120px'
                        }}
                    >
                        הקודם
                    </Button>

                    <Box sx={{ px: 2 }}>
                        <Typography variant="body1" fontWeight="medium">
                            {currentPage + 1} מתוך {totalPages}
                        </Typography>
                    </Box>
                    
                    <Button 
                        variant="contained"
                        disabled={currentPage === totalPages - 1 || loading} 
                        onClick={handleNextPage}
                        endIcon={!loading && <ArrowBackIcon />}
                        sx={{
                            bgcolor: (currentPage === totalPages - 1 || loading) ?
                                'rgba(0, 0, 0, 0.12)' : '#daa520',
                            color: '#fff',
                            '&:hover': { bgcolor: '#c49619' },
                            borderRadius: '20px',
                            minWidth: '120px'
                        }}
                    >
                        {loading ? <LoadingIndicator /> : 'הבא'}
                    </Button>
                </Stack>
            )}

            {/* הערה תחתונה */}
            <Box sx={{ mt: 6, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                    * המקומות המוצגים הם בהמלצת משתמשים אחרים ומומלץ לבדוק התאמה אישית לפני ההגעה
                </Typography>
            </Box>

            {selectedPlace && (
                <PlaceDetailsDialog
                    open={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                    place={selectedPlace}
                />
            )}
        </Container>
    );
};

export default MeetingPlaces;
