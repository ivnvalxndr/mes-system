using System.ComponentModel.DataAnnotations;

namespace materials_service.DTO;

public class MaterialDTO
{
    public int Id { get; set; }

    // Read-only
    public string MaterialNumber { get; set; } = string.Empty;
    public MaterialStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string CreatedBy { get; set; } = string.Empty;

    // For create/update
    [Required]
    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    [Required]
    public string Type { get; set; } = string.Empty;

    [Required]
    public string Unit { get; set; } = "шт";

    [Required]
    [Range(0.01, double.MaxValue)]
    public decimal Quantity { get; set; }

    public decimal MinQuantity { get; set; }
    public decimal MaxQuantity { get; set; }

    public string StorageLocation { get; set; } = string.Empty;
    public string BatchNumber { get; set; } = string.Empty;
    public DateTime? ExpiryDate { get; set; }
}