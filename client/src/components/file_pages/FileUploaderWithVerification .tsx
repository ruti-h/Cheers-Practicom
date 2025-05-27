// React Component with ID Verification
import React, { useState } from 'react';
import axios from 'axios';

interface VerificationResult {
  isVerified: boolean;
  message: string;
  details: {
    IdNumber: boolean;
    FullName: boolean;
    BirthDate: boolean;
    IdValid: boolean;
  };
}

interface ExtractedData {
  idNumber: string;
  fullName: string;
  birthDate: string;
  isValid: boolean;
}

interface FileUploadResponse {
  success: boolean;
  rawText: string;
  extractedData: ExtractedData;
  verificationResult: VerificationResult;
}

interface CandidateData {
  firstName: string;
  lastName: string;
  tz: string;
  burnDate: string; // ISO date string
}

const FileUploaderWithVerification = () => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [candidateData, setCandidateData] = useState<CandidateData>({
    firstName: '',
    lastName: '',
    tz: '',
    burnDate: ''
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      // איפוס תוצאות קודמות
      setVerificationResult(null);
      setExtractedData(null);
    }
  };

  const handleCandidateDataChange = (field: keyof CandidateData, value: string) => {
    setCandidateData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setProgress(0);

    try {
      // שלב 1: קבלת Presigned URL מהשרת
      const response = await axios.get('https://localhost:7215/api/upload/presigned-url', {
        params: { fileName: file.name }
      });

      const presignedUrl = response.data.url;

      // שלב 2: העלאת הקובץ ישירות ל-S3
      await axios.put(presignedUrl, file, {
        headers: {
          'Content-Type': file.type,
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setProgress(percent);
        },
      });

      alert('הקובץ הועלה בהצלחה!');
    } catch (error) {
      console.error('שגיאה בהעלאה:', error);
      alert('שגיאה בהעלאת הקובץ');
    } finally {
      setIsUploading(false);
    }
  };

  const handleVerifyId = async () => {
    if (!file || !candidateData.firstName || !candidateData.lastName || !candidateData.tz) {
      alert('יש למלא את כל הפרטים הנדרשים ולהעלות קובץ');
      return;
    }

    setIsVerifying(true);

    try {
      // יצירת אובייקט מועמד לשליחה
      const candidate = {
        FirstName: candidateData.firstName,
        LastName: candidateData.lastName,
        Tz: candidateData.tz,
        BurnDate: new Date(candidateData.burnDate)
      };

      // שליחת בקשה לאימות
      const response = await axios.post<FileUploadResponse>(
        'https://localhost:7215/api/upload/verify-candidate-id',
        {
          IdCardFileName: file.name,
          Candidate: candidate
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setExtractedData(response.data.extractedData);
        setVerificationResult(response.data.verificationResult);
      }

    } catch (error) {
      console.error('שגיאה באימות:', error);
      alert('שגיאה באימות תעודת הזהות');
    } finally {
      setIsVerifying(false);
    }
  };

  const renderVerificationResults = () => {
    if (!verificationResult || !extractedData) return null;

    return (
      <div style={{ 
        marginTop: '20px', 
        padding: '20px', 
        border: `2px solid ${verificationResult.isVerified ? '#4caf50' : '#f44336'}`,
        borderRadius: '8px',
        backgroundColor: verificationResult.isVerified ? '#e8f5e8' : '#ffeaea'
      }}>
        <h3 style={{ color: verificationResult.isVerified ? '#2e7d32' : '#c62828' }}>
          {verificationResult.isVerified ? '✅ אימות הצליח' : '❌ אימות נכשל'}
        </h3>
        
        <p><strong>הודעה:</strong> {verificationResult.message}</p>
        
        <div style={{ marginTop: '15px' }}>
          <h4>נתונים שחולצו מתעודת הזהות:</h4>
          <ul>
            <li><strong>מספר ת.ז:</strong> {extractedData.idNumber || 'לא זוהה'}</li>
            <li><strong>שם מלא:</strong> {extractedData.fullName || 'לא זוהה'}</li>
            <li><strong>תאריך לידה:</strong> {extractedData.birthDate || 'לא זוהה'}</li>
            <li><strong>ת.ז תקינה:</strong> {extractedData.isValid ? 'כן' : 'לא'}</li>
          </ul>
        </div>

        <div style={{ marginTop: '15px' }}>
          <h4>פירוט בדיקות:</h4>
          <ul>
            <li style={{ color: verificationResult.details.IdNumber ? '#4caf50' : '#f44336' }}>
              {verificationResult.details.IdNumber ? '✅' : '❌'} מספר תעודת זהות
            </li>
            <li style={{ color: verificationResult.details.FullName ? '#4caf50' : '#f44336' }}>
              {verificationResult.details.FullName ? '✅' : '❌'} שם מלא
            </li>
            <li style={{ color: verificationResult.details.BirthDate ? '#4caf50' : '#f44336' }}>
              {verificationResult.details.BirthDate ? '✅' : '❌'} תאריך לידה
            </li>
            <li style={{ color: verificationResult.details.IdValid ? '#4caf50' : '#f44336' }}>
              {verificationResult.details.IdValid ? '✅' : '❌'} תקינות מספר ת.ז
            </li>
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>העלאת תעודת זהות ואימות פרטים</h2>
      
      {/* פרטי המועמד */}
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>פרטי המועמד</h3>
        <div style={{ display: 'grid', gap: '10px' }}>
          <input
            type="text"
            placeholder="שם פרטי"
            value={candidateData.firstName}
            onChange={(e) => handleCandidateDataChange('firstName', e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <input
            type="text"
            placeholder="שם משפחה"
            value={candidateData.lastName}
            onChange={(e) => handleCandidateDataChange('lastName', e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <input
            type="text"
            placeholder="מספר תעודת זהות"
            value={candidateData.tz}
            onChange={(e) => handleCandidateDataChange('tz', e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <input
            type="date"
            placeholder="תאריך לידה"
            value={candidateData.burnDate}
            onChange={(e) => handleCandidateDataChange('burnDate', e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
      </div>

      {/* העלאת קובץ */}
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="file" 
          onChange={handleFileChange}
          accept="image/*"
          style={{ marginBottom: '10px' }}
        />
        <br />
        <button 
          onClick={handleUpload}
          disabled={!file || isUploading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: !file || isUploading ? 'not-allowed' : 'pointer',
            opacity: !file || isUploading ? 0.6 : 1
          }}
        >
          {isUploading ? 'מעלה...' : 'העלה קובץ'}
        </button>
        
        {progress > 0 && (
          <div style={{ marginTop: '10px' }}>
            <div style={{ backgroundColor: '#f0f0f0', borderRadius: '4px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  width: `${progress}%`, 
                  height: '20px', 
                  backgroundColor: '#4caf50',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '12px'
                }}
              >
                {progress}%
              </div>
            </div>
          </div>
        )}
      </div>

      {/* כפתור אימות */}
      <button 
        onClick={handleVerifyId}
        disabled={!file || isVerifying || !candidateData.firstName || !candidateData.lastName || !candidateData.tz}
        style={{
          padding: '12px 24px',
          backgroundColor: '#4caf50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '16px',
          cursor: (!file || isVerifying || !candidateData.firstName || !candidateData.lastName || !candidateData.tz) ? 'not-allowed' : 'pointer',
          opacity: (!file || isVerifying || !candidateData.firstName || !candidateData.lastName || !candidateData.tz) ? 0.6 : 1,
          width: '100%'
        }}
      >
        {isVerifying ? 'מאמת...' : 'אמת תעודת זהות'}
      </button>

      {/* תוצאות אימות */}
      {renderVerificationResults()}
    </div>
  );
};

export default FileUploaderWithVerification;