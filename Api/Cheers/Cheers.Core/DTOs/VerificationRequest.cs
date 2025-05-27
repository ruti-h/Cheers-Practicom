namespace Cheers.Core.DTOs
{
    public class VerificationRequest
    {
      
            public string FileName { get; set; } = string.Empty;
            public string ExpectedFirstName { get; set; } = string.Empty;
            public string ExpectedLastName { get; set; } = string.Empty;
            public string ExpectedIdNumber { get; set; } = string.Empty;
      
    }
}
