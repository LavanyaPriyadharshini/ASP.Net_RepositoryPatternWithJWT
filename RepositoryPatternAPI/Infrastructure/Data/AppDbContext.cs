
using Microsoft.EntityFrameworkCore;
using RepositoryPatternAPI.Domain.Entities;

namespace RepositoryPatternAPI.Infrastructure.Data

{

        public class AppDbContext : DbContext
        {
            public AppDbContext(DbContextOptions<AppDbContext> options)
                : base(options)
            {
            }

        // This represents your table in the database
        public DbSet<Student> Students { get; set; }

        public DbSet<UserCredentials> UserCredentials_Tbl { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Explicitly map entity to the existing table name
            modelBuilder.Entity<Student>().ToTable("Students");

            modelBuilder.Entity<UserCredentials>().ToTable("UserCredentials_Tbl");

            // Optional: Enforce unique StudentName
            modelBuilder.Entity<Student>()
                .HasIndex(s => s.StudentName)
                .IsUnique();
        }


    }
}
