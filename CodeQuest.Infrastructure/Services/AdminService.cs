using CodeQuest.Application.DTOs.Admin;
using CodeQuest.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace CodeQuest.Infrastructure.Services
{
    public class AdminService : IAdminService
    {
        public Task<AdminLevelDto> CreateLevelAsync(LevelInputDto dto)
        {
            throw new NotImplementedException();
        }

        public Task<AdminWorldDto> CreateWorldAsync(WorldInputDto dto)
        {
            throw new NotImplementedException();
        }

        public Task<bool> DeleteLevelAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<bool> DeleteWorldAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<AdminLevelDto?> GetLevelAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<List<AdminLevelDto>> GetLevelsAsync(int worldId)
        {
            throw new NotImplementedException();
        }

        public Task<List<AdminWorldDto>> GetWorldsAsync()
        {
            throw new NotImplementedException();
        }

        public Task<AdminLevelDto?> UpdateLevelAsync(int id, LevelInputDto dto)
        {
            throw new NotImplementedException();
        }

        public Task<AdminWorldDto?> UpdateWorldAsync(int id, WorldInputDto dto)
        {
            throw new NotImplementedException();
        }

        public Task<bool> WorldExistsAsync(int id)
        {
            throw new NotImplementedException();
        }
    }
}
