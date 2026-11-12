using CodeQuest.Domain.Enums;

namespace CodeQuest.Domain.Entities;

public class Level
{
    public int Id { get; set; }
    public int WorldId { get; set; }
    public World World { get; set; } = null!;

    public string Title { get; set; } = string.Empty;
    public string Question { get; set; } = string.Empty;
    public string? CodeSnippet { get; set; }
    public ChallengeType ChallengeType { get; set; }
    public int XpReward { get; set; }
    public int Order { get; set; }

    public List<LevelOption> Options { get; set; } = new();
    public List<LevelAnswer> Answers { get; set; } = new();
}