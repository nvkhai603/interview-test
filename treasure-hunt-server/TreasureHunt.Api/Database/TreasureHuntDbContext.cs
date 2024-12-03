using Microsoft.EntityFrameworkCore;

namespace TreasureHunt.Api.Database
{
    public class TreasureHuntDbContext: DbContext
    {

        public DbSet<TreasureHuntLog> TreasureHuntLog { get; set; }

        public string DbPath { get; }
        public TreasureHuntDbContext()
        {
            var path = Path.Combine(System.AppContext.BaseDirectory, "SqlLite");
            DbPath = Path.Join(path, "TreasureHunt.db");
        }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
        => options.UseSqlite($"Data Source={DbPath}");
    }
}
