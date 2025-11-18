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
        base.OnModelCreating(modelBuilder);

        // Переименовываем таблицы
        modelBuilder.Entity<User>().ToTable("users");
        modelBuilder.Entity<Role>().ToTable("roles");
        modelBuilder.Entity<IdentityUserRole<int>>().ToTable("user_roles");

        // Переименовываем индексы чтобы избежать конфликтов
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(u => u.NormalizedUserName).HasDatabaseName("ix_users_username");
            entity.HasIndex(u => u.NormalizedEmail).HasDatabaseName("ix_users_email");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasIndex(r => r.NormalizedName).HasDatabaseName("ix_roles_name");
        });

        // УДАЛЯЕМ лишние таблицы
        modelBuilder.Ignore<IdentityUserClaim<int>>();
        modelBuilder.Ignore<IdentityUserLogin<int>>();
        modelBuilder.Ignore<IdentityUserToken<int>>();
        modelBuilder.Ignore<IdentityRoleClaim<int>>();

        // Остальной код создания данных...
        modelBuilder.Entity<Role>().HasData(
            new Role(UserRole.Operator) { Id = 1, NormalizedName = "OPERATOR" },
            new Role(UserRole.Technologist) { Id = 2, NormalizedName = "TECHNOLOGIST" },
            new Role(UserRole.Manager) { Id = 3, NormalizedName = "MANAGER" },
            new Role(UserRole.Admin) { Id = 4, NormalizedName = "ADMIN" }
        );

        var hasher = new PasswordHasher<User>();

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
        adminUser.PasswordHash = hasher.HashPassword(adminUser, "Admin123!");

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
        operatorUser.PasswordHash = hasher.HashPassword(operatorUser, "Operator123!");

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
        technologistUser.PasswordHash = hasher.HashPassword(technologistUser, "Tech123!");

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
        managerUser.PasswordHash = hasher.HashPassword(managerUser, "Manager123!");

        modelBuilder.Entity<User>().HasData(adminUser, operatorUser, technologistUser, managerUser);
        modelBuilder.Entity<IdentityUserRole<int>>().HasData(
            new IdentityUserRole<int> { UserId = 1, RoleId = 4 }, // Admin
            new IdentityUserRole<int> { UserId = 2, RoleId = 1 }, // Operator
            new IdentityUserRole<int> { UserId = 3, RoleId = 2 }, // Technologist
            new IdentityUserRole<int> { UserId = 4, RoleId = 3 }  // Manager
        );
    }
}