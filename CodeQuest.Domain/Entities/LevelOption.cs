namespace CodeQuest.Domain.Entities;

public class LevelOption
{
    public int Id { get; set; }
    public int LevelId { get; set; }
    public Level Level { get; set; } = null!;

    public string Text { get; set; } = string.Empty;
    public bool IsCorrect { get; set; }
    public int? CorrectPosition { get; set; } 
}