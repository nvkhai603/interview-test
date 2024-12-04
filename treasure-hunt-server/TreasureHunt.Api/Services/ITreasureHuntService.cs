﻿using TreasureHunt.Api.Database;
using TreasureHunt.Api.Models;

namespace TreasureHunt.Api.Services
{
    public interface ITreasureHuntService
    {
        public Task<TreasureHuntOutput> Calculate(TreasureHuntInput input);
        public Task<IEnumerable<TreasureHuntLog>> GetLogs(int page, int pageSize, string search, string sortBy, bool ascending);
    }
}
