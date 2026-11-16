using System;
using System.Collections.Generic;
using System.Text;

namespace CodeQuest.Application.DTOs.Game
{

    public class LeaderboardEntryDto
    {
        public int Rank { get; set; }
        public string Username { get; set; } = string.Empty;
        public int TotalXp { get; set; }
        public int CompletedLevels { get; set; }
    }
}
