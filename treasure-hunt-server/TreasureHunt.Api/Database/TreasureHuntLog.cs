using System.ComponentModel.DataAnnotations;

namespace TreasureHunt.Api.Database
{
    public class TreasureHuntLog
    {
        [Key]
        public int Id { get; set; }
        public int M { get; set; }
        public int N { get; set; }
        public int P { get; set; }
        public string MatrixMap { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
