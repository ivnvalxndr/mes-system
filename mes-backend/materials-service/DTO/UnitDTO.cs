using System.ComponentModel.DataAnnotations;

namespace materials_service.DTO;

public class UnitDTO
{
    public int Id { get; set; }
    public int Code { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}

public class CreateUnitDTO
{
    [Required]
    public int Code { get; set; }

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;

    [Required]
    public string Type { get; set; } = string.Empty;
}

public class UpdateUnitDTO
{
    [MaxLength(200)]
    public string? Name { get; set; }

    [MaxLength(500)]
    public string? Description { get; set; }

    public string? Type { get; set; }
    public string? Status { get; set; }
}