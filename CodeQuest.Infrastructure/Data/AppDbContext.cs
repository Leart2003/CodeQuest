using CodeQuest.Domain.Entities;
using CodeQuest.Domain.Entities;
using CodeQuest.Infrastructure.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Text;

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
}
