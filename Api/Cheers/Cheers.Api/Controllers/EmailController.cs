//using Microsoft.AspNetCore.Mvc;
//using System.Net.Mail;
//using System.Net;
//using System.Text;
//using iText.Html2pdf;
//using iText.Kernel.Pdf;
//using iText.Layout;
//using iText.Layout.Element;
//using iText.Kernel.Font;
//using iText.IO.Font.Constants;
//using iText.Html2pdf.Resolver.Font;
//using iText.IO.Font;

//namespace Cheers.Api.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class EmailController : ControllerBase
//    {
//        private readonly IWebHostEnvironment _env;

//        public EmailController(IWebHostEnvironment env)
//        {
//            _env = env;
//        }

//        [HttpPost]
//        [Route("send-email")]
//        public IActionResult SendEmail([FromBody] EmailRequest request)
//        {
//            try
//            {
//                // יצירת קובץ PDF עם פרטי המועמד
//                var pdfBytes = GenerateCandidatePdf(request.CandidateData, request.SenderName);
//                var fileName = $"candidate_{request.CandidateData.FirstName}_{request.CandidateData.LastName}.pdf";

//                // קריאה לקובץ HTML עם קידוד UTF-8
//                var templatePath = Path.Combine(Directory.GetCurrentDirectory(), "Templates", "ManaggerMail.html");
//                var htmlTemplate = System.IO.File.ReadAllText(templatePath, System.Text.Encoding.UTF8);

//                // החלפת משתנים בתבנית ה-HTML
//                var bodyWithHtml = htmlTemplate
//                    .Replace("{{Subject}}", request.Subject)
//                    .Replace("{{Body}}", request.Body)
//                    .Replace("{{SenderName}}", request.SenderName)
//                    .Replace("{{ImageUrl}}", "");

//                // הגדרות SMTP
//                var smtpPassword = Environment.GetEnvironmentVariable("SMTP_PASSWORD");
//                var smtpClient = new SmtpClient("smtp.gmail.com")
//                {
//                    Port = 587,
//                    Credentials = new NetworkCredential("cheers.rh8867@gmail.com", smtpPassword),
//                    EnableSsl = true,
//                    UseDefaultCredentials = false,
//                };

//                // יצירת הודעת מייל עם גוף HTML וקידוד UTF-8
//                var mailMessage = new MailMessage
//                {
//                    From = new MailAddress("cheers.rh8867@gmail.com"),
//                    Subject = request.Subject,
//                    Body = bodyWithHtml,
//                    IsBodyHtml = true,
//                    BodyEncoding = System.Text.Encoding.UTF8,
//                    SubjectEncoding = System.Text.Encoding.UTF8
//                };

//                mailMessage.To.Add(request.To);

//                // הוספת קובץ ה-PDF כמצורף
//                using (var ms = new MemoryStream(pdfBytes))
//                {
//                    var attachment = new Attachment(ms, fileName, "application/pdf");
//                    mailMessage.Attachments.Add(attachment);

//                    // הגדרת כותרות עם קידוד נכון
//                    mailMessage.HeadersEncoding = System.Text.Encoding.UTF8;
//                    mailMessage.Headers.Add("Content-Type", "text/html; charset=utf-8");

//                    smtpClient.Send(mailMessage);
//                }

//                return Ok("Email sent successfully with PDF attachment");
//            }
//            catch (SmtpException smtpEx)
//            {
//                Console.WriteLine($"SMTP error details: {smtpEx.ToString()}");
//                return BadRequest($"SMTP error: {smtpEx.Message}");
//            }
//            catch (Exception ex)
//            {
//                Console.WriteLine($"Error details: {ex.ToString()}");
//                return BadRequest($"An error occurred: {ex.Message}");
//            }
//        }

//        private byte[] GenerateCandidatePdf(CandidateData candidate, string senderName)
//        {
//            using (var ms = new MemoryStream())
//            {
//                try
//                {
//                    var htmlContent = GenerateCandidateHtml(candidate);

//                    var converterProperties = new ConverterProperties();

//                    // שימוש בגופן מערכת שתומך בעברית
//                    var fontProvider = new DefaultFontProvider(false, false, false);

//                    // ניסיון להוסיף גופן מותאם אישית אם קיים
//                    var fontPath = Path.Combine(_env.ContentRootPath, "Fonts", "Rubik-Regular.ttf");

//                    if (System.IO.File.Exists(fontPath))
//                    {
//                        try
//                        {
//                            fontProvider.AddFont(fontPath);
//                        }
//                        catch (Exception ex)
//                        {
//                            Console.WriteLine($"Failed to load custom font: {ex.Message}");
//                        }
//                    }

//                    // הוספת גופני מערכת שתומכים בעברית
//                    var systemFonts = new[]
//                    {
//                        "C:\\Windows\\Fonts\\arial.ttf",
//                        "C:\\Windows\\Fonts\\tahoma.ttf",
//                        "C:\\Windows\\Fonts\\david.ttf",
//                        "C:\\Windows\\Fonts\\calibri.ttf"
//                    };

//                    foreach (var systemFont in systemFonts)
//                    {
//                        if (System.IO.File.Exists(systemFont))
//                        {
//                            try
//                            {
//                                fontProvider.AddFont(systemFont);
//                                break; // הפסק אחרי הגופן הראשון שנמצא
//                            }
//                            catch (Exception ex)
//                            {
//                                Console.WriteLine($"Failed to load system font {systemFont}: {ex.Message}");
//                            }
//                        }
//                    }

//                    converterProperties.SetFontProvider(fontProvider);
//                    converterProperties.SetCharset("UTF-8");

//                    // המרת HTML ל-PDF
//                    HtmlConverter.ConvertToPdf(htmlContent, ms, converterProperties);

//                    return ms.ToArray();
//                }
//                catch (Exception ex)
//                {
//                    Console.WriteLine($"PDF Generation Error: {ex.Message}");
//                    throw;
//                }
//            }
//        }

