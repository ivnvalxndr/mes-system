using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using materials_service.Entities.Enums;
using units_service.Entities;

namespace materials_service.Entities;

public class Material
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    public string Code { get; set; } = string.Empty; 

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    [Required]
    public decimal Quantity { get; set; }

    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Price { get; set; } 

    [Required]
    public int UnitId { get; set; }

    [ForeignKey("UnitId")]
    public Unit Unit { get; set; } = null!;

    public List<MaterialRouteStep> RouteSteps { get; set; } = new();
}