using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

public class DatabaseContext : IdentityDbContext<IdentityUser>
{
    public DbSet<Horse> Horses { get; set; }
    public DbSet<Treatment> Treatments { get; set; }
    public DbSet<TreatmentCategory> TreatmentCategories { get; set; }
    public DbSet<Routine> Routines { get; set; }
    public DbSet<File> Files { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        var Username = Environment.GetEnvironmentVariable("POSTGRES_USER");
        var Password = Environment.GetEnvironmentVariable("POSTGRES_PASSWORD");
        var Database = Environment.GetEnvironmentVariable("POSTGRES_DB");
        optionsBuilder.UseNpgsql($"Host=postgres;Username={Username};Password={Password};Database={Database}");
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Horse>()
            .HasMany(e => e.Treatments)
            .WithOne(e => e.Horse)
            .IsRequired(false);

        modelBuilder.Entity<Horse>()
            .HasMany(e => e.Files)
            .WithOne(e => e.Horse)
            .IsRequired(false);

        modelBuilder.Entity<Horse>()
            .HasMany(e => e.Routines)
            .WithOne(e => e.Horse)
            .IsRequired(false);

    }
}
