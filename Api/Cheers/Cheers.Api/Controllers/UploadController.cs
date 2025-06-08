//using System;
//using System.Collections.Generic;
//using System.IO;
//using System.Linq;
//using System.Net.Http;
//using System.Text.RegularExpressions;
//using System.Threading.Tasks;
//using Amazon.S3.Model;
//using Amazon.S3;
//using Cheers.Api.Models;
//using Microsoft.AspNetCore.Http;
//using Microsoft.AspNetCore.Mvc;
//using Tesseract;

//namespace Cheers.Api.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class UploadController : ControllerBase
//    {
//        private readonly IAmazonS3 _s3Client;

//        public UploadController(IAmazonS3 s3Client)
//        {
//            _s3Client = s3Client;
//        }

//        [HttpPost("verify-candidate-id")]
//        public async Task<IActionResult> VerifyCandidateId([FromBody] CandidateVerificationRequest request)
//        {
//            // וידוא שיש נתונים להשוואה
//            if (request == null || string.IsNullOrEmpty(request.IdCardFileName) || request.Candidate == null)
//            {
//                return BadRequest("Missing required data for verification.");
//            }

//            // קבלת ה-URL להורדה באמצעות S3
//            var s3Request = new GetPreSignedUrlRequest
//            {
//                BucketName = "cheers-aplication", // או שם ה-bucket שאתה משתמש בו
//                Key = request.IdCardFileName,
//                Verb = HttpVerb.GET,
//                Expires = DateTime.UtcNow.AddMinutes(5)
//            };

//            string imageUrl = _s3Client.GetPreSignedURL(s3Request);

//            if (string.IsNullOrEmpty(imageUrl))
//            {
//                return BadRequest("No image URL found for the provided file name.");
//            }

//            string tempFilePath = null;

//            try
//            {
//                // הורדת התמונה מה-URL
//                using (var httpClient = new HttpClient())
//                {
//                    var imageBytes = await httpClient.GetByteArrayAsync(imageUrl);

//                    // יצירת נתיב לקובץ זמני
//                    tempFilePath = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString() + ".jpg");

//                    // שמירת התמונה בשרת
//                    await System.IO.File.WriteAllBytesAsync(tempFilePath, imageBytes);

//                    // קריאת הטקסט מהתמונה
//                    string rawText = ExtractTextFromImage(tempFilePath);

//                    // עיבוד הטקסט וחילוץ נתונים
//                    var extractedData = ExtractIdCardData(rawText);

//                    // השוואת הנתונים מהמועמד עם הנתונים שחולצו
//                    var verificationResult = VerifyCandidateData(request.Candidate, extractedData);

//                    // החזרת התוצאות
//                    return Ok(new
//                    {
//                        success = true,
//                        rawText = rawText,
//                        extractedData = extractedData,
//                        verificationResult = verificationResult
//                    });
//                }
//            }
//            catch (HttpRequestException ex)
//            {
//                return StatusCode(503, $"Failed to download image: {ex.Message}");
//            }
//            catch (TesseractException ex)
//            {
//                return StatusCode(500, $"OCR processing error: {ex.Message}");
//            }
//            catch (Exception ex)
//            {
//                return StatusCode(500, $"Error processing image: {ex.Message}");
//            }
//            finally
//            {
//                // מחיקת הקובץ הזמני תמיד אם הוא קיים
//                if (tempFilePath != null && System.IO.File.Exists(tempFilePath))
//                {
//                    try
//                    {
//                        System.IO.File.Delete(tempFilePath);
//                    }
//                    catch (Exception ex)
//                    {
//                        Console.WriteLine($"Failed to delete temp file: {ex.Message}");
//                    }
//                }
//            }
//        }

//        private string ExtractTextFromImage(string imagePath)
//        {
//            // נתיב לתיקיית tessdata
//            string tessdataPath = Path.Combine(Directory.GetCurrentDirectory(), "tessdata");

//            // בדיקה שהתיקייה קיימת
//            if (!Directory.Exists(tessdataPath))
//            {
//                throw new DirectoryNotFoundException($"Tesseract data directory not found at {tessdataPath}");
//            }

