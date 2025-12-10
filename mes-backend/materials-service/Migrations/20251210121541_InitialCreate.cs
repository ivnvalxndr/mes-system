using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace materials_service.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "unit",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    code = table.Column<int>(type: "integer", nullable: false),
                    name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    type = table.Column<string>(type: "text", nullable: false),
                    status = table.Column<string>(type: "text", nullable: false, defaultValue: "Available")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_unit", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "material",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    code = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    parent_id = table.Column<int>(type: "integer", nullable: true),
                    unit_id = table.Column<int>(type: "integer", nullable: false),
                    pcs = table.Column<decimal>(type: "numeric(18,3)", precision: 18, scale: 3, nullable: true),
                    mts = table.Column<decimal>(type: "numeric(18,3)", precision: 18, scale: 3, nullable: true),
                    tns = table.Column<decimal>(type: "numeric(18,6)", precision: 18, scale: 6, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_material", x => x.id);
                    table.ForeignKey(
                        name: "fk_material_material_parent_id",
                        column: x => x.parent_id,
                        principalTable: "material",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_material_unit_unit_id",
                        column: x => x.unit_id,
                        principalTable: "unit",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "material_route_steps",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    material_id = table.Column<int>(type: "integer", nullable: false),
                    step_type = table.Column<string>(type: "text", nullable: false),
                    from_location = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    to_location = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    unit_id = table.Column<int>(type: "integer", nullable: true),
                    operation_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    pcs = table.Column<decimal>(type: "numeric(18,3)", precision: 18, scale: 3, nullable: true),
                    mts = table.Column<decimal>(type: "numeric(18,3)", precision: 18, scale: 3, nullable: true),
                    tns = table.Column<decimal>(type: "numeric(18,6)", precision: 18, scale: 6, nullable: true),
                    notes = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_material_route_steps", x => x.id);
                    table.ForeignKey(
                        name: "fk_material_route_steps_material_material_id",
                        column: x => x.material_id,
                        principalTable: "material",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_material_route_steps_unit_unit_id",
                        column: x => x.unit_id,
                        principalTable: "unit",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_material_code",
                table: "material",
                column: "code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_material_parent_id",
                table: "material",
                column: "parent_id");

            migrationBuilder.CreateIndex(
                name: "ix_material_unit_id",
                table: "material",
                column: "unit_id");

            migrationBuilder.CreateIndex(
                name: "ix_material_route_steps_material_id",
                table: "material_route_steps",
                column: "material_id");

            migrationBuilder.CreateIndex(
                name: "IX_material_route_steps_operation_date",
                table: "material_route_steps",
                column: "operation_date");

            migrationBuilder.CreateIndex(
                name: "ix_material_route_steps_unit_id",
                table: "material_route_steps",
                column: "unit_id");

            migrationBuilder.CreateIndex(
                name: "IX_unit_code",
                table: "unit",
                column: "code",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "material_route_steps");

            migrationBuilder.DropTable(
                name: "material");

            migrationBuilder.DropTable(
                name: "unit");
        }
    }
}
