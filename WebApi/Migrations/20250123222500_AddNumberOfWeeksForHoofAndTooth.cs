using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApi.Migrations
{
    /// <inheritdoc />
    public partial class AddNumberOfWeeksForHoofAndTooth : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "NumberOfWeeksUntilNextTreatment",
                table: "Horses",
                newName: "NumberOfWeeksUntilNextTreatmentToothcare");

            migrationBuilder.AddColumn<int>(
                name: "NumberOfWeeksUntilNextTreatmentHoofcare",
                table: "Horses",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NumberOfWeeksUntilNextTreatmentHoofcare",
                table: "Horses");

            migrationBuilder.RenameColumn(
                name: "NumberOfWeeksUntilNextTreatmentToothcare",
                table: "Horses",
                newName: "NumberOfWeeksUntilNextTreatment");
        }
    }
}
