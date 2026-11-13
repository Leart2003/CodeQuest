using CodeQuest.Domain.Entities;
using CodeQuest.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CodeQuest.Infrastructure.Data
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        public DbSet<World> Worlds => Set<World>();
        public DbSet<Level> Levels => Set<Level>();
        public DbSet<LevelOption> LevelOptions => Set<LevelOption>();
        public DbSet<LevelAnswer> LevelAnswers => Set<LevelAnswer>();
        public DbSet<UserProgress> UserProgresses => Set<UserProgress>();

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<UserProgress>()
                .HasOne<ApplicationUser>()
                .WithMany()
                .HasForeignKey(progress => progress.UserId);

            builder.Entity<UserProgress>()
                .HasIndex(progress => new { progress.UserId, progress.LevelId })
                .IsUnique();
        }
    }
}
