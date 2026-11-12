namespace CodeQuest.Domain.Entities;

public class LevelAnswer
{
    public int Id { get; set; }
    public int LevelId { get; set; }
    public Level Level { get; set; } = null!;

    public string AcceptedAnswer { get; set; } = string.Empty;
}