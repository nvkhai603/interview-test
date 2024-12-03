namespace TreasureHunt.Api.Models
{
    public class TreasureHuntInput
    {
        public int N { get; set; }
        public int M { get; set; }
        public int P { get; set; }
        public IList<int[]> MatrixMap { get; set; }
    }
}