//            using (var engine = new TesseractEngine(tessdataPath, "heb", EngineMode.Default))
//            {
//                // שיפור ביצועי OCR לעברית
//                engine.SetVariable("tessedit_char_whitelist", "אבגדהוזחטיכלמנסעפצקרשתםןץףך0123456789-.:/ ");

//                using (var img = Pix.LoadFromFile(imagePath))
//                {
//                    using (var page = engine.Process(img))
//                    {
//                        string text = page.GetText();

//                        // בדיקה שהטקסט לא ריק
//                        if (string.IsNullOrWhiteSpace(text))
//                        {
//                            return "No text was detected in the image.";
//                        }

//                        return text.Trim();
//                    }
//                }
//            }
//        }

//        private IdCardData ExtractIdCardData(string text)
//        {
//            var data = new IdCardData();

//            // חילוץ מספר תעודת זהות
//            var idMatch = Regex.Match(text, @"\b\d{9}\b");
//            if (idMatch.Success)
//            {
//                data.IdNumber = idMatch.Value;
//                data.IsValid = ValidateIsraeliId(data.IdNumber);
//            }
//            else
//            {
//                // חיפוש אלטרנטיבי למספר ת.ז.
//                var idAlternativeMatch = Regex.Match(text, @"[מס|מספר].*?[זהות|ת\.?ז\.?]:?\s*(\d{9})");
//                if (idAlternativeMatch.Success && idAlternativeMatch.Groups.Count > 1)
//                {
//                    data.IdNumber = idAlternativeMatch.Groups[1].Value;
//                    data.IsValid = ValidateIsraeliId(data.IdNumber);
//                }
//            }

//            // חילוץ שם פרטי ושם משפחה
//            var nameMatch = Regex.Match(text, @"שם:?\s*([א-ת\s]+)");
//            if (nameMatch.Success && nameMatch.Groups.Count > 1)
//            {
//                data.FullName = nameMatch.Groups[1].Value.Trim();
//            }

//            // חילוץ תאריך לידה
//            var birthDateMatch = Regex.Match(text, @"\b(\d{2})[\/\.\-](\d{2})[\/\.\-](\d{4})\b");
//            if (birthDateMatch.Success)
//            {
//                data.BirthDate = $"{birthDateMatch.Groups[1]}.{birthDateMatch.Groups[2]}.{birthDateMatch.Groups[3]}";
//            }
//            else
//            {
//                // חיפוש אלטרנטיבי לתאריך לידה
//                var birthDateAlternativeMatch = Regex.Match(text, @"תאריך\s*לידה:?\s*(\d{2})[\/\.\-](\d{2})[\/\.\-](\d{4})");
//                if (birthDateAlternativeMatch.Success && birthDateAlternativeMatch.Groups.Count > 3)
//                {
//                    data.BirthDate = $"{birthDateAlternativeMatch.Groups[1]}.{birthDateAlternativeMatch.Groups[2]}.{birthDateAlternativeMatch.Groups[3]}";
//                }
//            }

//            return data;
//        }

//        // פונקציה להשוואת הנתונים של המועמד עם הנתונים שחולצו מתעודת הזהות
//        private VerificationResult VerifyCandidateData(CandidateModel candidate, IdCardData extractedData)
//        {
//            var result = new VerificationResult
//            {
//                IsVerified = true, // נתחיל מהנחה שהכל מאומת
//                Details = new Dictionary<string, bool>()
//            };

//            // השוואת מספר תעודת זהות
//            bool idMatch = !string.IsNullOrEmpty(extractedData.IdNumber) &&
//                          !string.IsNullOrEmpty(candidate.Tz) &&
//                          extractedData.IdNumber.Trim() == candidate.Tz.Trim();

//            result.Details["IdNumber"] = idMatch;

//            // בניית השם המלא מהמועמד
//            string candidateFullName = $"{candidate.FirstName} {candidate.LastName}".Trim();

//            // השוואת שם מלא - נבצע השוואה גמישה
//            bool nameMatch = false;
//            if (!string.IsNullOrEmpty(extractedData.FullName) && !string.IsNullOrEmpty(candidateFullName))
//            {
//                // ניקוי רווחים מיותרים והשוואה מקלה
//                string extractedName = CleanString(extractedData.FullName);
//                string inputName = CleanString(candidateFullName);

