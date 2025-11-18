using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace AuthService.Migrations
{
    /// <inheritdoc />
    public partial class AddUserFirstNameLastName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "roles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RoleType = table.Column<int>(type: "integer", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    Name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_roles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    FirstName = table.Column<string>(type: "text", nullable: false),
                    LastName = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    LastLogin = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    UserName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    Email = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "boolean", nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: true),
                    SecurityStamp = table.Column<string>(type: "text", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "text", nullable: true),
                    PhoneNumber = table.Column<string>(type: "text", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "boolean", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "user_roles",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    RoleId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_roles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_user_roles_roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_user_roles_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "roles",
                columns: new[] { "Id", "ConcurrencyStamp", "Description", "Name", "NormalizedName", "RoleType" },
                values: new object[,]
                {
                    { 1, null, "Оператор производственного оборудования", "Operator", "OPERATOR", 1 },
                    { 2, null, "Технолог, настраивающий производственные процессы", "Technologist", "TECHNOLOGIST", 2 },
                    { 3, null, "Менеджер производства", "Manager", "MANAGER", 3 },
                    { 4, null, "Администратор системы", "Admin", "ADMIN", 4 }
                });

            migrationBuilder.InsertData(
                table: "users",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "CreatedAt", "Email", "EmailConfirmed", "FirstName", "IsActive", "LastLogin", "LastName", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[,]
                {
                    { 1, 0, "6d53b80d-9ff7-4b92-badd-2373fc078f37", new DateTime(2025, 11, 18, 18, 55, 19, 570, DateTimeKind.Utc).AddTicks(928), "admin@mes.com", true, "Admin", true, null, "System", false, null, "ADMIN@MES.COM", "ADMIN@MES.COM", "AQAAAAIAAYagAAAAENd+BrAfFUDuPXyD2D1/gPwss7BAiCxENKq8xaXuER3Xt83U6rYSMup4qap+fOaOEA==", null, false, "52664299-7277-4bd8-96d9-b4944a7bf9a1", false, "admin@mes.com" },
                    { 2, 0, "cef96aa4-f2af-435b-b841-d9983f96801e", new DateTime(2025, 11, 18, 18, 55, 19, 612, DateTimeKind.Utc).AddTicks(6336), "operator@mes.com", true, "John", true, null, "Operator", false, null, "OPERATOR@MES.COM", "OPERATOR@MES.COM", "AQAAAAIAAYagAAAAEO46u2di+IKwpHQA4RqSUSP5Eybeqcc0T6++X0+Ht3cgDXYxfjLsX/w/RDKbS0Q76g==", null, false, "a90baf1c-af67-49ba-80d9-8e85b114521f", false, "operator@mes.com" },
                    { 3, 0, "69905db3-5e57-45b3-ba8a-fa489b57cac8", new DateTime(2025, 11, 18, 18, 55, 19, 655, DateTimeKind.Utc).AddTicks(8476), "tech@mes.com", true, "Anna", true, null, "Technologist", false, null, "TECH@MES.COM", "TECH@MES.COM", "AQAAAAIAAYagAAAAEPtNW+OfXtuDTR4WStgpKXqP+5cvN2m0WQmVifeDNimmLZssQ5vDvVTUejJdVlNtRQ==", null, false, "5363082a-73c3-4dc0-8d36-f200b9f3c876", false, "tech@mes.com" },
                    { 4, 0, "06cfb7bd-90d9-4dbb-b70d-4b2e409a6312", new DateTime(2025, 11, 18, 18, 55, 19, 698, DateTimeKind.Utc).AddTicks(7854), "manager@mes.com", true, "Michael", true, null, "Manager", false, null, "MANAGER@MES.COM", "MANAGER@MES.COM", "AQAAAAIAAYagAAAAEKQR/+fDxltC8Ys5+X6Vj3g0NVFHXQFx3+ApnNN5eXFTgD0QE2TVUFJ5gjXsJ9m8Lg==", null, false, "2173343a-b6b5-41ba-87f5-d1a0a53d29d7", false, "manager@mes.com" }
                });

            migrationBuilder.InsertData(
                table: "user_roles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[,]
                {
                    { 4, 1 },
                    { 1, 2 },
                    { 2, 3 },
                    { 3, 4 }
                });

            migrationBuilder.CreateIndex(
                name: "ix_roles_name",
                table: "roles",
                column: "NormalizedName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_user_roles_RoleId",
                table: "user_roles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "ix_users_email",
                table: "users",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "ix_users_username",
                table: "users",
                column: "NormalizedUserName",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "user_roles");

            migrationBuilder.DropTable(
                name: "roles");

            migrationBuilder.DropTable(
                name: "users");
        }
    }
}