//        private string GenerateCandidateHtml(CandidateData data)
//        {
//            var currentDate = DateTime.Now.ToString("dd/MM/yyyy", new System.Globalization.CultureInfo("he-IL"));

//            // פונקציה לניקוי טקסט מתווים בעייתיים
//            string CleanText(string text)
//            {
//                if (string.IsNullOrEmpty(text)) return text;

//                // הסרת אמוג'ים ותווים מיוחדים שעלולים לגרום לבעיות
//                return System.Text.RegularExpressions.Regex.Replace(text, @"[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]", "", System.Text.RegularExpressions.RegexOptions.IgnoreCase);
//            }

//            var html = $@"
//<!DOCTYPE html>
//<html dir='rtl' lang='he'>
//<head>
//    <meta charset='UTF-8'>
//    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
//    <title>פרטי מועמד לשידוכים</title>
//    <style>
//        body {{
//            font-family: Arial, Tahoma, sans-serif;
//            direction: rtl;
//            margin: 0;
//            padding: 20px;
//            background: #f8f9fa;
//            line-height: 1.6;
//        }}

//        .container {{
//            max-width: 800px;
//            margin: 0 auto;
//            background: white;
//            border-radius: 15px;
//            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
//            overflow: hidden;
//        }}

//        .header {{
//            background: linear-gradient(135deg, #D4AF37 0%, #212121 100%);
//            padding: 40px;
//            text-align: center;
//            color: white;
//        }}

//        .header h1 {{
//            margin: 0;
//            font-size: 36px;
//            font-weight: 700;
//        }}

//        .header h2 {{
//            margin: 15px 0 0 0;
//            font-size: 24px;
//            opacity: 0.9;
//        }}

//        .gender-badge {{
//            background: {(data.Gender == "male" ? "#2196F3" : "#E91E63")};
//            color: white;
//            padding: 10px 25px;
//            border-radius: 25px;
//            display: inline-block;
//            margin-top: 20px;
//            font-weight: 500;
//        }}

//        .content {{
//            padding: 30px;
//        }}

//        .section {{
//            margin-bottom: 30px;
//            padding: 25px;
//            background: #f8f9fa;
//            border-radius: 12px;
//            border-right: 5px solid #D4AF37;
//        }}

//        .section h3 {{
//            color: #D4AF37;
//            font-size: 20px;
//            margin-bottom: 20px;
//            font-weight: 600;
//        }}

//        .info-grid {{
//            display: grid;
//            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
//            gap: 15px;
//        }}

//        .info-item {{
//            padding: 10px 0;
//        }}

//        .info-item strong {{
//            color: #333;
//            display: inline-block;
//            min-width: 120px;
//        }}

//        .text-box {{
//            background: white;
//            padding: 15px;
//            border-radius: 8px;
//            border-right: 3px solid #D4AF37;
//            margin-top: 10px;
//        }}

//        .footer {{
//            text-align: center;
//            padding: 20px;
//            background: #212121;
//            color: white;
//        }}

//        .age {{
//            font-weight: 500;
//            color: #D4AF37;
//        }}
//    </style>
//</head>
//<body>
//    <div class='container'>
//        <div class='header'>
//            <h1>פרופיל מועמד לשידוכים</h1>
//            <h2>{CleanText(data.FirstName ?? "")} {CleanText(data.LastName ?? "")}</h2>
//            <div class='gender-badge'>
//                {(data.Gender == "male" ? "זכר" : "נקבה")}
//            </div>
//        </div>

//        <div class='content'>
//            <!-- פרטים אישיים -->
//            <div class='section'>
//                <h3>פרטים אישיים</h3>
//                <div class='info-grid'>
//                    <div class='info-item'><strong>שם מלא:</strong> {CleanText(data.FirstName ?? "")} {CleanText(data.LastName ?? "")}</div>
//                    <div class='info-item'><strong>אימייל:</strong> {CleanText(data.Email ?? "לא צוין")}</div>
//                    <div class='info-item'><strong>טלפון:</strong> {CleanText(data.Phone ?? "לא צוין")}</div>
//                    <div class='info-item'><strong>תעודת זהות:</strong> {CleanText(data.Tz ?? "לא צוין")}</div>
//                    <div class='info-item'><strong>גיל:</strong> <span class='age'>{(data.BurnDate != null ? DateTime.Now.Year - DateTime.Parse(data.BurnDate).Year : 0)}</span></div>
//                    <div class='info-item'><strong>גובה:</strong> {data.Height ?? 0} ס""מ</div>
//                    <div class='info-item'><strong>מצב משפחתי:</strong> {CleanText(data.Status ?? "לא צוין")}</div>
//                </div>
//            </div>

//            <!-- כתובת -->
//            <div class='section'>
//                <h3>כתובת</h3>
//                <div class='info-grid'>
//                    <div class='info-item'><strong>מדינה:</strong> {CleanText(data.Country ?? "לא צוין")}</div>
//                    <div class='info-item'><strong>עיר:</strong> {CleanText(data.City ?? "לא צוין")}</div>
//                </div>
//            </div>";

//            // הוספת פרטי משפחה אם קיימים
//            if (!string.IsNullOrEmpty(data.FatherPhone) || !string.IsNullOrEmpty(data.MotherPhone))
//            {
//                html += $@"
//            <div class='section'>
//                <h3>פרטי קשר משפחה</h3>
//                <div class='info-grid'>";

//                if (!string.IsNullOrEmpty(data.FatherPhone))
//                    html += $"<div class='info-item'><strong>טלפון אבא:</strong> {CleanText(data.FatherPhone)}</div>";

//                if (!string.IsNullOrEmpty(data.MotherPhone))
//                    html += $"<div class='info-item'><strong>טלפון אמא:</strong> {CleanText(data.MotherPhone)}</div>";

//                html += @"</div>
//            </div>";
//            }

