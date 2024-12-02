using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TreasureHunt.Core
{
    public class Edge
    {
        public Node Source { get; set; }
        public Node Destination { get; set; }
        public double Weight { get; set; }

        public Edge(Node source, Node destination, double weight)
        {
            Source = source;
            Destination = destination;
            Weight = weight;
        }
    }
}
