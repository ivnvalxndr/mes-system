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

    [Required]
    [Range(0, double.MaxValue)]
    [Column("quantity", TypeName = "decimal(18,3)")]
    public decimal Quantity { get; set; }

    [Required]
    [Range(0, double.MaxValue)]
    [Column("price", TypeName = "decimal(18,2)")]
    public decimal Price { get; set; }

    [Required]
    [Column("unit_id")]
    public int UnitId { get; set; }

    // ДОБАВЬ ЭТО НАВИГАЦИОННОЕ СВОЙСТВО:
    [ForeignKey("UnitId")]
    public Unit Unit { get; set; } = null!;

    // Навигационное свойство для шагов маршрута
    public List<MaterialRouteStep> RouteSteps { get; set; } = new();

    [NotMapped]
    public decimal TotalValue => Quantity * Price;
}