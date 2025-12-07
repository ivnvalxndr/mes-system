using materials_service.Entities;
using Microsoft.EntityFrameworkCore;
using units_service.Entities;

namespace materials_service.Data;

public class MaterialDbContext : DbContext
{
    public MaterialDbContext(DbContextOptions<MaterialDbContext> options) : base(options) { }

    public DbSet<Material> Materials { get; set; }
    public DbSet<MaterialRouteStep> MaterialRouteSteps { get; set; }
    public DbSet<Unit> Units { get; set; } 
}