//            // פרטים ספציפיים לגברים
//            if (data.Gender == "male")
//            {
//                html += $@"
//            <div class='section'>
//                <h3>פרטים ספציפיים לגברים</h3>
//                <div class='info-grid'>
//                    {(!string.IsNullOrEmpty(data.Beard) ? $"<div class='info-item'><strong>זקן:</strong> {CleanText(data.Beard)}</div>" : "")}
//                    {(!string.IsNullOrEmpty(data.Hat) ? $"<div class='info-item'><strong>כובע:</strong> {CleanText(data.Hat)}</div>" : "")}
//                    {(!string.IsNullOrEmpty(data.Suit) ? $"<div class='info-item'><strong>חליפה:</strong> {CleanText(data.Suit)}</div>" : "")}
//                    {(!string.IsNullOrEmpty(data.IsLearning) ? $"<div class='info-item'><strong>לומד:</strong> {CleanText(data.IsLearning)}</div>" : "")}
//                    {(!string.IsNullOrEmpty(data.Yeshiva) ? $"<div class='info-item'><strong>ישיבה:</strong> {CleanText(data.Yeshiva)}</div>" : "")}
//                    <div class='info-item'><strong>מעשן:</strong> {(data.Smoker == true ? "כן" : "לא")}</div>
//                    <div class='info-item'><strong>רישיון נהיגה:</strong> {(data.DriversLicense == true ? "כן" : "לא")}</div>
//                </div>
//            </div>";
//            }

//            // פרטים ספציפיים לנשים
//            if (data.Gender == "female")
//            {
//                html += $@"
//            <div class='section'>
//                <h3>פרטים ספציפיים לנשים</h3>
//                <div class='info-grid'>
//                    {(!string.IsNullOrEmpty(data.Seminar) ? $"<div class='info-item'><strong>סמינר:</strong> {CleanText(data.Seminar)}</div>" : "")}
//                    {(!string.IsNullOrEmpty(data.Professional) ? $"<div class='info-item'><strong>תחום מקצועי:</strong> {CleanText(data.Professional)}</div>" : "")}
//                    {(!string.IsNullOrEmpty(data.HeadCovering) ? $"<div class='info-item'><strong>כיסוי ראש:</strong> {CleanText(data.HeadCovering)}</div>" : "")}
//                    <div class='info-item'><strong>בעלת תשובה:</strong> {(data.AnOutsider == true ? "כן" : "לא")}</div>
//                </div>
//            </div>";
//            }

//            // העדפות לבן/בת זוג
//            html += $@"
//            <div class='section'>
//                <h3>העדפות לבן/בת זוג</h3>
//                <div class='info-item'><strong>טווח גילאים:</strong> {data.AgeFrom ?? 18} - {data.AgeTo ?? 30}</div>";

//            if (!string.IsNullOrEmpty(data.ExpectationsFromPartner))
//                html += $@"<div class='text-box'><strong>ציפיות מבן/בת הזוג:</strong><br>{CleanText(data.ExpectationsFromPartner)}</div>";

//            if (!string.IsNullOrEmpty(data.ImportantTraitsIAmLookingFor))
//                html += $@"<div class='text-box'><strong>תכונות חשובות שאני מחפש/ת:</strong><br>{CleanText(data.ImportantTraitsIAmLookingFor)}</div>";

//            if (!string.IsNullOrEmpty(data.ImportantTraitsInMe))
//                html += $@"<div class='text-box'><strong>תכונות חשובות בי:</strong><br>{CleanText(data.ImportantTraitsInMe)}</div>";

//            html += @"</div>";

//            // פרטים נוספים
//            if (!string.IsNullOrEmpty(data.Class) || !string.IsNullOrEmpty(data.Club))
//            {
//                html += $@"
//            <div class='section'>
//                <h3>פרטים נוספים</h3>
//                <div class='info-grid'>";

//                if (!string.IsNullOrEmpty(data.Class))
//                    html += $"<div class='info-item'><strong>כיתה:</strong> {CleanText(data.Class)}</div>";

//                if (!string.IsNullOrEmpty(data.Club))
//                    html += $"<div class='info-item'><strong>מועדון:</strong> {CleanText(data.Club)}</div>";

//                html += $@"<div class='info-item'><strong>מצב בריאותי:</strong> {(data.HealthCondition == true ? "תקין" : "לא תקין")}</div>
//                </div>
//            </div>";
//            }

//            html += $@"
//        </div>

//        <div class='footer'>
//            <p>דוח זה נוצר ב-{currentDate}</p>
//            <p>מערכת שידוכים מתקדמת</p>
//        </div>
//    </div>
//</body>
//</html>";

//            return html;
//        }
//    }

//    public class EmailRequest
//    {
//        public string To { get; set; }
//        public string Subject { get; set; }
//        public string Body { get; set; }
//        public string SenderName { get; set; }
//        public CandidateData CandidateData { get; set; }
//    }

//    public class CandidateData
//    {
//        public int? Id { get; set; }
//        public string FirstName { get; set; }
//        public string LastName { get; set; }
//        public string Email { get; set; }
//        public string Tz { get; set; }
//        public string Phone { get; set; }
//        public string FatherPhone { get; set; }
//        public string MotherPhone { get; set; }
//        public string Country { get; set; }
//        public string City { get; set; }
//        public string Street { get; set; }
//        public int? NumberHouse { get; set; }
//        public string BurnDate { get; set; }
//        public int? Height { get; set; }
//        public string Status { get; set; }
//        public string Gender { get; set; }
//        public string Class { get; set; }
//        public string Club { get; set; }
//        public bool? HealthCondition { get; set; }

//        // Male specific
//        public string Beard { get; set; }
//        public string Hat { get; set; }
//        public string Suit { get; set; }
//        public string IsLearning { get; set; }
//        public string Yeshiva { get; set; }
//        public bool? Smoker { get; set; }
//        public bool? DriversLicense { get; set; }

//        // Female specific
//        public string Seminar { get; set; }
//        public string Professional { get; set; }
//        public string HeadCovering { get; set; }
//        public bool? AnOutsider { get; set; }

//        // Preferences
//        public string ExpectationsFromPartner { get; set; }
//        public string ImportantTraitsInMe { get; set; }
//        public string ImportantTraitsIAmLookingFor { get; set; }
//        public int? AgeFrom { get; set; }
//        public int? AgeTo { get; set; }
//        public string Openness { get; set; }
//        public string Appearance { get; set; }
//    }
//}                               

