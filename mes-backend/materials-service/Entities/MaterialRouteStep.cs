using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using materials_service.Entities.Enums;

namespace materials_service.Entities;

[Table("material_rote_steps")]
public class MaterialRouteStep
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int MaterialId { get; set; }

    [Required]
    public MaterialRouteStepType StepType { get; set; } 

    [Required]
    [MaxLength(200)]
    public string FromLocation { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string ToLocation { get; set; } = string.Empty;

    [Required]
    public decimal Quantity { get; set; }

    [MaxLength(50)]
    public string? UnitId { get; set; }

    [MaxLength(1000)]
    public string Notes { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Навигационное свойство
    public Material Material { get; set; } = null!;
}