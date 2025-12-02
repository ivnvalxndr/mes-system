using System.ComponentModel.DataAnnotations;

namespace materials_service.Entities;

public class Material
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string MaterialNumber { get; set; } = string.Empty;

    [Required]
    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    [Required]
    public string Type { get; set; } = string.Empty;

    [Required]
    public string Unit { get; set; } = "шт";

    [Required]
    public decimal Quantity { get; set; }

    public decimal MinQuantity { get; set; }
    public decimal MaxQuantity { get; set; }

    public MaterialStatus Status { get; set; } = MaterialStatus.ВПоступлении;

    public string StorageLocation { get; set; } = string.Empty;
    public string BatchNumber { get; set; } = string.Empty;
    public DateTime? ExpiryDate { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public string CreatedBy { get; set; } = string.Empty;
}