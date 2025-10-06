using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApi.Migrations
{
    /// <inheritdoc />
    public partial class AddSubCategoryToTreatmentAndFollowUpToHorses : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SubCategory",
                table: "Treatments",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "NumberOfWeeksUntilNextTreatmentHoofcareFollowUp1",
                table: "Horses",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "NumberOfWeeksUntilNextTreatmentHoofcareFollowUp2",
                table: "Horses",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SubCategory",
                table: "Treatments");

            migrationBuilder.DropColumn(
                name: "NumberOfWeeksUntilNextTreatmentHoofcareFollowUp1",
                table: "Horses");

            migrationBuilder.DropColumn(
                name: "NumberOfWeeksUntilNextTreatmentHoofcareFollowUp2",
                table: "Horses");
        }
    }
}
