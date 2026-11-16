using CodeQuest.Application.DTOs.Game;
using CodeQuest.Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CodeQuest.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LevelsController : ControllerBase
    {
        private readonly IGameService _gameService;

        public LevelsController(IGameService gameService)
        {
            _gameService = gameService;
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetLevel(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

            var level = await _gameService.GetLevelAsync(id);
            if (level == null)
                return NotFound();

            if (!await _gameService.IsLevelUnlockedAsync(id, userId))
                return Forbid();

            return Ok(level);
        }

        [HttpPost("{id}/submit")]
        public async Task<IActionResult> Submit(int id, SubmitAnswerDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

            var level = await _gameService.GetLevelAsync(id);
            if (level == null)
                return NotFound();

            if (!await _gameService.IsLevelUnlockedAsync(id, userId))
                return Forbid();

            var result = await _gameService.SubmitAnswerAsync(id, dto, userId);
            return Ok(result);
        }

    }
}
