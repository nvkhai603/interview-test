using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TreasureHunt.Core
{
    public class Graph<TNode> where TNode : Node
    {
        private Dictionary<string, TNode> nodes;
        private List<Edge> edges;

        public Graph()
        {
            nodes = new Dictionary<string, TNode>();
            edges = new List<Edge>();
        }

        public void AddNode(TNode node)
        {
            nodes.Add(node.Name, node);
        }

        // Thêm cạnh mới vào đồ thị
        public void AddEdge(string sourceName, string destName, double weight)
        {
            Node source = nodes[sourceName];
            Node destination = nodes[destName];
            edges.Add(new Edge(source, destination, weight));
        }

        // Thuật toán Dijkstra
        public void Dijkstra(string startNodeName)
        {
            if (!nodes.ContainsKey(startNodeName))
                throw new ArgumentException("Start node not found in graph");

            // Khởi tạo node bắt đầu
            Node startNode = nodes[startNodeName];
            startNode.Distance = 0;

            // Priority queue để lưu các node cần xét
            var queue = new PriorityQueue<Node, double>();
            queue.Enqueue(startNode, 0);

            while (queue.Count > 0)
            {
                var current = queue.Dequeue();

                if (current.Visited)
                    continue;

                current.Visited = true;

                // Tìm tất cả các cạnh từ node hiện tại
                var currentEdges = edges.Where(e => e.Source == current);

                foreach (var edge in currentEdges)
                {
                    var neighbor = edge.Destination;
                    var distance = current.Distance + edge.Weight;

                    if (distance < neighbor.Distance)
                    {
                        neighbor.Distance = distance;
                        neighbor.Previous = current;
                        queue.Enqueue(neighbor, distance);
                    }
                }
            }
        }

        // In đường đi ngắn nhất đến một node
        public void PrintShortestPath(string endNodeName)
        {
            if (!nodes.ContainsKey(endNodeName))
                throw new ArgumentException("End node not found in graph");

            var endNode = nodes[endNodeName];
            var path = new List<string>();
            var current = endNode;

            while (current != null)
            {
                path.Add(current.Name);
                current = (TNode)current?.Previous;
            }
            path.Reverse();
            Console.WriteLine($"Shortest path: {string.Join(" -> ", path)}");
            Console.WriteLine($"Total distance: {endNode.Distance}");
        }
    }
}
