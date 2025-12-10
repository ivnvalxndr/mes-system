using materials_service.Entities;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using units_service.Entities;

[Table("material")]
public class Material
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    [Column("code")]
    public string Code { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    [Column("name")]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    [Column("description")]
    public string? Description { get; set; }

    // Внешний ключ для родительского материала (иерархическая структура)
    [Column("parent_id")]
    public int? ParentId { get; set; }

    // Единица измерения по умолчанию для материала
    [Column("unit_id")]
    public int UnitId { get; set; }

    // Количество в штуках (по умолчанию/базовое)
    [Column("pcs")]
    public decimal? Pcs { get; set; }

    // Количество в метрах (по умолчанию/базовое)
    [Column("mts")]
    public decimal? Mts { get; set; }

    // Количество в тоннах (по умолчанию/базовое)
    [Column("tns")]
    public decimal? Tns { get; set; }

    // Навигационное свойство к родительскому материалу
    [ForeignKey("ParentId")]
    public Material? Parent { get; set; }

    // Навигационное свойство к дочерним материалам
    [InverseProperty("Parent")]
    public List<Material> Children { get; set; } = new();

    // Навигационное свойство к единице измерения
    [ForeignKey("UnitId")]
    public Unit Unit { get; set; } = null!;

    // Навигационное свойство для шагов маршрута
    public List<MaterialRouteStep> RouteSteps { get; set; } = new();
}