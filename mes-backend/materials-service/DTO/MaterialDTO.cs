using System.ComponentModel.DataAnnotations;


namespace materials_service.DTO;

public class MaterialDTO
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int? ParentId { get; set; }
    public int UnitId { get; set; }
    public decimal? Pcs { get; set; }
    public decimal? Mts { get; set; }
    public decimal? Tns { get; set; }

    public UnitDTO? Unit { get; set; }
    public MaterialSimpleDTO? Parent { get; set; }
    public List<MaterialSimpleDTO> Children { get; set; } = new();
    public List<MaterialRouteStepDTO> RouteSteps { get; set; } = new();
}

public class MaterialSimpleDTO
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
}

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

    public int? ParentId { get; set; }

    [Required]
    public int UnitId { get; set; }

    public decimal? Pcs { get; set; }
    public decimal? Mts { get; set; }
    public decimal? Tns { get; set; }
}

public class UpdateMaterialDTO
{
    [MaxLength(50)]
    public string? Code { get; set; }

    [MaxLength(200)]
    public string? Name { get; set; }

    [MaxLength(500)]
    public string? Description { get; set; }

    public int? ParentId { get; set; }
    public int? UnitId { get; set; }
    public decimal? Pcs { get; set; }
    public decimal? Mts { get; set; }
    public decimal? Tns { get; set; }
}