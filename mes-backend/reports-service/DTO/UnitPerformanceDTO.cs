namespace reports_service.DTO;

public class UnitPerformanceDTO
{
    public int TotalUnits { get; set; }
    public int AvailableUnits { get; set; }
    public int InUseUnits { get; set; }
    public int MaintenanceUnits { get; set; }
    public decimal OverallUtilization { get; set; }
    public Dictionary<string, int> UnitsByStatus { get; set; } = new();
}