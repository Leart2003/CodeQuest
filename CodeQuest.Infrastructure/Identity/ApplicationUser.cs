using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.AspNet.Identity.EntityFramework;
namespace CodeQuest.Infrastructure.Identity
{
    public class ApplicationUser : IdentityUser
    {
        public int TotalXp { get; set; }
    }
}
