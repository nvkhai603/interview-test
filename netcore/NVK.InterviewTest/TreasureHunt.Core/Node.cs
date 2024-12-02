using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TreasureHunt.Core
{
    public class Node
    {
        public string Name { get; set; }
        public double Distance { get; set; }
        public Node? Previous { get; set; }
        public bool Visited { get; set; }

        public Node(string name)
        {
            Name = name;
            Distance = double.PositiveInfinity;
            Previous = null;
            Visited = false;
        }
    }
}