using Microsoft.AspNetCore.Mvc;
using System.Net.Mail;
using System.Net;
using System.Text;

namespace Cheers.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmailController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;

        public EmailController(IWebHostEnvironment env)
        {
            _env = env;
        }

        [HttpPost]
        [Route("send-email")]
        public IActionResult SendEmail([FromBody] EmailRequest request)
        {
            try
            {
                // 🔍 Debug: הדפסת הנתונים שהתקבלו
                Console.WriteLine("=== 🔍 DEBUG: נתונים שהתקבלו מהקליינט ===");
                Console.WriteLine($"📧 To: {request.To}");
                Console.WriteLine($"📝 Subject: {request.Subject}");
                Console.WriteLine($"👤 SenderName: {request.SenderName}");

                if (request.CandidateData != null)
                {
                    Console.WriteLine($"🏷️ FirstName: '{request.CandidateData.FirstName}' (Length: {request.CandidateData.FirstName?.Length})");
                    Console.WriteLine($"🏷️ LastName: '{request.CandidateData.LastName}' (Length: {request.CandidateData.LastName?.Length})");
                    Console.WriteLine($"🏙️ City: '{request.CandidateData.City}'");
                    Console.WriteLine($"🌍 Country: '{request.CandidateData.Country}'");
                }
                Console.WriteLine("=== 🔍 סיום DEBUG ===");

                // יצירת HTML מעוצב לגוף המייל
                var profileHtmlContent = GenerateEmailBodyWithProfile(request.CandidateData, request.Body);

                // הגדרות SMTP
                var smtpPassword = Environment.GetEnvironmentVariable("SMTP_PASSWORD");
                var smtpClient = new SmtpClient("smtp.gmail.com")
                {
                    Port = 587,
                    Credentials = new NetworkCredential("cheers.rh8867@gmail.com", smtpPassword),
                    EnableSsl = true,
                    UseDefaultCredentials = false,
                };

                // יצירת הודעת מייל עם HTML מעוצב בגוף המייל
                var mailMessage = new MailMessage
                {
                    From = new MailAddress("cheers.rh8867@gmail.com"),
                    Subject = request.Subject,
                    Body = profileHtmlContent,  // כאן השתנה - שולח HTML מעוצב ישירות
                    IsBodyHtml = true,
                    BodyEncoding = System.Text.Encoding.UTF8,
                    SubjectEncoding = System.Text.Encoding.UTF8
                };

                mailMessage.To.Add(request.To);

                // שליחת מייל ללא קובץ מצורף - הכל בגוף המייל
                mailMessage.HeadersEncoding = System.Text.Encoding.UTF8;
                smtpClient.Send(mailMessage);

                Console.WriteLine("✅ מייל נשלח בהצלחה עם פרופיל מעוצב בגוף המייל");
                return Ok("Email sent successfully with styled profile in email body");
            }
            catch (SmtpException smtpEx)
            {
                Console.WriteLine($"SMTP error details: {smtpEx.ToString()}");
                return BadRequest($"SMTP error: {smtpEx.Message}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error details: {ex.ToString()}");
                return BadRequest($"An error occurred: {ex.Message}");
            }
        }

        // פונקציה חדשה - יוצרת HTML מעוצב לגוף המייל
        private string GenerateEmailBodyWithProfile(CandidateData data, string originalMessage)
        {
            var currentDate = DateTime.Now.ToString("dd/MM/yyyy", new System.Globalization.CultureInfo("he-IL"));

            // פונקציה פשוטה לניקוי טקסט
            string SafeText(string text) => string.IsNullOrEmpty(text) ? "לא צוין" : text;

            var emailHtml = $@"
<!DOCTYPE html>
<html dir='rtl' lang='he'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>פרטי מועמד לשידוכים</title>
</head>
<body style='font-family: Arial, Tahoma, sans-serif; direction: rtl; text-align: right; margin: 0; padding: 20px; background: #f5f5f5; color: #333;'>
    
    <!-- הודעת המייל המקורית -->
    <div style='background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-right: 4px solid #D4AF37;'>
        <div style='white-space: pre-line; line-height: 1.6;'>{originalMessage}</div>
    </div>

    <!-- פרופיל המועמד המעוצב -->
    <div style='max-width: 800px; margin: 0 auto; background: white; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden;'>
        
        <!-- כותרת -->
        <div style='text-align: center; background: linear-gradient(135deg, #D4AF37 0%, #212121 100%); color: white; padding: 30px; margin-bottom: 0;'>
            <h1 style='margin: 0; font-size: 28px; font-weight: bold;'>פרופיל מועמד לשידוכים</h1>
            <h2 style='margin: 10px 0 0 0; font-size: 22px; opacity: 0.9;'>{SafeText(data?.FirstName)} {SafeText(data?.LastName)}</h2>
            <div style='background: {(data?.Gender == "male" ? "#2196F3" : "#E91E63")}; color: white; padding: 8px 20px; border-radius: 20px; display: inline-block; margin-top: 15px; font-size: 14px; font-weight: bold;'>
                {(data?.Gender == "male" ? "זכר" : "נקבה")}
            </div>
        </div>

        <div style='padding: 30px;'>
            <!-- פרטים אישיים -->
            <div style='margin-bottom: 25px; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background: #fafafa;'>
                <div style='color: #D4AF37; font-size: 18px; font-weight: bold; margin-bottom: 15px; border-bottom: 2px solid #D4AF37; padding-bottom: 8px;'>פרטים אישיים</div>
                <table style='width: 100%; border-collapse: collapse;'>
                    <tr>
                        <td style='padding: 8px 0; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #444; width: 140px;'>שם מלא:</td>
                        <td style='padding: 8px 0; border-bottom: 1px solid #f0f0f0; color: #666;'>{SafeText(data?.FirstName)} {SafeText(data?.LastName)}</td>
                    </tr>
                    <tr>
                        <td style='padding: 8px 0; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #444;'>אימייל:</td>
                        <td style='padding: 8px 0; border-bottom: 1px solid #f0f0f0; color: #666;'>{SafeText(data?.Email)}</td>
                    </tr>
                    <tr>
                        <td style='padding: 8px 0; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #444;'>טלפון:</td>
                        <td style='padding: 8px 0; border-bottom: 1px solid #f0f0f0; color: #666;'>{SafeText(data?.Phone)}</td>
                    </tr>
                    <tr>
                        <td style='padding: 8px 0; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #444;'>גיל:</td>
                        <td style='padding: 8px 0; border-bottom: 1px solid #f0f0f0; color: #666;'>{(data?.BurnDate != null ? DateTime.Now.Year - DateTime.Parse(data.BurnDate).Year : 0)}</td>
                    </tr>
                    <tr>
                        <td style='padding: 8px 0; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #444;'>גובה:</td>
                        <td style='padding: 8px 0; border-bottom: 1px solid #f0f0f0; color: #666;'>{data?.Height ?? 0} ס""מ</td>
                    </tr>
                    <tr>
                        <td style='padding: 8px 0; font-weight: bold; color: #444;'>מצב משפחתי:</td>
                        <td style='padding: 8px 0; color: #666;'>{SafeText(data?.Status)}</td>
                    </tr>
                </table>
            </div>

            <!-- כתובת -->
            <div style='margin-bottom: 25px; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background: #fafafa;'>
                <div style='color: #D4AF37; font-size: 18px; font-weight: bold; margin-bottom: 15px; border-bottom: 2px solid #D4AF37; padding-bottom: 8px;'>כתובת</div>
                <table style='width: 100%; border-collapse: collapse;'>
                    <tr>
                        <td style='padding: 8px 0; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #444; width: 140px;'>מדינה:</td>
                        <td style='padding: 8px 0; border-bottom: 1px solid #f0f0f0; color: #666;'>{SafeText(data?.Country)}</td>
                    </tr>
                    <tr>
                        <td style='padding: 8px 0; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #444;'>עיר:</td>
                        <td style='padding: 8px 0; border-bottom: 1px solid #f0f0f0; color: #666;'>{SafeText(data?.City)}</td>
                    </tr>
                    <tr>
                        <td style='padding: 8px 0; font-weight: bold; color: #444;'>רחוב:</td>
                        <td style='padding: 8px 0; color: #666;'>{SafeText(data?.Street)} {data?.NumberHouse}</td>
                    </tr>
                </table>
            </div>";

            // פרטי קשר משפחה - אם קיימים
            if (!string.IsNullOrEmpty(data?.FatherPhone) || !string.IsNullOrEmpty(data?.MotherPhone))
            {
                emailHtml += @"
            <div style='margin-bottom: 25px; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background: #fafafa;'>
                <div style='color: #D4AF37; font-size: 18px; font-weight: bold; margin-bottom: 15px; border-bottom: 2px solid #D4AF37; padding-bottom: 8px;'>פרטי קשר משפחה</div>
                <table style='width: 100%; border-collapse: collapse;'>";

                if (!string.IsNullOrEmpty(data?.FatherPhone))
                    emailHtml += $@"
                    <tr>
                        <td style='padding: 8px 0; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #444; width: 140px;'>טלפון אבא:</td>
                        <td style='padding: 8px 0; border-bottom: 1px solid #f0f0f0; color: #666;'>{data.FatherPhone}</td>
                    </tr>";

                if (!string.IsNullOrEmpty(data?.MotherPhone))
                    emailHtml += $@"
                    <tr>
                        <td style='padding: 8px 0; font-weight: bold; color: #444;'>טלפון אמא:</td>
                        <td style='padding: 8px 0; color: #666;'>{data.MotherPhone}</td>
                    </tr>";

                emailHtml += @"
                </table>
            </div>";
            }

            // פרטים ספציפיים לפי מגדר
            if (data?.Gender == "female")
            {
                emailHtml += $@"
            <div style='margin-bottom: 25px; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background: #fafafa;'>
                <div style='color: #D4AF37; font-size: 18px; font-weight: bold; margin-bottom: 15px; border-bottom: 2px solid #D4AF37; padding-bottom: 8px;'>פרטים ספציפיים לנשים</div>
                <table style='width: 100%; border-collapse: collapse;'>
                    <tr>
                        <td style='padding: 8px 0; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #444; width: 140px;'>סמינר:</td>
                        <td style='padding: 8px 0; border-bottom: 1px solid #f0f0f0; color: #666;'>{SafeText(data?.Seminar)}</td>
                    </tr>
                    <tr>
                        <td style='padding: 8px 0; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #444;'>תחום מקצועי:</td>
                        <td style='padding: 8px 0; border-bottom: 1px solid #f0f0f0; color: #666;'>{SafeText(data?.Professional)}</td>
                    </tr>
                    <tr>
                        <td style='padding: 8px 0; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #444;'>כיסוי ראש:</td>
                        <td style='padding: 8px 0; border-bottom: 1px solid #f0f0f0; color: #666;'>{SafeText(data?.HeadCovering)}</td>
                    </tr>
                    <tr>
                        <td style='padding: 8px 0; font-weight: bold; color: #444;'>בעלת תשובה:</td>
                        <td style='padding: 8px 0; color: #666;'>{(data?.AnOutsider == true ? "כן" : "לא")}</td>
                    </tr>
                </table>
            </div>";
            }

            // רקע ומאפיינים
            if (!string.IsNullOrEmpty(data?.BackGround) || !string.IsNullOrEmpty(data?.Openness) || !string.IsNullOrEmpty(data?.Appearance))
            {
                emailHtml += @"
            <div style='margin-bottom: 25px; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background: #fafafa;'>
                <div style='color: #D4AF37; font-size: 18px; font-weight: bold; margin-bottom: 15px; border-bottom: 2px solid #D4AF37; padding-bottom: 8px;'>רקע ומאפיינים</div>";

                if (!string.IsNullOrEmpty(data?.BackGround))
                    emailHtml += $@"
                <div style='background: white; padding: 15px; border-radius: 6px; border-right: 4px solid #D4AF37; margin-bottom: 10px;'>
                    <span style='font-weight: bold; color: #444;'>רקע:</span><br>
                    <span style='color: #666;'>{data.BackGround}</span>
                </div>";

                if (!string.IsNullOrEmpty(data?.Openness))
                    emailHtml += $@"
                <div style='background: white; padding: 15px; border-radius: 6px; border-right: 4px solid #D4AF37; margin-bottom: 10px;'>
                    <span style='font-weight: bold; color: #444;'>פתיחות:</span><br>
                    <span style='color: #666;'>{data.Openness}</span>
                </div>";

                if (!string.IsNullOrEmpty(data?.Appearance))
                    emailHtml += $@"
                <div style='background: white; padding: 15px; border-radius: 6px; border-right: 4px solid #D4AF37;'>
                    <span style='font-weight: bold; color: #444;'>מראה חיצוני:</span><br>
                    <span style='color: #666;'>{data.Appearance}</span>
                </div>";

                emailHtml += @"
            </div>";
            }

            // סיום ה-HTML
            emailHtml += $@"
            <!-- פוטר -->
            <div style='text-align: center; margin-top: 30px; padding: 20px; border-top: 2px solid #e0e0e0; color: #666; background: #f8f8f8;'>
                <p style='margin: 0;'><strong>דוח זה נוצר ב-{currentDate}</strong></p>
                <p style='margin: 5px 0 0 0;'>מערכת שידוכים מתקדמת</p>
            </div>
        </div>
    </div>
</body>
</html>";

            return emailHtml;
        }

        private string GenerateHebrewHtmlReport(CandidateData data)
        {
            var currentDate = DateTime.Now.ToString("dd/MM/yyyy", new System.Globalization.CultureInfo("he-IL"));

            // פונקציה פשוטה לניקוי טקסט
            string SafeText(string text) => string.IsNullOrEmpty(text) ? "לא צוין" : text;

            var html = $@"
<!DOCTYPE html>
<html dir='rtl' lang='he'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>פרטי מועמד לשידוכים</title>
    <style>
        body {{
            font-family: 'Segoe UI', Tahoma, Arial, sans-serif;
            direction: rtl;
            text-align: right;
            margin: 20px;
            line-height: 1.6;
            background: white;
            color: #333;
        }}
        
        .container {{
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            overflow: hidden;
        }}
        
        .header {{
            text-align: center;
            background: linear-gradient(135deg, #D4AF37 0%, #212121 100%);
            color: white;
            padding: 30px;
            margin-bottom: 0;
        }}
        
        .header h1 {{
            margin: 0;
            font-size: 28px;
            font-weight: bold;
        }}
        
        .header h2 {{
            margin: 10px 0 0 0;
            font-size: 22px;
            opacity: 0.9;
        }}
        
        .gender-badge {{
            background: {(data?.Gender == "male" ? "#2196F3" : "#E91E63")};
            color: white;
            padding: 8px 20px;
            border-radius: 20px;
            display: inline-block;
            margin-top: 15px;
            font-size: 14px;
            font-weight: bold;
        }}
        
        .content {{
            padding: 30px;
        }}
        
        .section {{
            margin-bottom: 25px;
            padding: 20px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            background: #fafafa;
        }}
        
        .section-title {{
            color: #D4AF37;
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
            border-bottom: 2px solid #D4AF37;
            padding-bottom: 8px;
        }}
        
        .info-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 12px;
        }}
        
        .info-item {{
            margin: 8px 0;
            padding: 8px 0;
            border-bottom: 1px solid #f0f0f0;
        }}
        
        .info-item:last-child {{
            border-bottom: none;
        }}
        
        .label {{
            font-weight: bold;
            color: #444;
            display: inline-block;
            min-width: 140px;
            margin-left: 10px;
        }}
        
        .value {{
            color: #666;
        }}
        
        .text-section {{
            background: white;
            padding: 15px;
            border-radius: 6px;
            border-right: 4px solid #D4AF37;
            margin-top: 10px;
        }}
        
        .footer {{
            text-align: center;
            margin-top: 30px;
            padding: 20px;
            border-top: 2px solid #e0e0e0;
            color: #666;
            background: #f8f8f8;
        }}
        
        @media print {{
            body {{ margin: 0; }}
            .container {{ box-shadow: none; }}
        }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>פרופיל מועמד לשידוכים</h1>
            <h2>{SafeText(data?.FirstName)} {SafeText(data?.LastName)}</h2>
            <div class='gender-badge'>
                {(data?.Gender == "male" ? "זכר" : "נקבה")}
            </div>
        </div>

        <div class='content'>
            <!-- פרטים אישיים -->
            <div class='section'>
                <div class='section-title'>פרטים אישיים</div>
                <div class='info-grid'>
                    <div class='info-item'>
                        <span class='label'>שם מלא:</span>
                        <span class='value'>{SafeText(data?.FirstName)} {SafeText(data?.LastName)}</span>
                    </div>
                    <div class='info-item'>
                        <span class='label'>אימייל:</span>
                        <span class='value'>{SafeText(data?.Email)}</span>
                    </div>
                    <div class='info-item'>
                        <span class='label'>טלפון:</span>
                        <span class='value'>{SafeText(data?.Phone)}</span>
                    </div>
                    <div class='info-item'>
                        <span class='label'>תעודת זהות:</span>
                        <span class='value'>{SafeText(data?.Tz)}</span>
                    </div>
                    <div class='info-item'>
                        <span class='label'>גיל:</span>
                        <span class='value'>{(data?.BurnDate != null ? DateTime.Now.Year - DateTime.Parse(data.BurnDate).Year : 0)}</span>
                    </div>
                    <div class='info-item'>
                        <span class='label'>גובה:</span>
                        <span class='value'>{data?.Height ?? 0} ס""מ</span>
                    </div>
                    <div class='info-item'>
                        <span class='label'>מצב משפחתי:</span>
                        <span class='value'>{SafeText(data?.Status)}</span>
                    </div>
                </div>
            </div>

            <!-- כתובת -->
            <div class='section'>
                <div class='section-title'>כתובת</div>
                <div class='info-grid'>
                    <div class='info-item'>
                        <span class='label'>מדינה:</span>
                        <span class='value'>{SafeText(data?.Country)}</span>
                    </div>
                    <div class='info-item'>
                        <span class='label'>עיר:</span>
                        <span class='value'>{SafeText(data?.City)}</span>
                    </div>
                    <div class='info-item'>
                        <span class='label'>רחוב:</span>
                        <span class='value'>{SafeText(data?.Street)} {data?.NumberHouse}</span>
                    </div>
                </div>
            </div>";

            // פרטי קשר משפחה
            if (!string.IsNullOrEmpty(data?.FatherPhone) || !string.IsNullOrEmpty(data?.MotherPhone))
            {
                html += @"
            <div class='section'>
                <div class='section-title'>פרטי קשר משפחה</div>
                <div class='info-grid'>";

                if (!string.IsNullOrEmpty(data?.FatherPhone))
                    html += $@"
                    <div class='info-item'>
                        <span class='label'>טלפון אבא:</span>
                        <span class='value'>{data.FatherPhone}</span>
                    </div>";

                if (!string.IsNullOrEmpty(data?.MotherPhone))
                    html += $@"
                    <div class='info-item'>
                        <span class='label'>טלפון אמא:</span>
                        <span class='value'>{data.MotherPhone}</span>
                    </div>";

                html += @"
                </div>
            </div>";
            }

            // פרטים ספציפיים לפי מגדר
            if (data?.Gender == "female")
            {
                html += $@"
            <div class='section'>
                <div class='section-title'>פרטים ספציפיים לנשים</div>
                <div class='info-grid'>
                    <div class='info-item'>
                        <span class='label'>סמינר:</span>
                        <span class='value'>{SafeText(data?.Seminar)}</span>
                    </div>
                    <div class='info-item'>
                        <span class='label'>תחום מקצועי:</span>
                        <span class='value'>{SafeText(data?.Professional)}</span>
                    </div>
                    <div class='info-item'>
                        <span class='label'>כיסוי ראש:</span>
                        <span class='value'>{SafeText(data?.HeadCovering)}</span>
                    </div>
                    <div class='info-item'>
                        <span class='label'>בעלת תשובה:</span>
                        <span class='value'>{(data?.AnOutsider == true ? "כן" : "לא")}</span>
                    </div>
                </div>
            </div>";
            }
            else if (data?.Gender == "male")
            {
                html += $@"
            <div class='section'>
                <div class='section-title'>פרטים ספציפיים לגברים</div>
                <div class='info-grid'>
                    <div class='info-item'>
                        <span class='label'>זקן:</span>
                        <span class='value'>{SafeText(data?.Beard)}</span>
                    </div>
                    <div class='info-item'>
                        <span class='label'>כובע:</span>
                        <span class='value'>{SafeText(data?.Hat)}</span>
                    </div>
                    <div class='info-item'>
                        <span class='label'>חליפה:</span>
                        <span class='value'>{SafeText(data?.Suit)}</span>
                    </div>
                    <div class='info-item'>
                        <span class='label'>לומד:</span>
                        <span class='value'>{SafeText(data?.IsLearning)}</span>
                    </div>
                    <div class='info-item'>
                        <span class='label'>ישיבה:</span>
                        <span class='value'>{SafeText(data?.Yeshiva)}</span>
                    </div>
                    <div class='info-item'>
                        <span class='label'>מעשן:</span>
                        <span class='value'>{(data?.Smoker == true ? "כן" : "לא")}</span>
                    </div>
                    <div class='info-item'>
                        <span class='label'>רישיון נהיגה:</span>
                        <span class='value'>{(data?.DriversLicense == true ? "כן" : "לא")}</span>
                    </div>
                </div>
            </div>";
            }

            // העדפות ספציפיות נוספות (הוספתי סקציה חדשה)
            bool hasSpecificPreferences = !string.IsNullOrEmpty(data?.PreferredSeminarStyle) ||
                                        !string.IsNullOrEmpty(data?.PreferredProfessional) ||
                                        !string.IsNullOrEmpty(data?.PreferredHeadCovering) ||
                                        !string.IsNullOrEmpty(data?.PreferredAnOutsider) ||
                                        !string.IsNullOrEmpty(data?.PrefferedIsLearning) ||
                                        !string.IsNullOrEmpty(data?.PrefferedYeshivaStyle);

            if (hasSpecificPreferences)
            {
                html += @"
            <div class='section'>
                <div class='section-title'>העדפות ספציפיות</div>
                <div class='info-grid'>";

                if (!string.IsNullOrEmpty(data?.PreferredSeminarStyle))
                    html += $@"
                    <div class='info-item'>
                        <span class='label'>סגנון סמינר מועדף:</span>
                        <span class='value'>{data.PreferredSeminarStyle}</span>
                    </div>";

                if (!string.IsNullOrEmpty(data?.PreferredProfessional))
                    html += $@"
                    <div class='info-item'>
                        <span class='label'>תחום מקצועי מועדף:</span>
                        <span class='value'>{data.PreferredProfessional}</span>
                    </div>";

                if (!string.IsNullOrEmpty(data?.PreferredHeadCovering))
                    html += $@"
                    <div class='info-item'>
                        <span class='label'>כיסוי ראש מועדף:</span>
                        <span class='value'>{data.PreferredHeadCovering}</span>
                    </div>";

                if (!string.IsNullOrEmpty(data?.PreferredAnOutsider))
                    html += $@"
                    <div class='info-item'>
                        <span class='label'>העדפה לבעל/ת תשובה:</span>
                        <span class='value'>{data.PreferredAnOutsider}</span>
                    </div>";

                if (!string.IsNullOrEmpty(data?.PrefferedIsLearning))
                    html += $@"
                    <div class='info-item'>
                        <span class='label'>העדפה ללומד/ת:</span>
                        <span class='value'>{data.PrefferedIsLearning}</span>
                    </div>";

                if (!string.IsNullOrEmpty(data?.PrefferedYeshivaStyle))
                    html += $@"
                    <div class='info-item'>
                        <span class='label'>סגנון ישיבה מועדף:</span>
                        <span class='value'>{data.PrefferedYeshivaStyle}</span>
                    </div>";

                html += @"
                </div>
            </div>";
            }

            // רקע ומאפיינים
            if (!string.IsNullOrEmpty(data?.BackGround) || !string.IsNullOrEmpty(data?.Openness) || !string.IsNullOrEmpty(data?.Appearance))
            {
                html += @"
            <div class='section'>
                <div class='section-title'>רקע ומאפיינים</div>";

                if (!string.IsNullOrEmpty(data?.BackGround))
                    html += $@"
                <div class='text-section'>
                    <span class='label'>רקע:</span><br>
                    <span class='value'>{data.BackGround}</span>
                </div>";

                if (!string.IsNullOrEmpty(data?.Openness))
                    html += $@"
                <div class='text-section'>
                    <span class='label'>פתיחות:</span><br>
                    <span class='value'>{data.Openness}</span>
                </div>";

                if (!string.IsNullOrEmpty(data?.Appearance))
                    html += $@"
                <div class='text-section'>
                    <span class='label'>מראה חיצוני:</span><br>
                    <span class='value'>{data.Appearance}</span>
                </div>";

                html += @"
            </div>";
            }

            // העדפות לבן/בת זוג
            html += $@"
            <div class='section'>
                <div class='section-title'>העדפות לבן/בת זוג</div>
                <div class='info-item'>
                    <span class='label'>טווח גילאים:</span>
                    <span class='value'>{data?.AgeFrom ?? 18} - {data?.AgeTo ?? 30}</span>
                </div>";

            if (!string.IsNullOrEmpty(data?.ExpectationsFromPartner))
                html += $@"
                <div class='text-section'>
                    <span class='label'>ציפיות מבן/בת הזוג:</span><br>
                    <span class='value'>{data.ExpectationsFromPartner}</span>
                </div>";

            if (!string.IsNullOrEmpty(data?.ImportantTraitsIAmLookingFor))
                html += $@"
                <div class='text-section'>
                    <span class='label'>תכונות חשובות שאני מחפש/ת:</span><br>
                    <span class='value'>{data.ImportantTraitsIAmLookingFor}</span>
                </div>";

            if (!string.IsNullOrEmpty(data?.ImportantTraitsInMe))
                html += $@"
                <div class='text-section'>
                    <span class='label'>תכונות חשובות בי:</span><br>
                    <span class='value'>{data.ImportantTraitsInMe}</span>
                </div>";

            html += @"
            </div>";

            // פרטים נוספים
            if (!string.IsNullOrEmpty(data?.Class) || !string.IsNullOrEmpty(data?.Club))
            {
                html += $@"
            <div class='section'>
                <div class='section-title'>פרטים נוספים</div>
                <div class='info-grid'>";

                if (!string.IsNullOrEmpty(data?.Class))
                    html += $@"
                    <div class='info-item'>
                        <span class='label'>כיתה:</span>
                        <span class='value'>{data.Class}</span>
                    </div>";

                if (!string.IsNullOrEmpty(data?.Club))
                    html += $@"
                    <div class='info-item'>
                        <span class='label'>מועדון:</span>
                        <span class='value'>{data.Club}</span>
                    </div>";

                html += $@"
                    <div class='info-item'>
                        <span class='label'>מצב בריאותי:</span>
                        <span class='value'>{(data?.HealthCondition == true ? "תקין" : "לא תקין")}</span>
                    </div>
                </div>
            </div>";
            }

            html += $@"
        </div>
        
        <div class='footer'>
            <p><strong>דוח זה נוצר ב-{currentDate}</strong></p>
            <p>מערכת שידוכים מתקדמת</p>
            <p style='font-size: 12px; color: #999;'>
                להדפסה כ-PDF: File → Print → Save as PDF
            </p>
        </div>
    </div>
</body>
</html>";

            return html;
        }
    }

    public class EmailRequest
    {
        public string To { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
        public string SenderName { get; set; }
        public CandidateData CandidateData { get; set; }
    }

    public class CandidateData
    {
        public int? Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Tz { get; set; }
        public string Phone { get; set; }
        public string FatherPhone { get; set; }
        public string MotherPhone { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public string Street { get; set; }
        public int? NumberHouse { get; set; }
        public string BurnDate { get; set; }
        public int? Height { get; set; }
        public string Status { get; set; }
        public string Gender { get; set; }
        public string Class { get; set; }
        public string Club { get; set; }
        public bool? HealthCondition { get; set; }

        // Male specific
        public string Beard { get; set; }
        public string Hat { get; set; }
        public string Suit { get; set; }
        public string IsLearning { get; set; }
        public string Yeshiva { get; set; }
        public bool? Smoker { get; set; }
        public bool? DriversLicense { get; set; }

        // Female specific
        public string Seminar { get; set; }
        public string Professional { get; set; }
        public string HeadCovering { get; set; }
        public bool? AnOutsider { get; set; }

        // Preferences
        public string ExpectationsFromPartner { get; set; }
        public string ImportantTraitsInMe { get; set; }
        public string ImportantTraitsIAmLookingFor { get; set; }
        public int? AgeFrom { get; set; }
        public int? AgeTo { get; set; }
        public string BackGround { get; set; }
        public string Openness { get; set; }
        public string Appearance { get; set; }

        // Specific Preferences - השדות שחסרו
        public string PreferredSeminarStyle { get; set; }
        public string PreferredProfessional { get; set; }
        public string PreferredHeadCovering { get; set; }
        public string PreferredAnOutsider { get; set; }
        public string PrefferedIsLearning { get; set; }
        public string PrefferedYeshivaStyle { get; set; }
    }
}