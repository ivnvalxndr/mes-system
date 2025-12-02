namespace materials_service.DTO;

public class RouteStepDTO
{
    public int MaterialId { get; set; }
    public RouteStepType StepType { get; set; }
    public string FromLocation { get; set; } = string.Empty;
    public string ToLocation { get; set; } = string.Empty;
    public decimal Quantity { get; set; }
    public string? ProductionOrderId { get; set; }
    public string? UnitId { get; set; }
    public string Notes { get; set; } = string.Empty;
}