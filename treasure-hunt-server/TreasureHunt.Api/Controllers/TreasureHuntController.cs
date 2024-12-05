using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TreasureHunt.Api.Models;
using TreasureHunt.Api.Services;

namespace TreasureHunt.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TreasureHuntController : ControllerBase
    {
        private ITreasureHuntService _treasureHuntService;
        public TreasureHuntController(ITreasureHuntService treasureHuntService)
        {
                _treasureHuntService = treasureHuntService;
        }

        [HttpPost]
        public async Task<IActionResult> Calculate([FromBody] TreasureHuntInput input, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _treasureHuntService.CalculateAsync(input, cancellationToken);
                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500);
            }
        }

        [HttpGet("log")]
        public async Task<IActionResult> GetTreasureHuntLogs([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string search = "", [FromQuery] string sortBy = "createdDate", [FromQuery] bool ascending = false)
        {
            var result = await _treasureHuntService.GetTreasureHuntLogsAsync(page, pageSize, search, sortBy, ascending);
            return Ok(result);
        }

        [HttpGet("log/{id}")]
        public async Task<IActionResult> GetTreasureHuntById(int id)
        {
            var result = await _treasureHuntService.GetTreasureHuntByIdAsync(id);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }
    }
}
