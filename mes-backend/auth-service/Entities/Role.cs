using Microsoft.AspNetCore.Identity;

namespace AuthService.Entities;

public class Role : IdentityRole<int>
{
    public UserRole RoleType { get; set; }
    public string? Description { get; set; }

    public Role() : base() { }

    public Role(UserRole roleType) : base(roleType.ToString())
    {
        RoleType = roleType;
        Description = GetDefaultDescription(roleType);
    }

    private static string? GetDefaultDescription(UserRole roleType)
    {
        return roleType switch
        {
            UserRole.Operator => "Оператор производственного оборудования",
            UserRole.Technologist => "Технолог, настраивающий производственные процессы",
            UserRole.Manager => "Менеджер производства",
            UserRole.Admin => "Администратор системы",
            _ => null
        };
    }
}