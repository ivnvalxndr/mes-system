using System.ComponentModel.DataAnnotations;
using units_service.Entities.Enums;

namespace units_service.Entities;

public class Unit
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string UnitNumber { get; set; } = string.Empty;

    [Required]
    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    [Required]
    public UnitType Type { get; set; }

    public UnitStatus Status { get; set; } = UnitStatus.Available;

    public string Model { get; set; } = string.Empty;
    public string Manufacturer { get; set; } = string.Empty;
    public string SerialNumber { get; set; } = string.Empty;

    public DateTime InstallationDate { get; set; }
    public DateTime? LastMaintenanceDate { get; set; }
    public DateTime? NextMaintenanceDate { get; set; }

    public decimal? CurrentLoad { get; set; } // Текущая загрузка в %
    public decimal? MaxCapacity { get; set; } // Максимальная мощность

    public string Location { get; set; } = string.Empty;

    // Связь с Production Order (если используется)
    public int? CurrentProductionOrderId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public string CreatedBy { get; set; } = string.Empty;
}