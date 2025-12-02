using Microsoft.EntityFrameworkCore;
using ProductionService.Entities;

namespace ProductionService.Data;

public class ProductionDbContext : DbContext
{
    public ProductionDbContext(DbContextOptions<ProductionDbContext> options) : base(options) { }

    public DbSet<ProductionOrder> ProductionOrders { get; set; }
    public DbSet<ProductionPlan> ProductionPlans { get; set; }
}