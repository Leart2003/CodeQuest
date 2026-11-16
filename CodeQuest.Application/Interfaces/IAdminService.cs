using CodeQuest.Application.DTOs.Admin;

namespace CodeQuest.Application.Interfaces;

public interface IAdminService
{
    Task<List<AdminWorldDto>> GetWorldsAsync();
    Task<AdminWorldDto> CreateWorldAsync(WorldInputDto dto);
    Task<AdminWorldDto?> UpdateWorldAsync(int id, WorldInputDto dto);
    Task<bool> DeleteWorldAsync(int id);
    Task<bool> WorldExistsAsync(int id);

    Task<List<AdminLevelDto>> GetLevelsAsync(int worldId);
    Task<AdminLevelDto?> GetLevelAsync(int id);
    Task<AdminLevelDto> CreateLevelAsync(LevelInputDto dto);
    Task<AdminLevelDto?> UpdateLevelAsync(int id, LevelInputDto dto);
    Task<bool> DeleteLevelAsync(int id);
}