//                // בדיקה אם השם המוזן מכיל את השם שחולץ או להפך, או שהשמות דומים
//                nameMatch = extractedName.Contains(inputName) ||
//                           inputName.Contains(extractedName) ||
//                           // השוואה מדויקת
//                           extractedName == inputName ||
//                           // בדיקה אם השם הפרטי והשם המשפחה מופיעים בנפרד
//                           (extractedName.Contains(CleanString(candidate.FirstName)) &&
//                            extractedName.Contains(CleanString(candidate.LastName)));
//            }

//            result.Details["FullName"] = nameMatch;

//            // השוואת תאריך לידה - אם יש תאריך לידה בתעודה
//            bool birthDateMatch = false;
//            if (!string.IsNullOrEmpty(extractedData.BirthDate))
//            {
//                string candidateBirthDate = candidate.BurnDate.ToString("dd.MM.yyyy");
//                birthDateMatch = NormalizeDateFormat(extractedData.BirthDate) == NormalizeDateFormat(candidateBirthDate);
//            }

//            result.Details["BirthDate"] = birthDateMatch;

//            // וידוא שתעודת הזהות תקינה
//            result.Details["IdValid"] = extractedData.IsValid;

//            // קביעה אם האימות הצליח - נגדיר שהוא מצליח אם מספר תעודת הזהות וגם השם מתאימים
//            // במקרה זה, אנחנו מתמקדים בת"ז ובשם כפי שביקשת
//            result.IsVerified = idMatch && nameMatch && extractedData.IsValid;

//            // הערה אישית למקרה שיש אי התאמה
//            if (!result.IsVerified)
//            {
//                if (!idMatch)
//                    result.Message = "מספר תעודת הזהות שהזנת אינו תואם למספר שמופיע בתעודה.";
//                else if (!nameMatch)
//                    result.Message = "השם שהזנת אינו תואם לשם שמופיע בתעודה.";
//                else if (!extractedData.IsValid)
//                    result.Message = "מספר תעודת הזהות שזוהה אינו תקין.";
//                else
//                    result.Message = "הפרטים שהוזנו אינם תואמים למידע שזוהה בתעודת הזהות.";
//            }
//            else
//            {
//                result.Message = "הפרטים אומתו בהצלחה!";
//            }

//            return result;
//        }

//        private bool ValidateIsraeliId(string idNumber)
//        {
//            // אימות בסיסי - וידוא שיש בדיוק 9 ספרות
//            if (string.IsNullOrEmpty(idNumber) || idNumber.Length != 9 || !idNumber.All(char.IsDigit))
//            {
//                return false;
//            }

//            // אלגוריתם ספרת ביקורת לת.ז. ישראלית
//            int[] weights = { 1, 2, 1, 2, 1, 2, 1, 2, 1 };
//            int sum = 0;

//            for (int i = 0; i < 9; i++)
//            {
//                int digit = int.Parse(idNumber[i].ToString());
//                int product = digit * weights[i];
//                sum += (product > 9) ? product - 9 : product;
//            }

//            return sum % 10 == 0;
//        }

//        // עזר - ניקוי מחרוזת לצורך השוואה
//        private string CleanString(string input)
//        {
//            if (string.IsNullOrEmpty(input))
//                return string.Empty;

//            // הסרת רווחים מיותרים ואותיות סופיות
//            return Regex.Replace(input, @"\s+", " ")
//                .Replace("ם", "מ")
//                .Replace("ן", "נ")
//                .Replace("ץ", "צ")
//                .Replace("ף", "פ")
//                .Replace("ך", "כ")
//                .Trim();
//        }

//        // עזר - נרמול פורמט תאריך לצורך השוואה
//        private string NormalizeDateFormat(string date)
//        {
//            if (string.IsNullOrEmpty(date))
//                return string.Empty;

//            // הסרת כל התווים שאינם ספרות
//            string digitsOnly = new string(date.Where(char.IsDigit).ToArray());

//            // אם יש לנו בדיוק 8 ספרות, זה כנראה תאריך בפורמט DDMMYYYY
//            if (digitsOnly.Length == 8)
//            {
//                return digitsOnly.Substring(0, 2) + "." +
//                       digitsOnly.Substring(2, 2) + "." +
//                       digitsOnly.Substring(4, 4);
//            }

