using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Text.Json.Serialization;
using TreasureHunt.Api.Core;
using TreasureHunt.Api.Database;
using TreasureHunt.Api.Models;

namespace TreasureHunt.Api.Services
{
    public class TreasureHuntService : ITreasureHuntService
    {
        private readonly TreasureHuntDbContext _dbContext;
        public TreasureHuntService(TreasureHuntDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<TreasureHuntOutput> Calculate(TreasureHuntInput input)
        {
            // Thêm các cạnh vào đồ thị
            var graph = new Graph<IslandNode>();
            Dictionary<int, HashSet<IslandNode>> __temp = new Dictionary<int, HashSet<IslandNode>>();

            //Build START_NODE
            if (input.MatrixMap.ElementAt(0).ElementAt(0) != 1)
            {
                var node = new IslandNode($"START_NODE", 0, 0);
                graph.AddNode(node);
                __temp.Add(0, new HashSet<IslandNode>() { node });
            }
            else
            {
                var node = new IslandNode($"START_NODE", 0, 0);
                graph.AddNode(node);
            }

            for (int i = 0; i < input.N; i++)
            {
                for (int j = 0; j < input.N; j++)
                {
                    var islandLevel = input.MatrixMap.ElementAt(i).ElementAt(j);
                    var exist = __temp.TryGetValue(islandLevel, out var a);
                    if (!exist)
                    {
                        __temp.Add(islandLevel, new HashSet<IslandNode>());
                    }
                    var nodeName = $"{i}_{j}";
                    if (islandLevel == input.P)
                    {
                        nodeName = "END_NODE";
                    }
                    var islandNode = new IslandNode(nodeName, i, j);
                    __temp[islandLevel].Add(islandNode);
                }
            }

            for (int x = 1; x <= input.P; x++)
            {
                __temp.TryGetValue(x, out var listIslandInLevel);
                __temp.TryGetValue(x - 1, out var prevNodes);
                if (listIslandInLevel != null && listIslandInLevel.Any(x => true))
                {
                    foreach (var currentNode in listIslandInLevel)
                    {
                        graph.AddNode(currentNode);
                        if (prevNodes != null && prevNodes.Count > 0)
                        {
                            foreach (var prevNode in prevNodes)
                            {
                                double weight = Math.Sqrt(Math.Pow(prevNode.x - currentNode.x, 2) + Math.Pow(prevNode.y - currentNode.y, 2));
                                graph.AddEdge(prevNode.Name, currentNode.Name, weight);
                            }
                        }
                    }
                }
            }

            graph.Dijkstra("START_NODE");
            var (distance, path) = graph.GetShortestPath("END_NODE");
            var logEntity = new TreasureHuntLog
            {
                N = input.M,
                M = input.M,
                P = input.P,
                MatrixMap = JsonConvert.SerializeObject(input.MatrixMap),
                CreatedDate = DateTime.Now
            };

            _dbContext.Add(logEntity);
            await _dbContext.SaveChangesAsync();
            return new TreasureHuntOutput
            {
                Distance = distance,
                Path = path
            };
        }

        public async Task<IEnumerable<TreasureHuntLog>> GetLogs()
        {
            var logs = await _dbContext.TreasureHuntLog.OrderByDescending(x => x.CreatedDate).Skip(0).Take(20).ToListAsync();
            return logs;
        }
    }
}
