using CodeQuest.Domain.Entities;
using CodeQuest.Infrastructure.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Data.Entity;


namespace CodeQuest.Infrastructure.Data
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public DbSet<World> Worlds => Set<World>();
        public DbSet<Level> Levels => Set<Level>();
        public DbSet<LevelOption> LevelOptions => Set<LevelOption>();
        public DbSet<LevelAnswer> LevelAnswers => Set<LevelAnswer>();
        public DbSet<UserProgress> UserProgresses => Set<UserProgress>();
    }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<UserProgress>()
                .HasOne<ApplicationUser>()
                .WithMany()
                .HasForeignKey(p => p.UserId);

            builder.Entity<UserProgress>()
                .HasIndex(p => new { p.UserId, p.LevelId })
                .IsUnique();
        }
    }
}