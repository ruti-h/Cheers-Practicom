namespace Cheers.Api.Models
{
    public class MatchResult
    {
        public int UserId { get; set; }      // נשמור את ה-ID
        public int Score { get; set; }
        public List<string> Comment { get; set; }

    }
}
