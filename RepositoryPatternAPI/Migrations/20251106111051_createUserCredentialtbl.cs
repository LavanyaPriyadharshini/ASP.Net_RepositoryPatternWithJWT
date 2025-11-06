using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RepositoryPatternAPI.Migrations
{
    /// <inheritdoc />
    public partial class createUserCredentialtbl : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
              name: "UserCredentials_Tbl",
              columns: table => new
              {
                  UserId = table.Column<int>(nullable: false)
                      .Annotation("SqlServer:Identity", "1, 1"),
                  Username = table.Column<string>(nullable: false),
                  Password = table.Column<string>(nullable: false),
                  Role = table.Column<string>(nullable: false),
                  Email = table.Column<string>(nullable: true),
                  Date = table.Column<DateTime>(nullable: true),
                  ContactNumber = table.Column<long>(nullable: true),

              },
              constraints: table =>
              {
                  table.PrimaryKey("PK_UserCredentials_Tbl", x => x.UserId);
              });
        }



        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Students",
                table: "Students");

            migrationBuilder.RenameTable(
                name: "Students",
                newName: "StudentDetails_tbl");

            migrationBuilder.RenameIndex(
                name: "IX_Students_StudentName",
                table: "StudentDetails_tbl",
                newName: "IX_StudentDetails_tbl_StudentName");

            migrationBuilder.AddPrimaryKey(
                name: "PK_StudentDetails_tbl",
                table: "StudentDetails_tbl",
                column: "Id");
        }
    }
}
