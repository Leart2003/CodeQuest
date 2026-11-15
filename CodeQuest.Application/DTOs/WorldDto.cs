namespace CodeQuest.Application.DTOs.Game;

public class WorldDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Order { get; set; }
    public bool IsUnlocked { get; set; }
    public int TotalLevels { get; set; }
    public int CompletedLevels { get; set; }
    public List<LevelSummaryDto> Levels { get; set; } = new();
}

public class LevelSummaryDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public int Order { get; set; }
    public string ChallengeType { get; set; } = string.Empty;
    public int XpReward { get; set; }
    public bool IsCompleted { get; set; }
    public bool IsUnlocked { get; set; }
}