namespace CodeQuest.Application.DTOs.Game;

public class LevelDetailDto
{
    public int Id { get; set; }
    public int WorldId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Question { get; set; } = string.Empty;
    public string? CodeSnippet { get; set; }
    public string ChallengeType { get; set; } = string.Empty;
    public int XpReward { get; set; }
    public List<OptionDto> Options { get; set; } = new();
}

public class OptionDto
{
    public int Id { get; set; }
    public string Text { get; set; } = string.Empty;
}