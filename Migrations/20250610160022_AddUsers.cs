using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace BookCart.Migrations
{
    /// <inheritdoc />
    public partial class AddUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "BookId",
                keyValue: 1,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 10, 16, 0, 22, 185, DateTimeKind.Utc).AddTicks(8144));

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "BookId",
                keyValue: 2,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 10, 16, 0, 22, 185, DateTimeKind.Utc).AddTicks(8151));

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "BookId",
                keyValue: 3,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 10, 16, 0, 22, 185, DateTimeKind.Utc).AddTicks(8153));

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "UserId", "Address", "CreatedDate", "Email", "FirstName", "IsActive", "LastName", "PhoneNumber" },
                values: new object[,]
                {
                    { 1, "123 Main St, City, State 12345", new DateTime(2025, 6, 10, 16, 0, 22, 185, DateTimeKind.Utc).AddTicks(8125), "john.doe@example.com", "John", true, "Doe", "+1234567890" },
                    { 2, "456 Oak Ave, City, State 67890", new DateTime(2025, 6, 10, 16, 0, 22, 185, DateTimeKind.Utc).AddTicks(8127), "jane.smith@example.com", "Jane", true, "Smith", "+1987654321" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 2);

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "BookId",
                keyValue: 1,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 10, 15, 57, 18, 448, DateTimeKind.Utc).AddTicks(9914));

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "BookId",
                keyValue: 2,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 10, 15, 57, 18, 448, DateTimeKind.Utc).AddTicks(9931));

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "BookId",
                keyValue: 3,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 10, 15, 57, 18, 448, DateTimeKind.Utc).AddTicks(9933));
        }
    }
}
