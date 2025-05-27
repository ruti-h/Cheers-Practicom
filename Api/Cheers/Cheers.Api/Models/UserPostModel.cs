namespace Cheers.Api.Models
{
    public class UserPostModel
    {

        public string Email { get; set; }
        public string UserName { get; set; }
        public string PasswordHash { get; set; }
        public string Role { get; set; } // "Candidate", "Women", "MatchMaker"

    }
}
