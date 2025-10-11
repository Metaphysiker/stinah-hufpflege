using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApi.Migrations
{
    /// <inheritdoc />
    public partial class AddClearFollowUpNotesToTreatments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "ClearFollowUp1AdvanceNotice",
                table: "Treatments",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ClearFollowUp2AdvanceNotice",
                table: "Treatments",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ClearFollowUp1AdvanceNotice",
                table: "Treatments");

            migrationBuilder.DropColumn(
                name: "ClearFollowUp2AdvanceNotice",
                table: "Treatments");
        }
    }
}
