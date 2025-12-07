using System.ComponentModel.DataAnnotations;
using materials_service.Entities.Enums;

namespace materials_service.DTO;

// Для создания шага маршрута (без Id и CreatedAt)
public class CreateMaterialRouteStepDTO
{
    [Required]
    public int MaterialId { get; set; }

    [Required]
    public MaterialRouteStepType StepType { get; set; }

    [Required]
    public string FromLocation { get; set; } = string.Empty;

    [Required]
    public string ToLocation { get; set; } = string.Empty;

    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Quantity must be greater than 0")]
    public decimal Quantity { get; set; }

    public string? UnitId { get; set; }

    [MaxLength(1000)]
    public string Notes { get; set; } = string.Empty;
}

// Для чтения/обновления шага маршрута
public class MaterialRouteStepDTO : CreateMaterialRouteStepDTO
{
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; }
}