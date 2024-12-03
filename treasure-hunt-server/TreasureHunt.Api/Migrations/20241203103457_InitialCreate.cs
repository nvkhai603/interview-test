using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TreasureHunt.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TreasureHuntLog",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    M = table.Column<int>(type: "INTEGER", nullable: false),
                    N = table.Column<int>(type: "INTEGER", nullable: false),
                    P = table.Column<int>(type: "INTEGER", nullable: false),
                    MatrixMap = table.Column<string>(type: "TEXT", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TreasureHuntLog", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TreasureHuntLog");
        }
    }
}
