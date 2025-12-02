namespace reports_service.DTO;

public class KPIDTO
{
    public decimal OEE { get; set; } // Overall Equipment Effectiveness
    public decimal ProductionEfficiency { get; set; }
    public decimal QualityRate { get; set; }
    public decimal OnTimeDelivery { get; set; }
    public decimal MaterialUsageEfficiency { get; set; }
}