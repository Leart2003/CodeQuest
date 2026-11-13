using System;
using System.Collections.Generic;
using System.Text;

namespace CodeQuest.Domain.Entities
{
    public class UserProgress
    {
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty; // Identity user id
        public int LevelId { get; set; }
        public Level Level { get; set; } = null!;

        public bool IsCompleted { get; set; }
        public int Attempts { get; set; }
        public DateTime? CompletedAt { get; set; }
    }
}
