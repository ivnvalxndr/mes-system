using AuthService.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace AuthService.Data;

public class ApplicationDbContext : IdentityDbContext<User, Role, int>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Убираем кавычки для всех таблиц
        foreach (var entity in modelBuilder.Model.GetEntityTypes())
        {
            // Убираем кавычки из имени таблицы
            entity.SetTableName(entity.GetTableName()?.ToLower());

            // Убираем кавычки из имен колонок  
            foreach (var property in entity.GetProperties())
            {
                property.SetColumnName(property.GetColumnName()?.ToLower());
            }

            // Убираем кавычки из первичных ключей
            foreach (var key in entity.GetKeys())
            {
                key.SetName(key.GetName()?.ToLower());
            }

            // Убираем кавычки из внешних ключей
            foreach (var foreignKey in entity.GetForeignKeys())
            {
                foreignKey.SetConstraintName(foreignKey.GetConstraintName()?.ToLower());
            }

            // Убираем кавычки из индексов
            foreach (var index in entity.GetIndexes())
            {
                index.SetDatabaseName(index.GetDatabaseName()?.ToLower());
            }
        }

        base.OnModelCreating(modelBuilder);

        // Создание ролей на основе твоего enum (теперь без кавычек)
        modelBuilder.Entity<IdentityRole>().HasData(
            new IdentityRole { Id = "1", Name = UserRole.Operator.ToString(), NormalizedName = "OPERATOR" },
            new IdentityRole { Id = "2", Name = UserRole.Technologist.ToString(), NormalizedName = "TECHNOLOGIST" },
            new IdentityRole { Id = "3", Name = UserRole.Manager.ToString(), NormalizedName = "MANAGER" },
            new IdentityRole { Id = "4", Name = UserRole.Admin.ToString(), NormalizedName = "ADMIN" }
        );

        var adminUser = new User
        {
            Id = 1,
            UserName = "admin@mes.com",
            NormalizedUserName = "ADMIN@MES.COM",
            Email = "admin@mes.com",
            NormalizedEmail = "ADMIN@MES.COM",
            EmailConfirmed = true,
            SecurityStamp = Guid.NewGuid().ToString(),
            FirstName = "Admin",
            LastName = "System"
        };

        // Создание оператора  
        var operatorUser = new User
        {
            Id = 2,
            UserName = "operator@mes.com",
            NormalizedUserName = "OPERATOR@MES.COM",
            Email = "operator@mes.com",
            NormalizedEmail = "OPERATOR@MES.COM",
            EmailConfirmed = true,
            SecurityStamp = Guid.NewGuid().ToString(),
            FirstName = "John",
            LastName = "Operator"
        };

        // Создание технолога
        var technologistUser = new User
        {
            Id = 3,
            UserName = "tech@mes.com",
            NormalizedUserName = "TECH@MES.COM",
            Email = "tech@mes.com",
            NormalizedEmail = "TECH@MES.COM",
            EmailConfirmed = true,
            SecurityStamp = Guid.NewGuid().ToString(),
            FirstName = "Anna",
            LastName = "Technologist"
        };

        // Создание менеджера
        var managerUser = new User
        {
            Id = 4,
            UserName = "manager@mes.com",
            NormalizedUserName = "MANAGER@MES.COM",
            Email = "manager@mes.com",
            NormalizedEmail = "MANAGER@MES.COM",
            EmailConfirmed = true,
            SecurityStamp = Guid.NewGuid().ToString(),
            FirstName = "Michael",
            LastName = "Manager"
        };
    }

}