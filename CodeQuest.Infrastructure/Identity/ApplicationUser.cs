using Microsoft.AspNetCore.Identity;

namespace CodeQuest.Infrastructure.Identity
{
    public class ApplicationUser : IdentityUser
    {
        public int TotalXp { get; set; }
    }
}
