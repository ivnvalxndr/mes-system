using System.Collections.Generic;
using System.Reflection.Emit;
using Microsoft.EntityFrameworkCore;
using units_service.Entities;

namespace units_service.Data;

public class UnitDbContext : DbContext
{
    public UnitDbContext(DbContextOptions<UnitDbContext> options) : base(options) { }

    public DbSet<Unit> Units { get; set; }
    public DbSet<UnitStatusHistory> UnitStatusHistories { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Индексы для оптимизации
        modelBuilder.Entity<Unit>()
            .HasIndex(u => u.Status);

        modelBuilder.Entity<Unit>()
            .HasIndex(u => u.Type);

        modelBuilder.Entity<UnitStatusHistory>()
            .HasIndex(u => u.UnitId);
    }
}