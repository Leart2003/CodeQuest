namespace CodeQuest.Application.DTOs.Game;

public class SubmitAnswerDto
{
    public int? SelectedOptionId { get; set; }

    
    public string? TextAnswer { get; set; }

    public List<int>? OrderedOptionIds { get; set; }
}