using System.ComponentModel.DataAnnotations;
using units_service.Entities.Enums;

namespace units_service.Entities;

public class UnitStatusHistory
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int UnitId { get; set; }
    public Unit Unit { get; set; } = null!;

    public UnitStatus PreviousStatus { get; set; }
    public UnitStatus NewStatus { get; set; }

    public string? Reason { get; set; }
    public string? Notes { get; set; }

    public int? ProductionOrderId { get; set; } // Если смена статуса связана с заказом

    public DateTime ChangedAt { get; set; } = DateTime.UtcNow;
    public string ChangedBy { get; set; } = string.Empty;
}