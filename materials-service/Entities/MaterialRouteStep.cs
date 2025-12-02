using System.ComponentModel.DataAnnotations;

namespace materials_service.Entities;

public class MaterialRouteStep
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int MaterialId { get; set; }
    public Material Material { get; set; } = null!;

    public RouteStepType StepType { get; set; }

    public string FromLocation { get; set; } = string.Empty;
    public string ToLocation { get; set; } = string.Empty;

    public decimal Quantity { get; set; }

    public string? ProductionOrderId { get; set; }
    public string? UnitId { get; set; }

    public string Notes { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string CreatedBy { get; set; } = string.Empty;
}