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
        public async Task<IActionResult> Post([FromBody] TreasureHuntInput input)
        {
            var result = await _treasureHuntService.Calculate(input);
            return Ok(result);
        }

        [HttpGet("log")]
        public async Task<IActionResult> GetLog([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string search = "", [FromQuery] string sortBy = "date", [FromQuery] bool ascending = true)
        {
            var result = await _treasureHuntService.GetLogs(page, pageSize, search, sortBy, ascending);
            return Ok(result);
        }
    }
}
