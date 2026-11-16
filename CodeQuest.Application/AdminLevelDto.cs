namespace CodeQuest.Application.DTOs.Admin;

public class AdminLevelDto
{
    public int Id { get; set; }
    public int WorldId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Question { get; set; } = string.Empty;
    public string? CodeSnippet { get; set; }
    public string ChallengeType { get; set; } = string.Empty;
    public int XpReward { get; set; }
    public int Order { get; set; }
    public List<AdminOptionDto> Options { get; set; } = new();
    public List<string> Answers { get; set; } = new();
}

public class AdminOptionDto
{
    public int Id { get; set; }
    public string Text { get; set; } = string.Empty;
    public bool IsCorrect { get; set; }
    public int? CorrectPosition { get; set; }
}