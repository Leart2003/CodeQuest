using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using CodeQuest.Domain.Enums;

namespace CodeQuest.Application.DTOs.Admin;

public class LevelInputDto
{
    public int WorldId { get; set; }

    [Required, MaxLength(100)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Question { get; set; } = string.Empty;

    public string? CodeSnippet { get; set; }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public ChallengeType ChallengeType { get; set; }

    [Range(1, 1000)]
    public int XpReward { get; set; }

    public int Order { get; set; }

    public List<OptionInputDto> Options { get; set; } = new();

    public List<string> Answers { get; set; } = new();
}

public class OptionInputDto
{
    public string Text { get; set; } = string.Empty;

    // MultipleChoice and SpotTheBug
    public bool IsCorrect { get; set; }

    // OrderTheLines (1, 2, 3...)
    public int? CorrectPosition { get; set; }
}