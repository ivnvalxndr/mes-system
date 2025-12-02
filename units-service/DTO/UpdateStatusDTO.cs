using units_service.Entities.Enums;

namespace units_service.DTO;

public class UpdateStatusDTO
{
    public UnitStatus Status { get; set; }
    public string? Reason { get; set; }
    public string? Notes { get; set; }
    public int? ProductionOrderId { get; set; }
}