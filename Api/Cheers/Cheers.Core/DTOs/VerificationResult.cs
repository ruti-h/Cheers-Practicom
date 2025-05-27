namespace Cheers.Core.DTOs
{
    public class VerificationResult
    {

        public bool IsValid { get; set; }
        public IdCardInfo ExtractedInfo { get; set; } = new IdCardInfo();
        public List<string> Errors { get; set; } = new List<string>();
        public double ConfidenceScore { get; set; }
    }
}
