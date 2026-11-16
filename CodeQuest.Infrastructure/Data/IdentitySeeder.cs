using Microsoft.AspNetCore.Identity;

namespace CodeQuest.Infrastructure.Identity;

public static class IdentitySeeder
{
    public static async Task SeedAdminAsync(
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager,
        string username,
        string password)
    {
        if (!await roleManager.RoleExistsAsync("Admin"))
            await roleManager.CreateAsync(new IdentityRole("Admin"));

        var admin = await userManager.FindByNameAsync(username);

        if (admin == null)
        {
            admin = new ApplicationUser { UserName = username };
            var result = await userManager.CreateAsync(admin, password);
            if (!result.Succeeded)
                return;
        }

        if (!await userManager.IsInRoleAsync(admin, "Admin"))
            await userManager.AddToRoleAsync(admin, "Admin");
    }
}