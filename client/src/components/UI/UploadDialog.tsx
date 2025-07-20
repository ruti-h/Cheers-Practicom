import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  LinearProgress,
  Alert,
  TextField,
  Card,
  CardContent
} from '@mui/material';
import { Upload, CloudUpload, Verified, Error as ErrorIcon } from '@mui/icons-material';

// Types
interface IdCardInfo {
  idNumber: string;
  birthDate: string;
  extractedFirstName?: string;
  extractedLastName?: string;
}

interface VerificationResult {
  success: boolean;
  message: string;
  data?: IdCardInfo;
  errors?: string[];
  extractedData?: IdCardInfo;
  ocrSource?: string;
}

interface UploadDialogProps {
  open: boolean;
  onClose: () => void;
  onVerificationSuccess?: (result: VerificationResult) => void;
}

const UploadDialog: React.FC<UploadDialogProps> = ({ 
  open, 
  onClose, 
  onVerificationSuccess 
}) => {
  // State להעלאת קבצים
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  
  // State לאימות ת.ז
  const [showVerification, setShowVerification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expectedIdNumber, setExpectedIdNumber] = useState('');
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [uploadError, setUploadError] = useState<string>('');
  const baseUrl  = import.meta.env.VITE_API_URL;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setUploadedFileName('');
      setShowVerification(false);
      setVerificationResult(null);
      setProgress(0);
      setUploadError('');
    }
  };

  // const handleUpload = async () => {
  //   if (!file) return;

  //   try {
  //     setUploadError('');
  //     console.log('מנסה להתחבר לשרת...');
      
    
  //     console.log(`בודק שרת ב: ${baseUrl}`);
  //     const response = await fetch(`${baseUrl}/upload/presigned-url?fileName=${encodeURIComponent(file.name)}`);
      
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }
      

  //     const data = await response.json();
  //     const presignedUrl = data.url;
  //     console.log('קיבלתי Presigned URL:', presignedUrl);

  //     // העלאה עם progress tracking
  //     const xhr = new XMLHttpRequest();
      
  //     return new Promise<void>((resolve, reject) => {
  //       xhr.upload.addEventListener('progress', (e) => {
  //         if (e.lengthComputable) {
  //           const percent = Math.round((e.loaded * 100) / e.total);
  //           setProgress(percent);
  //         }
  //       });

  //       xhr.addEventListener('load', () => {
  //         if (xhr.status >= 200 && xhr.status < 300) {
  //           setUploadedFileName(file.name);
  //           setShowVerification(true);
  //           resolve();
  //         } else {
  //           reject(new Error(`Upload failed with status: ${xhr.status}`));
  //         }
  //       });

  //       xhr.addEventListener('error', () => {
  //         reject(new Error('Upload failed'));
  //       });

  //       const proxyUrl = presignedUrl.replace('https://cheers-aplication.s3.us-east-1.amazonaws.com', '/api/s3')
  //       xhr.open('PUT', proxyUrl);
        
  //       xhr.setRequestHeader('Content-Type', file.type);
  //       xhr.send(file);
  //     });
      
  //   } catch (error: any) {
  //     console.error('שגיאה בהעלאה:', error);
      
  //     let errorMessage = 'שגיאה בהעלאת הקובץ';
      
  //     if (error.name === 'TypeError' && error.message.includes('fetch')) {
  //       errorMessage = 'השרת לא זמין. וודא שהשרת .NET רץ על הפורט 7215';
  //     } else if (error.message) {
  //       errorMessage = error.message;
  //     }
      
  //     setUploadError(errorMessage);
  //     setProgress(0);
  //   }
  // };

  const handleUpload = async () => {
    if (!file) return;
  
    try {
      setUploadError('');
      console.log('מעלה קובץ דרך השרת...');
      
      // יצירת FormData עם הקובץ
      const formData = new FormData();
      formData.append('File', file);
      
      // העלאה דרך השרת עם progress tracking
      const xhr = new XMLHttpRequest();
      
      return new Promise<void>((resolve, reject) => {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded * 100) / e.total);
            setProgress(percent);
          }
        });
  
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const response = JSON.parse(xhr.responseText);
            setUploadedFileName(file.name);
            setShowVerification(true);
            console.log('קובץ הועלה בהצלחה:', response);
            resolve();
          } else {
            reject(new Error(`Upload failed with status: ${xhr.status}`));
          }
        });
  
        xhr.addEventListener('error', () => {
          reject(new Error('Upload failed'));
        });
  
        // שליחה לשרת שלך (לא ל-S3!)
        xhr.open('POST', `${baseUrl}/Upload/file`);
        xhr.send(formData);
      });
      
    } catch (error: any) {
      console.error('שגיאה בהעלאה:', error);
      
      let errorMessage = 'שגיאה בהעלאת הקובץ';
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'השרת לא זמין. וודא שהשרת .NET רץ על הפורט 7215';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setUploadError(errorMessage);
      setProgress(0);
    }
  };

  const handleVerifyId = async () => {
    if (!uploadedFileName) {
      setUploadError('לא נמצא קובץ מועלה');
      return;
    }

    if (!expectedIdNumber) {
      setUploadError('אנא הכנס מספר ת.ז');
      return;
    }

    if (expectedIdNumber.length !== 9 || !/^\d+$/.test(expectedIdNumber)) {
      setUploadError('מספר ת.ז חייב להכיל 9 ספרות בלבד');
      return;
    }

    setLoading(true);
    setUploadError('');

    try {
      const verificationRequest = {
        fileName: uploadedFileName,
        expectedIdNumber
      };

      console.log('שולח בקשה לאימות:', verificationRequest);

      const response = await fetch(`${baseUrl}/Download/verify-id-hybrid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(verificationRequest)
      });

      const result: VerificationResult = await response.json();
      
      console.log('✅ תגובה מהשרת:', result);
      setVerificationResult(result);
      
      // אם האימות הצליח, קרא לפונקציית callback
      if (result.success && onVerificationSuccess) {
        onVerificationSuccess(result);
      }
      
    } catch (error: any) {
      console.error('❌ שגיאה באימות ת.ז:', error);
      
      let errorMessage = 'שגיאה באימות ת.ז';
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'השרת לא זמין. וודא שהשרת .NET רץ על הפורט 7215';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setVerificationResult({
        success: false,
        message: errorMessage,
        errors: [errorMessage]
      });
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setFile(null);
    setUploadedFileName('');
    setShowVerification(false);
    setExpectedIdNumber('');
    setVerificationResult(null);
    setProgress(0);
    setUploadError('');
  };

  const handleClose = () => {
    resetAll();
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '500px' }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: 'secondary.main', 
        color: 'primary.main',
        textAlign: 'center',
        fontWeight: 'bold'
      }}>
        <Upload sx={{ mr: 1, verticalAlign: 'middle' }} />
        העלאה ואימות תעודת זהות
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* שגיאות כלליות */}
        {uploadError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {uploadError}
          </Alert>
        )}

        {/* חלק העלאת הקובץ */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              שלב 1: העלאת תמונת תעודת זהות
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<CloudUpload />}
                  sx={{ mr: 2 }}
                >
                  בחר קובץ
                </Button>
              </label>
              
              <Button
                onClick={handleUpload}
                disabled={!file || progress > 0}
                variant="contained"
                sx={{ 
                  bgcolor: 'secondary.main',
                  color: 'primary.main',
                  '&:hover': { bgcolor: 'secondary.dark' }
                }}
              >
                העלה תמונה
              </Button>
            </Box>

            {file && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                קובץ נבחר: {file.name}
              </Typography>
            )}

            {progress > 0 && progress < 100 && (
              <Box sx={{ mb: 2 }}>
                <LinearProgress variant="determinate" value={progress} />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  התקדמות: {progress}%
                </Typography>
              </Box>
            )}

            {uploadedFileName && (
              <Alert severity="success" sx={{ mt: 2 }}>
                ✓ קובץ הועלה בהצלחה: {uploadedFileName}
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* חלק אימות ת.ז */}
        {showVerification && uploadedFileName && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                שלב 2: אימות תעודת זהות
              </Typography>

              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>💡 זיהוי אוטומטי:</strong> המערכת משתמשת בשני מנועי זיהוי בו-זמנית לדיוק מקסימלי
                </Typography>
                <Box sx={{ mt: 1, fontSize: '0.875rem' }}>
                  • <strong>Azure OCR</strong> - מצוין לזיהוי מספרי ת.ז ותאריכים<br/>
                  • <strong>Tesseract OCR</strong> - מצוין לזיהוי שמות בעברית
                </Box>
              </Alert>

              <TextField
                fullWidth
                label="מספר תעודת זהות (9 ספרות)"
                value={expectedIdNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 9) {
                    setExpectedIdNumber(value);
                  }
                }}
                disabled={loading}
                inputProps={{ maxLength: 9, dir: 'ltr' }}
                sx={{ mb: 2 }}
                variant="outlined"
              />

              <Button
                onClick={handleVerifyId}
                disabled={loading || !expectedIdNumber || expectedIdNumber.length !== 9}
                variant="contained"
                fullWidth
                sx={{ 
                  bgcolor: 'primary.main',
                  '&:hover': { bgcolor: 'primary.dark' },
                  py: 1.5
                }}
                startIcon={loading ? undefined : <Verified />}
              >
                {loading ? 'מאמת...' : 'אמת ת.ז (זיהוי אוטומטי)'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* תוצאות האימות */}
        {verificationResult && (
          <Alert 
            severity={verificationResult.success ? 'success' : 'error'} 
            sx={{ mt: 3 }}
            icon={verificationResult.success ? <Verified /> : <ErrorIcon />}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              {verificationResult.success ? '✅ אימות הצליח!' : '❌ אימות נכשל!'}
            </Typography>
            <Typography variant="body2">
              {verificationResult.success 
                ? 'תעודת הזהות אומתה בהצלחה. ניתן להמשיך במילוי הטופס.'
                : 'לא הצלחנו לאמת את תעודת הזהות. אנא נסה שוב או פנה לתמיכה.'
              }
            </Typography>
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button onClick={resetAll} disabled={loading}>
          התחל מחדש
        </Button>
        <Button 
          onClick={handleClose} 
          variant={verificationResult?.success ? 'contained' : 'outlined'}
          disabled={loading}
          sx={verificationResult?.success ? {
            bgcolor: 'primary.main',
            '&:hover': { bgcolor: 'primary.dark' }
          } : {}}
        >
          {verificationResult?.success ? 'סיום והמשך' : 'סגור'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadDialog;