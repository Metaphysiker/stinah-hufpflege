using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace WebApi.Migrations
{
    /// <inheritdoc />
    public partial class UpdateHorseTreatmentAndFile : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Horses_Horses_HorseId",
                table: "Horses");

            migrationBuilder.DropIndex(
                name: "IX_Horses_HorseId",
                table: "Horses");

            migrationBuilder.DropColumn(
                name: "HorseId",
                table: "Horses");

            migrationBuilder.CreateTable(
                name: "Files",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    FileKeyString = table.Column<string>(type: "text", nullable: false),
                    HorseId = table.Column<int>(type: "integer", nullable: true),
                    TreatmentId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Files", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Files_Horses_HorseId",
                        column: x => x.HorseId,
                        principalTable: "Horses",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Files_Treatments_TreatmentId",
                        column: x => x.TreatmentId,
                        principalTable: "Treatments",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Files_HorseId",
                table: "Files",
                column: "HorseId");

            migrationBuilder.CreateIndex(
                name: "IX_Files_TreatmentId",
                table: "Files",
                column: "TreatmentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Files");

            migrationBuilder.AddColumn<int>(
                name: "HorseId",
                table: "Horses",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Horses_HorseId",
                table: "Horses",
                column: "HorseId");

            migrationBuilder.AddForeignKey(
                name: "FK_Horses_Horses_HorseId",
                table: "Horses",
                column: "HorseId",
                principalTable: "Horses",
                principalColumn: "Id");
        }
    }
}
