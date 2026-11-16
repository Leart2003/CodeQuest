using CodeQuest.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CodeQuest.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/worlds")]
    public class WorldsController : ControllerBase
    {
        private readonly IGameService _gameService;

        public WorldsController(IGameService gameService)
        {
            _gameService = gameService;
        }

        [HttpGet]
        public async Task<IActionResult> GetWorlds()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            return Ok(await _gameService.GetWorldsAsync(userId));
        }
    }
}
