using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TreasureHunt.Api.Core
{
    public class IslandNode : Node
    {
        public int x { get; set; }
        public int y { get; set; }
        public IslandNode(string name, int x, int y) : base(name)
        {
            this.x = x;
            this.y = y;
        }
    }
}
