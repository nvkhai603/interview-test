// See https://aka.ms/new-console-template for more information
// Console.WriteLine("Hello, World!");
using System.Collections.Generic;
using System.Numerics;
using System.Xml.Linq;
using TreasureHunt.Core;

int n = 3;
int m = 3;
int p = 3;

int[,] matrix = { { 3, 2, 2 }, { 2, 2, 2 }, { 2, 2, 1 } };

Console.WriteLine(matrix[0, 0]);

// Thêm các cạnh vào đồ thị
var graph = new Graph<IslandNode>();

Dictionary<int, List<IslandNode>> nodeLevels = new Dictionary<int, List<IslandNode>>();

Dictionary<int, HashSet<IslandNode>> __temp = new Dictionary<int, HashSet<IslandNode>>();

// Build Cho Level 0
//if (matrix[0, 0] != 1)
//{
//    var node = new IslandNode($"START_NODE", 0, 0);
//    graph.AddNode(node);
//    nodeLevels.Add(0, new List<IslandNode> { node });
//}

for (int i = 0; i < n; i++)
{
    for (int j = 0; j < m; j++)
    {
        var islandLevel = matrix[i, j];
        var exist = __temp.TryGetValue(islandLevel, out var a);
        if (!exist)
        {
            __temp.Add(islandLevel, new HashSet<IslandNode>());
        }
        var islandNode = new IslandNode($"{i}_{j}", i, j);
        __temp[islandLevel].Add(islandNode);
    }
}

for (int x = 1; x <= p; x++)
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



//for (int x = 1; x <= p; x++)
//{
//    if (x == 1 && matrix[0, 0] == 1 )
//    {
//        continue;
//    }
//    List<IslandNode> nodesInLevel = new List<IslandNode> { };
//    for (int i = 0; i < n; i++)
//    {
//        for (int j = 0; j < m; j++)
//        {
//            if (matrix[i, j] == x)
//            {
//                // Node end
//                string nodeName = $"{x}_{i}_{j}";
//                if (x == p)
//                {
//                    nodeName = "END_NODE";
//                }
//                var node = new IslandNode(nodeName, i, j);
//                graph.AddNode(node);
//                nodesInLevel.Add(node);
//                // Thêm cạnh
//                nodeLevels.TryGetValue(x -1, out var prevNodes);
//                if (prevNodes?.Count > 0)
//                {
//                    foreach (var prevNode in prevNodes)
//                    {
//                        double weight = Math.Sqrt(Math.Pow(prevNode.x - i, 2) + Math.Pow(prevNode.y - j, 2));
//                        graph.AddEdge(prevNode.Name, node.Name, weight);
//                    }
//                }
//            }
//        }
//    }
//    nodeLevels.Add(x, nodesInLevel);
//}

graph.Dijkstra("START_NODE");
graph.PrintShortestPath("END_NODE");

Console.WriteLine("OK");
