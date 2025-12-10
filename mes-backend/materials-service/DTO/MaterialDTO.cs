using System.ComponentModel.DataAnnotations;

namespace materials_service.DTO;

public class CreateMaterialDTO
{
    [Required]
    [MaxLength(50)]
    public string Code { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    [Required]
    [Range(0.001, double.MaxValue)]
    public decimal Quantity { get; set; }

    [Required]
    [Range(0, double.MaxValue)]
    public decimal Price { get; set; }

    [Required]
    public int UnitId { get; set; }
}

public class UpdateMaterialDTO
{
    [MaxLength(200)]
    public string? Name { get; set; }

    [MaxLength(500)]
    public string? Description { get; set; }

    [Range(0.001, double.MaxValue)]
    public decimal? Quantity { get; set; }

    [Range(0, double.MaxValue)]
    public decimal? Price { get; set; }

    public int? UnitId { get; set; }
}

public class MaterialDTO : CreateMaterialDTO
{
    public int Id { get; set; }
    public decimal TotalValue { get; set; }
    public List<MaterialRouteStepDTO> RouteSteps { get; set; } = new();
}