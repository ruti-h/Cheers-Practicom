import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  Stack,
  Chip,
  Grid
} from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  AccessTime as TimeIcon,
  Phone as PhoneIcon,
  Language as WebsiteIcon,
  LocalParking as ParkingIcon,
  Restaurant as KosherIcon,
  Accessibility as AccessibilityIcon
} from '@mui/icons-material';

type PlaceDetails = {
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

type PlaceDetailsDialogProps = {
  open: boolean;
  onClose: () => void;
  place: PlaceDetails;
}

const PlaceDetailsDialog = ({ open, onClose, place }: PlaceDetailsDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          p: 2
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2,
        pb: 2,
        '& .MuiTypography-root': {
          fontWeight: 'bold',
          color: '#1a1a4e'
        }
      }}>
        <img 
          src={place.image} 
          alt={place.type}
          style={{ 
            width: '60px', 
            height: '60px', 
            borderRadius: '12px',
            objectFit: 'cover'
          }} 
        />
        <div>
          <Typography variant="h5">{place.type}</Typography>
          <Typography variant="subtitle2" color="text.secondary">
            {place.area}
          </Typography>
        </div>
      </DialogTitle>
      
      <Divider />
      
      <DialogContent>
        <Stack spacing={3}>
          {/* פרטים בסיסיים */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: '#1a1a4e', fontWeight: 'bold' }}>
              פרטים בסיסיים
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MoneyIcon color="primary" />
                  <Typography>{place.priceRange}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TimeIcon color="primary" />
                  <Typography>{place.openingHours}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PhoneIcon color="primary" />
                  <Typography>{place.phone}</Typography>
                </Box>
              </Grid>
              {place.website && (
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WebsiteIcon color="primary" />
                    <Typography>{place.website}</Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>

          {/* תכונות */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: '#1a1a4e', fontWeight: 'bold' }}>
              תכונות המקום
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {place.parking && (
                <Chip 
                  icon={<ParkingIcon />} 
                  label="חניה זמינה"
                  color="primary"
                  variant="outlined"
                />
              )}
              <Chip 
                icon={<KosherIcon />} 
                label={`כשרות: ${place.kosher}`}
                color="primary"
                variant="outlined"
              />
              {place.accessibility && (
                <Chip 
                  icon={<AccessibilityIcon />} 
                  label="נגישות מלאה"
                  color="primary"
                  variant="outlined"
                />
              )}
            </Stack>
          </Box>

          {/* תיאור */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: '#1a1a4e', fontWeight: 'bold' }}>
              תיאור המקום
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              {place.description}
            </Typography>
          </Box>

          {/* סטטיסטיקות */}
          <Box 
            sx={{ 
              display: 'flex', 
              gap: 3, 
              p: 2, 
              bgcolor: 'rgba(218, 165, 32, 0.1)', 
              borderRadius: 2 
            }}
          >
            <Box>
              <Typography variant="h4" color="primary" fontWeight="bold">
                {place.likes}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                אהבו את המקום
              </Typography>
            </Box>
            <Box>
              <Typography variant="h4" color="primary" fontWeight="bold">
                {place.meets}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                פגישות התקיימו
              </Typography>
            </Box>
          </Box>
        </Stack>
      </DialogContent>
      
      <DialogActions>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{ borderRadius: '20px' }}
        >
          סגור
        </Button>
        <Button 
          variant="contained"
          sx={{ 
            bgcolor: '#daa520',
            '&:hover': { bgcolor: '#c49619' },
            borderRadius: '20px'
          }}
        >
          צור קשר
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PlaceDetailsDialog;