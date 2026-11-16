using CodeQuest.Application.DTOs.Game;

namespace CodeQuest.Application.Interfaces;

public interface IGameService
{
    Task<List<WorldDto>> GetWorldsAsync(string userId);
    Task<bool> IsLevelUnlockedAsync(int levelId, string userId);
    Task<LevelDetailDto?> GetLevelAsync(int levelId);
    Task<SubmitResultDto> SubmitAnswerAsync(int levelId, SubmitAnswerDto dto, string userId);
}