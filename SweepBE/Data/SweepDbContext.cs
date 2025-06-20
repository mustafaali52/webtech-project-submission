using Microsoft.EntityFrameworkCore;
using SWEEP.Models;

namespace SWEEP.Data
{
    public class SweepDbContext : DbContext
    {
        public SweepDbContext(DbContextOptions<SweepDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<RefreshToken> RefreshTokens { get; set; } = null!;
        public DbSet<StudentProfile> StudentProfiles { get; set; } = null!;
        public DbSet<EmployerProfile> EmployerProfiles { get; set; } = null!;
        public DbSet<JobTask> JobTasks { get; set; } = null!;
        public DbSet<TaskAssignment> TaskAssignments { get; set; } = null!;
        public DbSet<TaskAttachment> TaskAttachments { get; set; } = null!;
        public DbSet<Field> Fields { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            //unique email
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            //unique fields
            modelBuilder.Entity<Field>()
               .HasIndex(f => f.Name)
               .IsUnique();

            //no dup request
            modelBuilder.Entity<TaskAssignment>()
                .HasIndex(a => new { a.JobTaskId, a.UserId })
                .IsUnique();

            //one-to-one rs
            modelBuilder.Entity<StudentProfile>()
                .HasOne(sp => sp.User)
                .WithOne(u => u.StudentProfile)
                .HasForeignKey<StudentProfile>(sp => sp.UserId);

            modelBuilder.Entity<EmployerProfile>()
                .HasOne(ep => ep.User)
                .WithOne(ep => ep.EmployerProfile)
                .HasForeignKey<EmployerProfile>(ep => ep.UserId);

            modelBuilder.Entity<TaskAssignment>()
                .HasOne(a => a.Student)
                .WithMany(sp => sp.TaskAssignments)
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<TaskAssignment>()
                .HasOne(a => a.JobTask)
                .WithMany(t => t.TaskAssignments)
                .HasForeignKey(a => a.JobTaskId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<TaskAttachment>()
                .HasOne(a => a.JobTask)
                .WithMany(t => t.Attachments)
                .HasForeignKey(a => a.JobTaskId)
                .OnDelete(DeleteBehavior.Cascade);

            //seed data
            modelBuilder.Entity<Field>().HasData(
                new Field { FieldId = 1, Name = "Computer Science" },
                new Field { FieldId = 2, Name = "BBA" },
                new Field { FieldId = 3, Name = "Marketing" },
                new Field { FieldId = 4, Name = "Accounting" },
                new Field { FieldId = 5, Name = "Data Science" },
                new Field { FieldId = 6, Name = "Economics" }
            );

        }

    }
}
