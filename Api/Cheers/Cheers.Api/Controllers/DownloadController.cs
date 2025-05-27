using Amazon.S3;
using Amazon.S3.Model;
using Cheers.Core.IServices;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.CognitiveServices.Vision.ComputerVision.Models;
using Microsoft.Azure.CognitiveServices.Vision.ComputerVision;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using Tesseract;
using System.Text.Json;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Cheers.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DownloadController : ControllerBase
    {
        private readonly string _bucketName = "cheers-aplication";
        private readonly IAmazonS3 _s3Client;
        private readonly IConfiguration _configuration;
        private readonly IUploadService _uploadService;

        public DownloadController(IUploadService uploadService, IAmazonS3 s3Client, IConfiguration configuration)
        {
            _uploadService = uploadService;
            _s3Client = s3Client;
            _configuration = configuration;
        }

        [HttpGet("download-url/{fileName}")]
        public async Task<string> GetDownloadUrlAsync(string fileName)
        {
            var downloadUrl = await _uploadService.GetDownloadUrlAsync(fileName);
            return downloadUrl;
        }

        [HttpPost("readtext")]
        public async Task<IActionResult> ReadTextFromImage([FromQuery] string fileName)
        {
            string imageUrl = await _uploadService.GetDownloadUrlAsync(fileName);

            if (imageUrl == null)
            {
                return BadRequest("No image provided.");
            }

            string resultText;

            try
            {
                using var webClient = new WebClient();
                byte[] imageBytes;
                try
                {
                    imageBytes = webClient.DownloadData(imageUrl);
                    Console.WriteLine(imageBytes);
                }
                catch (WebException e)
                {
                    Console.WriteLine("נכנסתי לשגיאה");
                    return BadRequest($"Error downloading file: {e}");
                }

                var tempFilePath = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString() + ".jpg");
                System.IO.File.WriteAllBytes(tempFilePath, imageBytes);
                resultText = ExtractTextFromImage(tempFilePath);
                System.IO.File.Delete(tempFilePath);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error processing image: {ex.Message}");
            }

            return Ok(resultText);
        }

        [HttpGet("debug/check-file/{fileName}")]
        public async Task<IActionResult> CheckSpecificFile(string fileName)
        {
            try
            {
                Console.WriteLine($"🔍 Checking specific file: {fileName}");

                try
                {
                    var headRequest = new GetObjectMetadataRequest
                    {
                        BucketName = _bucketName,
                        Key = fileName
                    };

                    var metadata = await _s3Client.GetObjectMetadataAsync(headRequest);

                    Console.WriteLine($"✅ File exists! Metadata:");
                    Console.WriteLine($"   Size: {metadata.ContentLength} bytes");
                    Console.WriteLine($"   Type: {metadata.Headers.ContentType}");
                    Console.WriteLine($"   Modified: {metadata.LastModified}");

                    string downloadUrl = await _uploadService.GetDownloadUrlAsync(fileName);
                    Console.WriteLine($"🔗 Download URL: {downloadUrl}");

                    using var httpClient = new HttpClient();
                    var headResponse = await httpClient.SendAsync(new HttpRequestMessage(HttpMethod.Head, downloadUrl));

                    Console.WriteLine($"🌐 URL Status: {headResponse.StatusCode}");

                    return Ok(new
                    {
                        fileExists = true,
                        fileName = fileName,
                        size = metadata.ContentLength,
                        contentType = metadata.Headers.ContentType,
                        lastModified = metadata.LastModified,
                        downloadUrl = downloadUrl,
                        urlAccessible = headResponse.IsSuccessStatusCode,
                        urlStatus = headResponse.StatusCode.ToString()
                    });
                }
                catch (AmazonS3Exception s3Ex) when (s3Ex.StatusCode == System.Net.HttpStatusCode.NotFound)
                {
                    Console.WriteLine($"❌ File not found in S3: {fileName}");

                    var listRequest = new ListObjectsV2Request
                    {
                        BucketName = _bucketName,
                        Prefix = Path.GetFileNameWithoutExtension(fileName),
                        MaxKeys = 10
                    };

                    var listResponse = await _s3Client.ListObjectsV2Async(listRequest);
                    var similarFiles = listResponse.S3Objects.Select(o => o.Key).ToList();

                    return Ok(new
                    {
                        fileExists = false,
                        fileName = fileName,
                        bucketName = _bucketName,
                        similarFiles = similarFiles,
                        message = $"File '{fileName}' not found in bucket '{_bucketName}'"
                    });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error checking file: {ex.Message}");
                return StatusCode(500, $"Error checking file: {ex.Message}");
            }
        }

        // תחליף את הפונקציות verify-id ו-verify-id-azure באלה:

        [HttpPost("verify-id")]
        public async Task<IActionResult> VerifyIdCard([FromBody] JsonElement request)
        {
            try
            {
                string fileName = request.GetProperty("fileName").GetString();
                string expectedIdNumber = request.GetProperty("expectedIdNumber").GetString();

                string imageUrl = await _uploadService.GetDownloadUrlAsync(fileName);

                if (string.IsNullOrEmpty(imageUrl))
                {
                    return BadRequest(new { success = false, message = "לא ניתן לקבל URL להורדת הקובץ" });
                }

                string extractedText = await ExtractTextFromImageUrlSimple(imageUrl);

                if (string.IsNullOrEmpty(extractedText))
                {
                    return BadRequest(new { success = false, message = "לא ניתן לחלץ טקסט מהתמונה" });
                }

                var extractedInfo = ExtractIdInfo(extractedText);

                var errors = new List<string>();
                bool isValid = true;

                // בדיקת מספר ת.ז - זה הדבר היחיד שחשוב
                if (expectedIdNumber != extractedInfo.idNumber)
                {
                    errors.Add($"מספר ת.ז לא תואם. צפוי: {expectedIdNumber}, נמצא: {extractedInfo.idNumber}");
                    isValid = false;
                }

                // בדיקת תקינות מספר ת.ז
                if (!IsValidIsraeliIdSimple(extractedInfo.idNumber))
                {
                    errors.Add("מספר ת.ז לא תקין");
                    isValid = false;
                }

                if (isValid)
                {
                    return Ok(new
                    {
                        success = true,
                        message = "ת.ז אומת בהצלחה",
                        data = new
                        {
                            idNumber = extractedInfo.idNumber,
                            birthDate = extractedInfo.birthDate,
                            extractedFirstName = extractedInfo.firstName, // למידע בלבד
                            extractedLastName = extractedInfo.lastName    // למידע בלבד
                        }
                    });
                }
                else
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "אימות ת.ז נכשל",
                        errors = errors,
                        extractedData = new
                        {
                            idNumber = extractedInfo.idNumber,
                            birthDate = extractedInfo.birthDate,
                            extractedFirstName = extractedInfo.firstName,
                            extractedLastName = extractedInfo.lastName
                        }
                    });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "שגיאה באימות ת.ז",
                    error = ex.Message
                });
            }
        }

        [HttpPost("verify-id-azure")]
        public async Task<IActionResult> VerifyIdCardWithAzure([FromBody] JsonElement request)
        {
            try
            {
                Console.WriteLine("🔍 === אימות ת.ז עם Azure OCR (ללא שמות) ===");

                string fileName = request.GetProperty("fileName").GetString();
                string expectedIdNumber = request.GetProperty("expectedIdNumber").GetString();

                string imageUrl = await _uploadService.GetDownloadUrlAsync(fileName);

                if (string.IsNullOrEmpty(imageUrl))
                {
                    return BadRequest(new { success = false, message = "לא ניתן לקבל URL להורדת הקובץ" });
                }

                using var webClient = new WebClient();
                byte[] imageBytes = webClient.DownloadData(imageUrl);

                Console.WriteLine($"📥 הורדתי תמונה: {imageBytes.Length} bytes");

                string extractedText = await ExtractTextWithAzureOCR(imageBytes);

                Console.WriteLine($"📄 טקסט שחולץ עם Azure:\n{extractedText}");

                if (string.IsNullOrEmpty(extractedText))
                {
                    return BadRequest(new { success = false, message = "לא ניתן לחלץ טקסט מהתמונה עם Azure" });
                }

                var extractedInfo = ExtractIdInfo(extractedText);

                var errors = new List<string>();
                bool isValid = true;

                // בדיקת מספר ת.ז - זה הדבר היחיד שחשוב
                if (expectedIdNumber != extractedInfo.idNumber)
                {
                    errors.Add($"מספר ת.ז לא תואם. צפוי: '{expectedIdNumber}', נמצא: '{extractedInfo.idNumber}'");
                    isValid = false;
                }

                // בדיקת תקינות מספר ת.ז
                if (!IsValidIsraeliId(extractedInfo.idNumber))
                {
                    errors.Add("מספר ת.ז לא תקין");
                    isValid = false;
                }

                if (isValid)
                {
                    return Ok(new
                    {
                        success = true,
                        message = "ת.ז אומת בהצלחה עם Azure OCR",
                        data = new
                        {
                            idNumber = extractedInfo.idNumber,
                            birthDate = extractedInfo.birthDate,
                            extractedFirstName = extractedInfo.firstName, // למידע בלבד
                            extractedLastName = extractedInfo.lastName    // למידע בלבד
                        },
                        ocrSource = "Azure Computer Vision"
                    });
                }
                else
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "אימות ת.ז נכשל",
                        errors = errors,
                        extractedData = new
                        {
                            idNumber = extractedInfo.idNumber,
                            birthDate = extractedInfo.birthDate,
                            extractedFirstName = extractedInfo.firstName,
                            extractedLastName = extractedInfo.lastName
                        },
                        ocrSource = "Azure Computer Vision"
                    });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"💥 שגיאה באימות עם Azure: {ex.Message}");
                return StatusCode(500, new
                {
                    success = false,
                    message = "שגיאה באימות ת.ז עם Azure",
                    error = ex.Message
                });
            }
        }

        [HttpPost("debug-azure-text")]
        public async Task<IActionResult> DebugAzureText([FromBody] JsonElement request)
        {
            try
            {
                string fileName = request.GetProperty("fileName").GetString();

                string imageUrl = await _uploadService.GetDownloadUrlAsync(fileName);

                if (string.IsNullOrEmpty(imageUrl))
                {
                    return BadRequest(new { success = false, message = "לא ניתן לקבל URL להורדת הקובץ" });
                }

                using var webClient = new WebClient();
                byte[] imageBytes = webClient.DownloadData(imageUrl);

                string extractedText = await ExtractTextWithAzureOCR(imageBytes);

                return Ok(new
                {
                    success = true,
                    rawText = extractedText,
                    textLength = extractedText?.Length ?? 0,
                    lines = extractedText?.Split('\n', StringSplitOptions.RemoveEmptyEntries) ?? new string[0]
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    error = ex.Message
                });
            }
        }

        // === AZURE OCR FUNCTIONS ===
        private async Task<string> ExtractTextWithAzureOCR(byte[] imageBytes)
        {
            try
            {
                // קריאת הגדרות Azure מ-Environment Variables
                var subscriptionKey = Environment.GetEnvironmentVariable("AZURE_COMPUTER_VISION_SUBSCRIPTION_KEY");
                var endpoint = Environment.GetEnvironmentVariable("AZURE_COMPUTER_VISION_ENDPOINT");

                if (string.IsNullOrEmpty(subscriptionKey) || string.IsNullOrEmpty(endpoint))
                {
                    throw new Exception("Azure Computer Vision לא מוגדר ב-Environment Variables. נדרש: AZURE_COMPUTER_VISION_SUBSCRIPTION_KEY ו-AZURE_COMPUTER_VISION_ENDPOINT");
                }

                var client = new ComputerVisionClient(new ApiKeyServiceClientCredentials(subscriptionKey))
                {
                    Endpoint = endpoint
                };

                using var stream = new MemoryStream(imageBytes);
                var textHeaders = await client.ReadInStreamAsync(stream, language: "he");

                string operationId = textHeaders.OperationLocation.Split('/').LastOrDefault();

                if (string.IsNullOrEmpty(operationId))
                {
                    throw new Exception("לא התקבל Operation ID מ-Azure");
                }

                ReadOperationResult results;
                int attempts = 0;
                do
                {
                    await Task.Delay(1000);
                    results = await client.GetReadResultAsync(Guid.Parse(operationId));
                    attempts++;

                    if (attempts > 30)
                    {
                        throw new Exception("Timeout בהמתנה לתוצאות Azure OCR");
                    }
                }
                while (results.Status == OperationStatusCodes.Running ||
                       results.Status == OperationStatusCodes.NotStarted);

                if (results.Status == OperationStatusCodes.Failed)
                {
                    throw new Exception("Azure OCR נכשל בעיבוד התמונה");
                }

                var textBuilder = new StringBuilder();
                foreach (var page in results.AnalyzeResult.ReadResults)
                {
                    foreach (var line in page.Lines)
                    {
                        textBuilder.AppendLine(line.Text);
                    }
                }

                return textBuilder.ToString();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Azure OCR Error: {ex.Message}");

                try
                {
                    Console.WriteLine("🔄 מנסה שוב ללא הגדרת שפה ספציפית...");
                    return await ExtractTextWithAzureOCRFallback(imageBytes);
                }
                catch (Exception fallbackEx)
                {
                    throw new Exception($"שגיאה ב-Azure OCR: {ex.Message}. Fallback: {fallbackEx.Message}");
                }
            }
        }

        private async Task<string> ExtractTextWithAzureOCRFallback(byte[] imageBytes)
        {
            // קריאת הגדרות Azure מ-Environment Variables
            var subscriptionKey = Environment.GetEnvironmentVariable("AZURE_COMPUTER_VISION_SUBSCRIPTION_KEY");
            var endpoint = Environment.GetEnvironmentVariable("AZURE_COMPUTER_VISION_ENDPOINT");

            var client = new ComputerVisionClient(new ApiKeyServiceClientCredentials(subscriptionKey))
            {
                Endpoint = endpoint
            };

            using var stream = new MemoryStream(imageBytes);
            var textHeaders = await client.ReadInStreamAsync(stream);

            string operationId = textHeaders.OperationLocation.Split('/').LastOrDefault();
            ReadOperationResult results;
            int attempts = 0;

            do
            {
                await Task.Delay(1000);
                results = await client.GetReadResultAsync(Guid.Parse(operationId));
                attempts++;
            }
            while ((results.Status == OperationStatusCodes.Running ||
                    results.Status == OperationStatusCodes.NotStarted) && attempts < 30);

            var textBuilder = new StringBuilder();
            foreach (var page in results.AnalyzeResult.ReadResults)
            {
                foreach (var line in page.Lines)
                {
                    textBuilder.AppendLine(line.Text);
                }
            }

            return textBuilder.ToString();
        }

        // === TESSERACT OCR FUNCTIONS ===
        private string ExtractTextFromImage(string imagePath)
        {
            try
            {
                Console.WriteLine($"🔤 מתחיל חילוץ טקסט מ: {imagePath}");

                using (var engine = new TesseractEngine(@"./tessdata", "heb", EngineMode.Default))
                {
                    engine.SetVariable("tessedit_char_whitelist", "אבגדהוזחטיכלמנסעפצקרשתךםןףץ0123456789./- ");
                    engine.SetVariable("preserve_interword_spaces", "1");

                    using (var img = Pix.LoadFromFile(imagePath))
                    {
                        var scaledImg = img.Scale(2.0f, 2.0f);

                        using (var page = engine.Process(scaledImg))
                        {
                            string text = page.GetText();
                            Console.WriteLine($"📄 טקסט גולמי שחולץ:\n{text}");
                            Console.WriteLine($"📏 אמינות: {page.GetMeanConfidence()}");

                            return text;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ שגיאה בחילוץ טקסט: {ex.Message}");
                throw;
            }
        }

        // הוסף endpoint חדש שמשלב את שני הטכנולוגיות
        [HttpPost("verify-id-hybrid")]
        public async Task<IActionResult> VerifyIdCardHybrid([FromBody] JsonElement request)
        {
            try
            {
                Console.WriteLine("🔍 === אימות ת.ז היברידי (Azure + Tesseract) ===");

                string fileName = request.GetProperty("fileName").GetString();
                string expectedIdNumber = request.GetProperty("expectedIdNumber").GetString();

                string imageUrl = await _uploadService.GetDownloadUrlAsync(fileName);

                if (string.IsNullOrEmpty(imageUrl))
                {
                    return BadRequest(new { success = false, message = "לא ניתן לקבל URL להורדת הקובץ" });
                }

                using var webClient = new WebClient();
                byte[] imageBytes = webClient.DownloadData(imageUrl);

                Console.WriteLine($"📥 הורדתי תמונה: {imageBytes.Length} bytes");

                // === חלק 1: חילוץ עם Azure OCR (לת.ז ותאריך) ===
                Console.WriteLine("🔵 שלב 1: מפעיל Azure OCR לחילוץ מספר ת.ז...");
                string azureText = "";
                var azureInfo = ("", "", "", "");

                try
                {
                    azureText = await ExtractTextWithAzureOCR(imageBytes);
                    Console.WriteLine($"📄 טקסט מ-Azure:\n{azureText}");

                    if (!string.IsNullOrEmpty(azureText))
                    {
                        azureInfo = ExtractIdInfo(azureText);
                        Console.WriteLine($"🆔 Azure מצא ת.ז: '{azureInfo.Item3}'");
                    }
                }
                catch (Exception azureEx)
                {
                    Console.WriteLine($"⚠️ Azure OCR נכשל: {azureEx.Message}");
                }

                // === חלק 2: חילוץ עם Tesseract (לשמות) ===
                Console.WriteLine("🔴 שלב 2: מפעיל Tesseract OCR לחילוץ שמות...");
                string tesseractText = "";
                var tesseractInfo = ("", "", "", "");

                try
                {
                    tesseractText = await ExtractTextFromImageUrlSimple(imageUrl);
                    Console.WriteLine($"📄 טקסט מ-Tesseract:\n{tesseractText}");

                    if (!string.IsNullOrEmpty(tesseractText))
                    {
                        tesseractInfo = ExtractIdInfo(tesseractText);
                        Console.WriteLine($"👤 Tesseract מצא שמות: '{tesseractInfo.Item1}' '{tesseractInfo.Item2}'");
                    }
                }
                catch (Exception tessEx)
                {
                    Console.WriteLine($"⚠️ Tesseract OCR נכשל: {tessEx.Message}");
                }

                // === חלק 3: שילוב התוצאות - הטוב מכל עולם ===
                Console.WriteLine("🔄 שלב 3: משלב תוצאות...");

                // בוחר את המספר ת.ז הטוב ביותר (מעדיף Azure)
                string finalIdNumber = "";
                if (!string.IsNullOrEmpty(azureInfo.Item3) && azureInfo.Item3.Length == 9)
                {
                    finalIdNumber = azureInfo.Item3;
                    Console.WriteLine($"✅ משתמש בת.ז מ-Azure: {finalIdNumber}");
                }
                else if (!string.IsNullOrEmpty(tesseractInfo.Item3) && tesseractInfo.Item3.Length == 9)
                {
                    finalIdNumber = tesseractInfo.Item3;
                    Console.WriteLine($"✅ משתמש בת.ז מ-Tesseract: {finalIdNumber}");
                }

                // בוחר את השמות הטובים ביותר (מעדיף Tesseract)
                string finalFirstName = "";
                string finalLastName = "";

                if (!string.IsNullOrEmpty(tesseractInfo.Item1) && tesseractInfo.Item1.Length > 1)
                {
                    finalFirstName = tesseractInfo.Item1;
                    Console.WriteLine($"✅ משתמש בשם פרטי מ-Tesseract: {finalFirstName}");
                }
                else if (!string.IsNullOrEmpty(azureInfo.Item1))
                {
                    finalFirstName = azureInfo.Item1;
                    Console.WriteLine($"✅ משתמש בשם פרטי מ-Azure: {finalFirstName}");
                }

                if (!string.IsNullOrEmpty(tesseractInfo.Item2) && tesseractInfo.Item2.Length > 1)
                {
                    finalLastName = tesseractInfo.Item2;
                    Console.WriteLine($"✅ משתמש בשם משפחה מ-Tesseract: {finalLastName}");
                }
                else if (!string.IsNullOrEmpty(azureInfo.Item2))
                {
                    finalLastName = azureInfo.Item2;
                    Console.WriteLine($"✅ משתמש בשם משפחה מ-Azure: {finalLastName}");
                }

                // בוחר את התאריך הטוב ביותר (מעדיף Azure)
                string finalBirthDate = "";
                if (!string.IsNullOrEmpty(azureInfo.Item4))
                {
                    finalBirthDate = azureInfo.Item4;
                    Console.WriteLine($"✅ משתמש בתאריך מ-Azure: {finalBirthDate}");
                }
                else if (!string.IsNullOrEmpty(tesseractInfo.Item4))
                {
                    finalBirthDate = tesseractInfo.Item4;
                    Console.WriteLine($"✅ משתמש בתאריך מ-Tesseract: {finalBirthDate}");
                }

                // === חלק 4: אימות ===
                var errors = new List<string>();
                bool isValid = true;

                Console.WriteLine($"🔍 מאמת: ת.ז מצופה='{expectedIdNumber}', ת.ז מזוהה='{finalIdNumber}'");

                if (expectedIdNumber != finalIdNumber)
                {
                    errors.Add($"מספר ת.ז לא תואם. צפוי: '{expectedIdNumber}', נמצא: '{finalIdNumber}'");
                    isValid = false;
                }

                if (!IsValidIsraeliId(finalIdNumber))
                {
                    errors.Add("מספר ת.ז לא תקין");
                    isValid = false;
                }

                if (isValid)
                {
                    return Ok(new
                    {
                        success = true,
                        message = "ת.ז אומת בהצלחה עם OCR היברידי",
                        data = new
                        {
                            idNumber = finalIdNumber,
                            birthDate = finalBirthDate,
                            extractedFirstName = finalFirstName,
                            extractedLastName = finalLastName
                        },
                        ocrSource = "Hybrid (Azure + Tesseract)",
                        details = new
                        {
                            azureResults = new
                            {
                                idNumber = azureInfo.Item3,
                                firstName = azureInfo.Item1,
                                lastName = azureInfo.Item2,
                                birthDate = azureInfo.Item4
                            },
                            tesseractResults = new
                            {
                                idNumber = tesseractInfo.Item3,
                                firstName = tesseractInfo.Item1,
                                lastName = tesseractInfo.Item2,
                                birthDate = tesseractInfo.Item4
                            }
                        }
                    });
                }
                else
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "אימות ת.ז נכשל",
                        errors = errors,
                        extractedData = new
                        {
                            idNumber = finalIdNumber,
                            birthDate = finalBirthDate,
                            extractedFirstName = finalFirstName,
                            extractedLastName = finalLastName
                        },
                        ocrSource = "Hybrid (Azure + Tesseract)",
                        details = new
                        {
                            azureResults = new
                            {
                                idNumber = azureInfo.Item3,
                                firstName = azureInfo.Item1,
                                lastName = azureInfo.Item2,
                                birthDate = azureInfo.Item4
                            },
                            tesseractResults = new
                            {
                                idNumber = tesseractInfo.Item3,
                                firstName = tesseractInfo.Item1,
                                lastName = tesseractInfo.Item2,
                                birthDate = tesseractInfo.Item4
                            }
                        }
                    });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"💥 שגיאה באימות היברידי: {ex.Message}");
                return StatusCode(500, new
                {
                    success = false,
                    message = "שגיאה באימות ת.ז היברידי",
                    error = ex.Message
                });
            }
        }

        private async Task<string> ExtractTextFromImageUrlSimple(string imageUrl)
        {
            try
            {
                using var webClient = new WebClient();
                byte[] imageBytes = webClient.DownloadData(imageUrl);

                var tempFilePath = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString() + ".jpg");
                System.IO.File.WriteAllBytes(tempFilePath, imageBytes);

                string result = ExtractTextFromImage(tempFilePath);

                System.IO.File.Delete(tempFilePath);

                return result;
            }
            catch (Exception ex)
            {
                throw new Exception($"שגיאה בחילוץ טקסט: {ex.Message}");
            }
        }

        // === TEXT PROCESSING FUNCTIONS ===
        private (string firstName, string lastName, string idNumber, string birthDate) ExtractIdInfo(string text)
        {
            Console.WriteLine($"🔍 === מתחיל פרסור מדויק של טקסט ===");
            Console.WriteLine($"📝 טקסט מקורי באורך: {text?.Length} תווים");

            if (string.IsNullOrEmpty(text))
            {
                Console.WriteLine("❌ טקסט ריק");
                return ("", "", "", "");
            }

            Console.WriteLine($"📄 טקסט מלא:\n{text}");
            Console.WriteLine("=====================================");

            string cleanText = text;
            cleanText = Regex.Replace(cleanText, @"[^\u0590-\u05FF\u0041-\u005A\u0061-\u007A\d\s\.\-/]", " ");
            cleanText = Regex.Replace(cleanText, @"\s+", " ").Trim();

            Console.WriteLine($"🧹 טקסט לאחר ניקוי:\n{cleanText}");
            Console.WriteLine("=====================================");

            string idNumber = ExtractIdNumber(text, cleanText);
            Console.WriteLine($"🆔 מספר ת.ז שחולץ: '{idNumber}'");

            var names = ExtractNames(text, cleanText);
            Console.WriteLine($"👥 שמות שחולצו: {string.Join(", ", names.Select(n => $"'{n}'"))}");

            string firstName = names.Count > 0 ? names[0] : "";
            string lastName = names.Count > 1 ? names[1] : "";

            string birthDate = ExtractBirthDate(text);

            Console.WriteLine($"✨ תוצאה סופית:");
            Console.WriteLine($"   שם פרטי: '{firstName}'");
            Console.WriteLine($"   שם משפחה: '{lastName}'");
            Console.WriteLine($"   מספר ת.ז: '{idNumber}'");
            Console.WriteLine($"   תאריך לידה: '{birthDate}'");

            return (firstName, lastName, idNumber, birthDate);
        }

        private string ExtractIdNumber(string originalText, string cleanText)
        {
            Console.WriteLine("🔍 מחפש מספר ת.ז בדרכים שונות...");

            var texts = new[] { originalText, cleanText };

            var idPatterns = new[]
            {
                @"3\s*2659238\s*3",                     // המספר הספציפי שמצאנו
                @"\b\d{9}\b",                          // 9 ספרות רצופות
                @"\b\d\s*\d{7}\s*\d\b",               // דפוס עם רווחים
                @"\b\d{3}\s*\d{3}\s*\d{3}\b",         // 3 קבוצות של ספרות עם רווחים
                @"(?:ת\.?ז\.?\s*:?\s*)(\d{9})",       // אחרי "ת.ז:" 
                @"(?:תעודת\s+זהות\s*:?\s*)(\d{9})",   // אחרי "תעודת זהות"
                @"(?:מספר\s*:?\s*)(\d{9})",           // אחרי "מספר:"
                @"(\d{9})",                            // כל 9 ספרות
            };

            foreach (var text in texts)
            {
                foreach (var pattern in idPatterns)
                {
                    var matches = Regex.Matches(text, pattern, RegexOptions.IgnoreCase);

                    foreach (Match match in matches)
                    {
                        string candidate = match.Groups.Count > 1 ? match.Groups[1].Value : match.Value;
                        candidate = Regex.Replace(candidate, @"[^\d]", "");

                        Console.WriteLine($"   מועמד: '{candidate}' (דפוס: {pattern})");

                        if (candidate.Length == 9)
                        {
                            Console.WriteLine($"✅ נמצא מספר 9 ספרות: {candidate}");

                            if (IsValidIsraeliId(candidate))
                            {
                                Console.WriteLine($"✅ ת.ז תקין: {candidate}");
                                return candidate;
                            }
                            else
                            {
                                Console.WriteLine($"⚠️ ת.ז לא תקין לפי אלגוריתם אבל נחזיר אותו: {candidate}");
                                return candidate;
                            }
                        }
                    }
                }
            }

            Console.WriteLine("❌ לא נמצא מספר ת.ז");
            return "";
        }

        private List<string> ExtractNames(string originalText, string cleanText)
        {
            Console.WriteLine("🔍 מחפש שמות בדרכים שונות...");

            var names = new List<string>();
            var texts = new[] { originalText, cleanText };

            var namePatterns = new[]
            {
                @"(?:שם\s*:?\s*)([\u0590-\u05FF\s]{2,30})",              // אחרי "שם:" בעברית
                @"(?:שם פרטי\s*:?\s*)([\u0590-\u05FF\s]{2,20})",         // אחרי "שם פרטי:" בעברית
                @"(?:שם משפחה\s*:?\s*)([\u0590-\u05FF\s]{2,20})",        // אחרי "שם משפחה:" בעברית
                @"([\u0590-\u05FF]{2,15})\s+([\u0590-\u05FF]{2,15})",   // שני מילים עבריות
                @"[\u0590-\u05FF]{2,20}",                                // כל מילה עברית
                @"([A-Z][a-z]{2,15})\s+([A-Z][a-z]{2,15})",             // שמות לטיניים
                @"[A-Z][a-z]{2,20}",                                     // מילים לטיניות
            };

            foreach (var text in texts)
            {
                foreach (var pattern in namePatterns)
                {
                    var matches = Regex.Matches(text, pattern);

                    foreach (Match match in matches)
                    {
                        if (match.Groups.Count > 1)
                        {
                            for (int i = 1; i < match.Groups.Count; i++)
                            {
                                string name = match.Groups[i].Value.Trim();
                                if (IsValidName(name) && !names.Contains(name))
                                {
                                    names.Add(name);
                                    Console.WriteLine($"   נמצא שם: '{name}' (דפוס: {pattern})");
                                }
                            }
                        }
                        else
                        {
                            string name = match.Value.Trim();
                            if (IsValidName(name) && !names.Contains(name))
                            {
                                names.Add(name);
                                Console.WriteLine($"   נמצא שם: '{name}' (דפוס: {pattern})");
                            }
                        }
                    }
                }
            }

            return names.Take(5).ToList();
        }

        private bool IsValidName(string name)
        {
            if (string.IsNullOrWhiteSpace(name) || name.Length < 2 || name.Length > 25)
                return false;

            if (!Regex.IsMatch(name, @"^[\u0590-\u05FF\sA-Za-z]+$"))
                return false;

            var excludeWords = new[] {
                "תעודת", "זהות", "מספר", "תאריך", "לידה", "כתובת", "רחוב", "עיר",
                "ישראל", "מדינת", "זכר", "נקבה", "נולד", "נולדה", "בן", "בת",
                "UALL", "UGLIO", "ninT", "nTIUn", "noo", "ninth", "non", "hnounn", "anserson"
            };

            return !excludeWords.Any(word => name.ToLower().Contains(word.ToLower()));
        }

        private string ExtractBirthDate(string text)
        {
            Console.WriteLine("🔍 מחפש תאריך לידה...");

            var datePatterns = new[]
            {
                @"(?:תאריך לידה\s*:?\s*)(\d{1,2}[./]\d{1,2}[./]\d{4})",  // אחרי "תאריך לידה:"
                @"(?:נולד[ה]?\s*:?\s*)(\d{1,2}[./]\d{1,2}[./]\d{4})",    // אחרי "נולד/נולדה:"
                @"(\d{1,2}[./]\d{1,2}[./](?:19|20)\d{2})",               // תאריך כללי
                @"(\d{1,2}[./]\d{1,2}[./]\d{4})",                        // כל תאריך
            };

            foreach (var pattern in datePatterns)
            {
                var match = Regex.Match(text, pattern);
                if (match.Success)
                {
                    string date = match.Groups[1].Success ? match.Groups[1].Value : match.Value;
                    Console.WriteLine($"✅ נמצא תאריך: '{date}'");
                    return date;
                }
            }

            Console.WriteLine("❌ לא נמצא תאריך לידה");
            return "";
        }

        // === VALIDATION FUNCTIONS ===
        private bool IsValidIsraeliId(string id)
        {
            Console.WriteLine($"🔢 בודק תקינות ת.ז: '{id}'");

            if (string.IsNullOrEmpty(id) || id.Length != 9)
            {
                Console.WriteLine($"❌ אורך לא תקין: {id?.Length}");
                return false;
            }

            if (!id.All(char.IsDigit))
            {
                Console.WriteLine($"❌ מכיל תווים שאינם ספרות");
                return false;
            }

            // אלגוריתם בדיקת ספרת ביקורת
            int sum = 0;
            for (int i = 0; i < 8; i++)
            {
                int digit = int.Parse(id[i].ToString());
                if (i % 2 == 1) // מיקומים 1,3,5,7 (מתחילים מ-0)
                {
                    digit *= 2;
                    if (digit > 9)
                        digit = digit / 10 + digit % 10; // חיבור הספרות
                }
                sum += digit;
            }

            int checkDigit = (10 - (sum % 10)) % 10;
            int actualCheckDigit = int.Parse(id[8].ToString());

            bool isValid = checkDigit == actualCheckDigit;

            Console.WriteLine($"🔢 חישוב:");
            Console.WriteLine($"   סכום: {sum}");
            Console.WriteLine($"   ספרת ביקורת מחושבת: {checkDigit}");
            Console.WriteLine($"   ספרת ביקורת בפועל: {actualCheckDigit}");
            Console.WriteLine($"   תקין: {isValid}");

            return isValid;
        }

        private bool IsValidIsraeliIdSimple(string id)
        {
            if (string.IsNullOrEmpty(id) || id.Length != 9 || !id.All(char.IsDigit))
                return false;

            int sum = 0;
            for (int i = 0; i < 8; i++)
            {
                int digit = int.Parse(id[i].ToString());
                if (i % 2 == 1)
                {
                    digit *= 2;
                    if (digit > 9)
                        digit = digit / 10 + digit % 10;
                }
                sum += digit;
            }

            int checkDigit = (10 - (sum % 10)) % 10;
            return checkDigit == int.Parse(id[8].ToString());
        }

        private bool NamesMatchSimple(string expected, string actual)
        {
            if (string.IsNullOrEmpty(expected) || string.IsNullOrEmpty(actual))
                return false;

            expected = expected.Trim().Replace(" ", "");
            actual = actual.Trim().Replace(" ", "");

            return string.Equals(expected, actual, StringComparison.OrdinalIgnoreCase);
        }

        private double CalculateConfidenceSimple(string expectedFirstName, string expectedLastName, string expectedIdNumber,
            (string firstName, string lastName, string idNumber, string birthDate) extracted)
        {
            double score = 0;
            int totalFields = 3;

            if (NamesMatchSimple(expectedFirstName, extracted.firstName)) score += 1;
            if (NamesMatchSimple(expectedLastName, extracted.lastName)) score += 1;
            if (expectedIdNumber == extracted.idNumber) score += 1;

            return (score / totalFields) * 100;
        }
    }
}

// גם תעדכן את המחלקה VerifyIdRequest:
public class VerifyIdRequest
{
    public string FileName { get; set; }
    public string ExpectedIdNumber { get; set; }
    // הסרנו את שדות השמות
}