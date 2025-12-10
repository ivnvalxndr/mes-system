using Microsoft.EntityFrameworkCore;
using materials_service.Entities;
using units_service.Entities;
using units_service.Entities.Enums;

namespace materials_service.Data
{
    public class MaterialDbContext : DbContext
    {
        public MaterialDbContext(DbContextOptions<MaterialDbContext> options)
            : base(options)
        {
        }

        public DbSet<Material> Materials { get; set; }
        public DbSet<MaterialRouteStep> MaterialRouteSteps { get; set; }
        public DbSet<Unit> Units { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Устанавливаем имена таблиц и колонок в lowercase
            foreach (var entity in modelBuilder.Model.GetEntityTypes())
            {
                // Устанавливаем имя таблицы в lowercase
                entity.SetTableName(entity.GetTableName().ToLower());

                // Устанавливаем имена колонок в lowercase
                foreach (var property in entity.GetProperties())
                {
                    property.SetColumnName(property.GetColumnName().ToLower());
                }

                // Устанавливаем имена внешних ключей в lowercase
                foreach (var key in entity.GetForeignKeys())
                {
                    key.SetConstraintName(key.GetConstraintName().ToLower());
                }

                // Устанавливаем имена индексов в lowercase
                foreach (var index in entity.GetIndexes())
                {
                    index.SetDatabaseName(index.GetDatabaseName().ToLower());
                }
            }

            // Конфигурация для Unit
            modelBuilder.Entity<Unit>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Code)
                    .IsRequired();
                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(200);
                entity.Property(e => e.Description)
                    .HasMaxLength(500);
                entity.Property(e => e.Type)
                    .IsRequired()
                    .HasConversion<string>(); // Сохраняем enum как string
                entity.Property(e => e.Status)
                    .IsRequired()
                    .HasConversion<string>() // Сохраняем enum как string
                    .HasDefaultValue(UnitStatus.Available);

                // Уникальный индекс для Code
                entity.HasIndex(e => e.Code)
                      .IsUnique();
            });

            // Конфигурация для Material
            modelBuilder.Entity<Material>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Code)
                    .IsRequired()
                    .HasMaxLength(50);
                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(200);
                entity.Property(e => e.Description)
                    .HasMaxLength(500);
                entity.Property(e => e.ParentId)
                    .IsRequired(false);
                entity.Property(e => e.UnitId)
                    .IsRequired();
                entity.Property(e => e.Pcs)
                    .HasPrecision(18, 3)
                    .IsRequired(false);
                entity.Property(e => e.Mts)
                    .HasPrecision(18, 3)
                    .IsRequired(false);
                entity.Property(e => e.Tns)
                    .HasPrecision(18, 6)
                    .IsRequired(false);

                // Иерархическая связь (родитель-потомки)
                entity.HasOne(m => m.Parent)
                      .WithMany(m => m.Children)
                      .HasForeignKey(m => m.ParentId)
                      .OnDelete(DeleteBehavior.Restrict);

                // Связь с Unit
                entity.HasOne(m => m.Unit)
                      .WithMany()
                      .HasForeignKey(m => m.UnitId)
                      .OnDelete(DeleteBehavior.Restrict);

                // Связь с MaterialRouteSteps
                entity.HasMany(m => m.RouteSteps)
                      .WithOne(rs => rs.Material)
                      .HasForeignKey(rs => rs.MaterialId)
                      .OnDelete(DeleteBehavior.Cascade);

                // Уникальный индекс для Code
                entity.HasIndex(e => e.Code)
                      .IsUnique();
                entity.HasIndex(e => e.ParentId);
                entity.HasIndex(e => e.UnitId);
            });

            // Конфигурация для MaterialRouteStep
            modelBuilder.Entity<MaterialRouteStep>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.FromLocation)
                    .IsRequired()
                    .HasMaxLength(200);
                entity.Property(e => e.ToLocation)
                    .IsRequired()
                    .HasMaxLength(200);
                entity.Property(e => e.StepType)
                    .IsRequired()
                    .HasConversion<string>();
                entity.Property(e => e.OperationDate)
                    .IsRequired();
                entity.Property(e => e.Notes)
                    .HasMaxLength(1000);
                entity.Property(e => e.Pcs)
                    .HasPrecision(18, 3)
                    .IsRequired(false);
                entity.Property(e => e.Mts)
                    .HasPrecision(18, 3)
                    .IsRequired(false);
                entity.Property(e => e.Tns)
                    .HasPrecision(18, 6)
                    .IsRequired(false);
                entity.Property(e => e.CreatedAt)
                    .HasDefaultValueSql("NOW()");

                // Связь с Material
                entity.HasOne(rs => rs.Material)
                      .WithMany(m => m.RouteSteps)
                      .HasForeignKey(rs => rs.MaterialId)
                      .OnDelete(DeleteBehavior.Cascade);

                // Связь с Unit
                entity.HasOne(rs => rs.Unit)
                      .WithMany()
                      .HasForeignKey(rs => rs.UnitId)
                      .OnDelete(DeleteBehavior.SetNull);

                // Индексы для оптимизации запросов
                entity.HasIndex(e => e.MaterialId);
                entity.HasIndex(e => e.OperationDate);
                entity.HasIndex(e => e.UnitId);
            });
        }
    }
}