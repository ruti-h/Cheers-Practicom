namespace Cheers.Api.Models
{
    public class RegisterModel
    {
        public string UserName { get; set; }
        public string TZ { get; set; }
    
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string RoleName { get; set; }
        public DateTime CreatedAt { get; set; }

    }
}
