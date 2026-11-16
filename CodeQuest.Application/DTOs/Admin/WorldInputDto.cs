using System.ComponentModel.DataAnnotations;

namespace CodeQuest.Application.DTOs.Admin;

public class WorldInputDto
{
    [Required, MaxLength(100)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;

    public int Order { get; set; }
}

public class AdminWorldDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Order { get; set; }
    public int LevelCount { get; set; }
}