//            return date.Trim();
//        }
//    }

//    // מחלקה שמייצגת את הנתונים שחולצו מתעודת הזהות
//    public class IdCardData
//    {
//        public string IdNumber { get; set; }
//        public string FullName { get; set; }
//        public string BirthDate { get; set; }
//        public bool IsValid { get; set; }
//    }

//    // מחלקה שמייצגת את תוצאות האימות
//    public class VerificationResult
//    {
//        public bool IsVerified { get; set; }
//        public string Message { get; set; }
//        public Dictionary<string, bool> Details { get; set; }
//    }

//    // מחלקה שמייצגת את הבקשה לאימות מועמד
//    public class CandidateVerificationRequest
//    {
//        public string IdCardFileName { get; set; }
//        public CandidateModel Candidate { get; set; }
//    }
//}

////using Amazon.S3.Model;
////using Amazon.S3;
////using Microsoft.AspNetCore.Http;
////using Microsoft.AspNetCore.Mvc;

////namespace Cheers.Api.Controllers
////{
////    [Route("api/[controller]")]
////    [ApiController]
////    public class UploadController : ControllerBase
////    {
////        private readonly IAmazonS3 _s3Client;
////        public UploadController(IAmazonS3 s3Client)
////        {
////            _s3Client = s3Client;
////        }
////        [HttpGet("presigned-url")]
////        public async Task<IActionResult> GetPresignedUrl([FromQuery] string fileName)
////        {
////            var request = new GetPreSignedUrlRequest
////            {
////                BucketName = "cheers-aplication",
////                Key = fileName,
////                Verb = HttpVerb.PUT,
////                Expires = DateTime.UtcNow.AddMinutes(60),
////                //ContentType = "image/jpeg" // או סוג הקובץ המתאים
////            };
////            string url = _s3Client.GetPreSignedURL(request);
////            return Ok(new { url });
////        }
////    }
//}

using Amazon.S3.Model;
using Amazon.S3;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Cheers.Core.DTOs;

namespace Cheers.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadController : ControllerBase
    {
        private readonly IAmazonS3 _s3Client;

        public UploadController(IAmazonS3 s3Client)
        {
            _s3Client = s3Client;
        }

        [HttpGet("presigned-url")]
        public async Task<IActionResult> GetPresignedUrl([FromQuery] string fileName)
        {
            var request = new GetPreSignedUrlRequest
            {
                BucketName = "cheers-aplication",
                Key = fileName,
                Verb = HttpVerb.PUT,
                Expires = DateTime.UtcNow.AddMinutes(60),
            };
            string url = _s3Client.GetPreSignedURL(request);
            return Ok(new { url });
        }
        [HttpPost("file")]
        public async Task<IActionResult> UploadFile([FromForm] UploadFileRequest request)
        {
            Console.WriteLine("=== Upload file endpoint reached ===");

            try
            {
                var file = request.File;

                if (file == null || file.Length == 0)
                {
                    Console.WriteLine("No file received");
                    return BadRequest("No file uploaded");
                }

                Console.WriteLine($"File: {file.FileName}, Size: {file.Length}");

                var fileName = file.FileName;
                var key = $"{DateTime.UtcNow:yyyyMMdd}/{Guid.NewGuid()}_{fileName}";

                var putRequest = new PutObjectRequest
                {
                    BucketName = "cheers-aplication",
                    Key = key,
                    InputStream = file.OpenReadStream(),
                    ContentType = file.ContentType,
                    ServerSideEncryptionMethod = ServerSideEncryptionMethod.AES256
                };

                var response = await _s3Client.PutObjectAsync(putRequest);
                var fileUrl = $"https://cheers-aplication.s3.us-west-2.amazonaws.com/{key}";

                Console.WriteLine("Upload successful!");

                return Ok(new
                {
                    message = "File uploaded successfully",
                    fileName = fileName,
                    key = key,
                    url = fileUrl,
                    etag = response.ETag
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERROR: {ex.Message}");
                return StatusCode(500, new { error = ex.Message });
            }
        }



        [HttpGet("test")]
        public IActionResult Test()
        {
            return Ok(new { message = "Upload controller is working!", time = DateTime.Now });
        }

    }
}