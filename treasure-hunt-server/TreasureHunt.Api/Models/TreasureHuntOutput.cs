using TreasureHunt.Api.Database;

namespace TreasureHunt.Api.Models
{
    public class TreasureHuntOutput
    {
        public double Distance { get; set; }
        public string Path { get; set; }
        public TreasureHuntLog TreasureHuntLog { get; set; }
    }
}
