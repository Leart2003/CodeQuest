using CodeQuest.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CodeQuest.API.Controllers
{
    
    [ApiController]
    [Route("api/leaderboard")]
    public class LeaderboardController : ControllerBase
    {
        private readonly IGameService _gameService;

        public LeaderboardController(IGameService gameService)
        {
            _gameService = gameService;
        }

        [HttpGet]

        public async Task<IActionResult> GetLeaderboard()
        {

            return Ok(await _gameService.GetLeaderboardAsync(10));
        }

    }
}
