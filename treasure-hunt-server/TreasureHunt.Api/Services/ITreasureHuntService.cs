using TreasureHunt.Api.Database;
using TreasureHunt.Api.Models;

namespace TreasureHunt.Api.Services
{
    public interface ITreasureHuntService
    {
        Task<TreasureHuntOutput> CalculateAsync(TreasureHuntInput input, CancellationToken cancellationToken);
        Task<TreasureHuntLog> GetTreasureHuntByIdAsync(int id);
        Task<PagingResult<TreasureHuntLog>> GetTreasureHuntLogsAsync(int page, int pageSize, string search, string sortBy, bool ascending);
    }
}
