namespace reports_service.DTO;

public class ProductionStatsDTO
{
    public int TotalOrders { get; set; }
    public int CompletedOrders { get; set; }
    public int InProgressOrders { get; set; }
    public decimal CompletionRate { get; set; }
    public decimal AverageCompletionTimeHours { get; set; }
    public Dictionary<string, int> OrdersByStatus { get; set; } = new();
}