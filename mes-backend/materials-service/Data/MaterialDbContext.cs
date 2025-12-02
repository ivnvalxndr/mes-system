using materials_service.Entities;
using Microsoft.EntityFrameworkCore;

namespace materials_service.Data;

public class MaterialDbContext : DbContext
{
    public MaterialDbContext(DbContextOptions<MaterialDbContext> options) : base(options) { }

    public DbSet<Material> Materials { get; set; }
    public DbSet<MaterialRouteStep> MaterialRouteSteps { get; set; }
}