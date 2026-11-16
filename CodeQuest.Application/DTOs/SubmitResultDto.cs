namespace CodeQuest.Application.DTOs.Game;

public class SubmitResultDto
{
    public bool IsCorrect { get; set; }
    public bool AlreadyCompleted { get; set; }
    public int XpAwarded { get; set; }
    public int TotalXp { get; set; }
    public int? NextLevelId { get; set; }
    public string Message { get; set; } = string.Empty;
}