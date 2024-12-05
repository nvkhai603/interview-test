using CaseExtensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Any;
using Newtonsoft.Json;
using System.Text.Json.Serialization;
using TreasureHunt.Api.Core;
using TreasureHunt.Api.Database;
using TreasureHunt.Api.Models;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace TreasureHunt.Api.Services
{
    public class TreasureHuntService : ITreasureHuntService
    {

        private readonly TreasureHuntDbContext _dbContext;

        public TreasureHuntService(TreasureHuntDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<TreasureHuntOutput> CalculateAsync(TreasureHuntInput input, CancellationToken cancellationToken)
        {
            // Thêm các cạnh vào đồ thị
            var graph = new Graph<IslandNode>();
            Dictionary<int, HashSet<IslandNode>> islandInLevelDict = new Dictionary<int, HashSet<IslandNode>>();

            //Build START_NODE
            if (input.MatrixMap.ElementAt(0).ElementAt(0) != 1)
            {
                var node = new IslandNode($"START_NODE", 0, 0);
                graph.AddNode(node);
                islandInLevelDict.Add(0, new HashSet<IslandNode>() { node });
            }
            else
            {
                var node = new IslandNode($"START_NODE", 0, 0);
                graph.AddNode(node);
                islandInLevelDict.Add(1, new HashSet<IslandNode>() { node });
            }

            for (int i = 0; i < input.N; i++)
            {
                for (int j = 0; j < input.M; j++)
                {
                    cancellationToken.ThrowIfCancellationRequested();

                    var islandLevel = input.MatrixMap.ElementAt(i).ElementAt(j);
                    if (i == 0 && j == 0 && islandLevel == 1)
                    {
                        continue;
                    }
                    var exist = islandInLevelDict.TryGetValue(islandLevel, out var a);
                    if (!exist)
                    {
                        islandInLevelDict.Add(islandLevel, new HashSet<IslandNode>());
                    }
                    var nodeName = $"{i}_{j}";
                    if (islandLevel == input.P)
                    {
                        nodeName = "END_NODE";
                    }
                    var islandNode = new IslandNode(nodeName, i, j);
                    islandInLevelDict[islandLevel].Add(islandNode);
                }
            }

            for (int x = 1; x <= input.P; x++)
            {
                islandInLevelDict.TryGetValue(x, out var listIslandInLevel);
                islandInLevelDict.TryGetValue(x - 1, out var prevNodes);
                if (listIslandInLevel != null && listIslandInLevel.Any(x => true))
                {
                    foreach (var currentNode in listIslandInLevel)
                    {
                        graph.AddNode(currentNode);
                        if (prevNodes != null && prevNodes.Count > 0)
                        {
                            foreach (var prevNode in prevNodes)
                            {
                                cancellationToken.ThrowIfCancellationRequested();
                                double weight = Math.Sqrt(Math.Pow(prevNode.x - currentNode.x, 2) + Math.Pow(prevNode.y - currentNode.y, 2));
                                graph.AddEdge(prevNode.Name, currentNode.Name, weight);
                            }
                        }
                    }
                }
            }

            graph.Dijkstra("START_NODE", cancellationToken);
            var (distance, path) = graph.GetShortestPath("END_NODE");
            var pointPath = path.Select(x => x.GetPoint()).ToList();
            var logEntity = new TreasureHuntLog
            {
                N = input.M,
                M = input.M,
                P = input.P,
                Distance = Math.Round(distance, 4),
                Path = JsonConvert.SerializeObject(pointPath),
                MatrixMap = JsonConvert.SerializeObject(input.MatrixMap),
                CreatedDate = DateTime.UtcNow
            };

            _dbContext.Add(logEntity);
            await _dbContext.SaveChangesAsync(cancellationToken);
            return new TreasureHuntOutput
            {
                TreasureHuntLog = logEntity,
                Distance = distance,
                Path = logEntity.Path
            };
        }

        public async Task<TreasureHuntLog> GetTreasureHuntByIdAsync(int id)
        {
            // Lấy danh sách bản ghi với phân trang
            return await _dbContext.TreasureHuntLog.AsNoTracking().FirstOrDefaultAsync(x => x.Id.Equals(id));
        }

        public async Task<PagingResult<TreasureHuntLog>> GetTreasureHuntLogsAsync(int page, int pageSize, string search, string sortBy, bool ascending)
        {
            sortBy = sortBy.ToPascalCase();

            // Tính tổng số bản ghi
            var totalCount = await _dbContext.TreasureHuntLog.AsNoTracking()
                .CountAsync();

            // Lấy danh sách bản ghi với phân trang
            var query = _dbContext.TreasureHuntLog.AsNoTracking();
            if (!ascending)
            {
                query = query.OrderByDescending(x => EF.Property<object?>(x, sortBy));
            }
            else
            {
                query = query.OrderBy(x => EF.Property<object?>(x, sortBy));
            }

            var logs = await query.Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

            var result = new PagingResult<TreasureHuntLog>
            {
                Page = page,
                PageSize = pageSize,
                TotalCount = totalCount,
                Data = logs
            };

            return result;
        }
    }
}
