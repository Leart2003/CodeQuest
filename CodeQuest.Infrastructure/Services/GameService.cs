using CodeQuest.Application.DTOs.Game;
using CodeQuest.Application.Interfaces;
using CodeQuest.Domain.Entities;
using CodeQuest.Domain.Enums;
using CodeQuest.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace CodeQuest.Infrastructure.Services
{
    public class GameService : IGameService
    {
        private readonly AppDbContext _context;

        public GameService(AppDbContext context)
        {
            _context = context;
        }
        //
        public async Task<List<WorldDto>> GetWorldsAsync(string userId)
        {
            var worlds = await _context.Worlds
                .Include(w => w.Levels)
                .OrderBy(w => w.Order)
                .ToListAsync();

            var completedIds = (await _context.UserProgresses
           .Where(p => p.UserId == userId && p.IsCompleted)
           .Select(p => p.LevelId)
           .ToListAsync()).ToHashSet();

            var result = new List<WorldDto>();
            bool previousWorldDone = true;

            foreach (var world in worlds)
            {
                var levelDtos = new List<LevelSummaryDto>();
                bool previousLevelDone = true;

                foreach(var level in world.Levels.OrderBy(l => l.Order))
                {
                    bool done = completedIds.Contains(level.Id);

                    levelDtos.Add(new LevelSummaryDto
                    {
                        Id = level.Id,
                        Title = level.Title,
                        Order = level.Order,
                        ChallengeType = level.ChallengeType.ToString(),
                        XpReward = level.XpReward,
                        IsCompleted = done,
                        IsUnlocked = previousWorldDone && previousLevelDone
                    });

                    previousLevelDone = done;

                    int completedCount = levelDtos.Count(l => l.IsCompleted);

                    result.Add(new WorldDto
                    {
                        Id = world.Id,
                        Title = world.Title,
                        Description = world.Description,
                        Order = world.Order,
                        IsUnlocked = previousWorldDone,
                        TotalLevels = levelDtos.Count,
                        CompletedLevels = completedCount,
                        Levels = levelDtos
                    });

                    previousWorldDone = completedCount == levelDtos.Count;


                }

                
            }
            return result;

        }
        public Task<bool> IsLevelUnlockedAsync(int levelId, string userId)
        {
            throw new NotImplementedException();
        }
        public async Task<LevelDetailDto?> GetLevelAsync(int levelId)
        {
            var level = await _context.Levels
                .Include(l => l.Options)
                .FirstOrDefaultAsync(l => l.Id == levelId);

            if (level == null)
            {
                return null;
            }
            IEnumerable<LevelOption> options = level.Options.OrderBy(o => o.Id);

            if (level.ChallengeType == ChallengeType.MultipleChoice ||
          level.ChallengeType == ChallengeType.OrderTheLines)
            {
                options = options.OrderBy(_ => Random.Shared.Next());
            }

            return new LevelDetailDto
            {
                Id = level.Id,
                WorldId = level.WorldId,
                Title = level.Title,
                Question = level.Question,
                CodeSnippet = level.CodeSnippet,
                ChallengeType = level.ChallengeType.ToString(),
                XpReward = level.XpReward,
                Options = options.Select(o => new OptionDto { Id = o.Id, Text = o.Text }).ToList()
            };
        }




        public async Task<SubmitResultDto> SubmitAnswerAsync(int levelId, SubmitAnswerDto dto, string userId)
        {
            var level = await _context.Levels
                .Include(l => l.World)
                .Include(l => l.Options)
                .Include(l => l.Answers)
                .FirstAsync(l => l.Id == levelId);

            bool isCorrect = CheckAnswer(level, dto);

            var progress = await _context.UserProgresses
                .FirstOrDefaultAsync(p => p.UserId == userId && p.LevelId == levelId);

            if (progress == null)
            {
                progress = new UserProgress { UserId = userId, LevelId = levelId };
                _context.UserProgresses.Add(progress);
            }

            bool alreadyCompleted = progress.IsCompleted;
            int xpAwarded = 0;
            progress.Attempts++;

            var user = await _context.Users.FirstAsync(u => u.Id == userId);

            if (isCorrect && !alreadyCompleted)
            {
                progress.IsCompleted = true;
                progress.CompletedAt = DateTime.UtcNow;
                xpAwarded = level.XpReward;
                user.TotalXp += xpAwarded;
            }

            await _context.SaveChangesAsync();

            int? nextLevelId = isCorrect ? await FindNextLevelIdAsync(level) : null;

            string message;
            if (!isCorrect)
                message = "Not quite. Try again!";
            else if (alreadyCompleted)
                message = "Correct! You already completed this level, so no extra XP.";
            else
                message = $"Correct! +{xpAwarded} XP.";

            return new SubmitResultDto
            {
                IsCorrect = isCorrect,
                AlreadyCompleted = alreadyCompleted,
                XpAwarded = xpAwarded,
                TotalXp = user.TotalXp,
                NextLevelId = nextLevelId,
                Message = message
            };
        }

        private static bool CheckAnswer(Level level, SubmitAnswerDto dto)
        {
            switch(level.ChallengeType)
            {
                case ChallengeType.MultipleChoice:
                 case ChallengeType.SpotTheBug:
                        return dto.SelectedOptionId != null &&
                        level.Options.Any(o => o.Id == dto.SelectedOptionId && o.IsCorrect);

                case ChallengeType.FillInTheBlank:
                    var text = (dto.TextAnswer ?? string.Empty).Trim();
                    return level.Answers.Any(a => a.AcceptedAnswer == text);

                case ChallengeType.OrderTheLines:
                    var expected = level.Options
                        .OrderBy(o => o.CorrectPosition)
                        .Select(o => o.Id)
                        .ToList();
                    return dto.OrderedOptionIds != null && dto.OrderedOptionIds.SequenceEqual(expected);

                default:
                    return false;


            }
        }
        private async Task<int?> FindNextLevelIdAsync(Level level)
        {
            var nextInWorld = await _context.Levels
                .Where(l => l.WorldId == level.WorldId && l.Order > level.Order)
                .OrderBy(l => l.Order)
                .FirstOrDefaultAsync();

            if (nextInWorld != null)
                return nextInWorld.Id;

            var nextWorld = await _context.Worlds
                .Include(w => w.Levels)
                .Where(w => w.Order > level.World.Order)
                .OrderBy(w => w.Order)
                .FirstOrDefaultAsync();

            return nextWorld?.Levels.OrderBy(l => l.Order).FirstOrDefault()?.Id;
        }


    }
}
