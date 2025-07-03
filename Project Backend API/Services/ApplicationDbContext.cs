using Event_Mangement_System_WebTech_Project.Models;
using Microsoft.EntityFrameworkCore;

namespace Event_Mangement_System_WebTech_Project.Services
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Location> Locations { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<Registration> Registrations { get; set; }
        public DbSet<EventType> EventTypes { get; set; }
        public object Registerations { get; internal set; }
        public object UserRoles { get; internal set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Unique constraint for email
            modelBuilder.Entity<User>()
                .HasIndex(u => u.email)
                .IsUnique();

            // User ↔ Role
            modelBuilder.Entity<User>()
                .HasOne(u => u.Role)
                .WithMany(r => r.Users)
                .HasForeignKey(u => u.userRoleId)
                .OnDelete(DeleteBehavior.Restrict);

            // Event ↔ Organizer
            modelBuilder.Entity<Event>()
                .HasOne(e => e.Organizer)
                .WithMany(u => u.OrganizedEvents)
                .HasForeignKey(e => e.organizerId)
                .OnDelete(DeleteBehavior.Restrict);

            // Event ↔ Location
            modelBuilder.Entity<Event>()
                .HasOne(e => e.Location)
                .WithMany(l => l.Events)
                .HasForeignKey(e => e.locationId)
                .OnDelete(DeleteBehavior.Restrict);

            // Event ↔ EventType
            modelBuilder.Entity<Event>()
                .HasOne(e => e.EventType)
                .WithMany(et => et.Events)
                .HasForeignKey(e => e.eventTypeId)
                .OnDelete(DeleteBehavior.Restrict);

            // Registration ↔ Attendee & Event
            modelBuilder.Entity<Registration>()
                .HasOne(r => r.Attendee)
                .WithMany(u => u.Registrations)
                .HasForeignKey(r => r.attendeeId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Registration>()
                .HasOne(r => r.Event)
                .WithMany(e => e.Registrations)
                .HasForeignKey(r => r.eventId)
                .OnDelete(DeleteBehavior.Cascade);

            //Prevent same attendee from registering to the same event more than once
            modelBuilder.Entity<Registration>()
                .HasIndex(r => new { r.attendeeId, r.eventId })
                .IsUnique();

            // Index to assist with location/date overlap checks
            modelBuilder.Entity<Event>()
                .HasIndex(e => new { e.locationId, e.startDate, e.endDate });
        }

    }
}
