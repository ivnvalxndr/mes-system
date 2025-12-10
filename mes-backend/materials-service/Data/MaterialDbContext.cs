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

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Используем Snake Case для имен таблиц и колонок
        foreach (var entity in modelBuilder.Model.GetEntityTypes())
        {
            // Задаем имя таблицы в snake_case 
            var tableName = entity.GetTableName();
            entity.SetTableName(tableName?.ToLower());

            // Задаем имена колонок в snake_case
            foreach (var property in entity.GetProperties())
            {
                property.SetColumnName(ToSnakeCase(property.Name));
            }

            // Задаем имена ключей в snake_case
            foreach (var key in entity.GetKeys())
            {
                key.SetName(ToSnakeCase(key.GetName()!));
            }

            // Задаем имена внешних ключей в snake_case
            foreach (var foreignKey in entity.GetForeignKeys())
            {
                foreignKey.SetConstraintName(ToSnakeCase(foreignKey.GetConstraintName()!));
            }
        }

        // Конфигурация Unit (производственные участки/склады)
        modelBuilder.Entity<Unit>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.UnitNumber).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.Model).HasMaxLength(100);
            entity.Property(e => e.Manufacturer).HasMaxLength(100);
            entity.Property(e => e.SerialNumber).HasMaxLength(100);
            entity.Property(e => e.Location).HasMaxLength(200);
            entity.Property(e => e.CreatedBy).HasMaxLength(100);

            // Enum конвертация
            entity.Property(e => e.Type)
                  .HasConversion<int>(); // Сохраняем как int в БД

            entity.Property(e => e.Status)
                  .HasConversion<int>(); // Сохраняем как int в БД

            // Дефолтные значения для дат
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("NOW()");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("NOW()");
        });

        // Конфигурация Material
        modelBuilder.Entity<Material>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Code).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.Quantity).HasColumnType("decimal(18,3)");
            entity.Property(e => e.Price).HasColumnType("decimal(18,2)");
            entity.Property(e => e.UnitId).IsRequired();

            // Явно указываем какое свойство использовать как Foreign Key
            entity.HasOne(e => e.Unit)                 // Навигационное свойство
                .WithMany()                          // Unit может иметь много Materials
                .HasForeignKey(e => e.UnitId)        // Явно указываем свойство UnitId
                .OnDelete(DeleteBehavior.Restrict);  // или Cascade
        });

        // Конфигурация MaterialRouteStep
        modelBuilder.Entity<MaterialRouteStep>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.FromLocation).IsRequired().HasMaxLength(200);
            entity.Property(e => e.ToLocation).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Quantity).HasColumnType("decimal(18,3)");
            entity.Property(e => e.UnitId).HasMaxLength(50); // строка, не ссылка на Unit!
            entity.Property(e => e.Notes).HasMaxLength(1000);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("NOW()");

            // Enum конвертация
            entity.Property(e => e.StepType)
                  .HasConversion<int>();

            // Связь MaterialRouteStep → Material
            entity.HasOne(e => e.Material)
                  .WithMany(m => m.RouteSteps)
                  .HasForeignKey(e => e.MaterialId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }

    private string ToSnakeCase(string input)
    {
        if (string.IsNullOrEmpty(input))
            return input;

        // Исправленная версия метода
        var result = new System.Text.StringBuilder();
        for (int i = 0; i < input.Length; i++)
        {
            char currentChar = input[i];
            if (i > 0 && char.IsUpper(currentChar))
            {
                result.Append('_');
                result.Append(char.ToLower(currentChar));
            }
            else
            {
                result.Append(char.ToLower(currentChar));
            }
        }
        return result.ToString();
    }
}