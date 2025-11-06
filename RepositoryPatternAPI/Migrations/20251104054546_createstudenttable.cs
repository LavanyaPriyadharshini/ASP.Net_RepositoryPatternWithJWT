using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RepositoryPatternAPI.Migrations
{
    /// <inheritdoc />
    public partial class createstudenttable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
              name: "Students",
              columns: table => new
              {
                  Id = table.Column<int>(nullable: false)
                      .Annotation("SqlServer:Identity", "1, 1"),
                  StudentName = table.Column<string>(nullable: false),
                  DateOfBirth = table.Column<DateTime>(nullable: false),
                  Age = table.Column<int>(nullable: false),
                  MaritalStatus = table.Column<string>(nullable: true),
                  Gender = table.Column<string>(nullable: true),
                  Percentage = table.Column<double>(nullable: false),
                  Address = table.Column<string>(nullable: true),
                  EmailId = table.Column<string>(nullable: true),
                  ContactNo = table.Column<string>(nullable: true)
              },
              constraints: table =>
              {
                  table.PrimaryKey("PK_Students", x => x.Id);
              });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
