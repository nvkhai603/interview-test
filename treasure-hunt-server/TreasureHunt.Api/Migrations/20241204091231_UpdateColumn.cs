using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TreasureHunt.Api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "Distance",
                table: "TreasureHuntLog",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<string>(
                name: "Path",
                table: "TreasureHuntLog",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Distance",
                table: "TreasureHuntLog");

            migrationBuilder.DropColumn(
                name: "Path",
                table: "TreasureHuntLog");
        }
    }
}
