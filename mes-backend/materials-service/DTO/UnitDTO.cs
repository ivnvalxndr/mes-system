using System.ComponentModel.DataAnnotations;
using units_service.Entities.Enums;

namespace units_service.DTO;

public class UnitDTO
{
    public int Id { get; set; }

    // Read-only
    public string UnitNumber { get; set; } = string.Empty;
    public UnitStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string CreatedBy { get; set; } = string.Empty;

    // For create/update
    [Required]
    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    [Required]
    public UnitType Type { get; set; }

    public string Model { get; set; } = string.Empty;
    public string Manufacturer { get; set; } = string.Empty;
    public string SerialNumber { get; set; } = string.Empty;

    public DateTime InstallationDate { get; set; }
    public DateTime? LastMaintenanceDate { get; set; }
    public DateTime? NextMaintenanceDate { get; set; }

    [Range(0, 100)]
    public decimal? CurrentLoad { get; set; }

    public decimal? MaxCapacity { get; set; }
    public string Location { get; set; } = string.Empty;

    public int? CurrentProductionOrderId { get; set; }
}